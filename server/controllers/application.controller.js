import Application from '../models/Application.js';
import Scheme from '../models/Scheme.js';
import { evaluateEligibility } from '../services/ruleEngine.js';

/**
 * 1. SUBMIT NEW APPLICATION
 * Handles multi-step form data, document references, and triggers AI Rule Engine evaluation.
 */
export const submitApplication = async (req, res) => {
  try {
    const { schemeId, applicantData, bankDetails } = req.body;

    // Validate scheme existence
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Selected scheme not found.' });
    }

    // Check if student already applied for this active scheme
    const existingApp = await Application.findOne({ user: req.user._id, scheme: schemeId });
    if (existingApp) {
      return res.status(400).json({ success: false, error: 'You have already submitted an application for this scheme.' });
    }

    // Default/Extracted AI Scrutiny payload
    // (This gets enriched when integrated with the Python FastAPI OCR microservice)
    const aiData = {
      extractedName: applicantData.name || req.user.name,
      extractedIncome: applicantData.annualIncome,
      extractedCasteCategory: 'Scheduled Tribe',
      confidenceScore: 90,
      isTamperSuspected: false
    };

    // Run AI Rule Engine Evaluation against Scheme Limits
    const evaluation = evaluateEligibility(applicantData, aiData, scheme);

    // Save full application document to MongoDB
    const application = await Application.create({
      user: req.user._id,
      scheme: scheme._id,
      applicant: {
        name: applicantData.name || req.user.name,
        email: req.user.email,
        phone: applicantData.phone,
        stCertificateNo: applicantData.stCertificateNo || req.user.stCertificateNo,
        annualIncome: applicantData.annualIncome,
        academicScore: applicantData.academicScore,
        state: applicantData.state,
        university: applicantData.university,
        course: applicantData.course,
        rollNumber: applicantData.rollNumber,
        bankAccountNo: bankDetails?.accountNo || '',
        ifscCode: bankDetails?.ifscCode || ''
      },
      documents: {
        casteCertificateUrl: req.files?.casteDoc ? req.files.casteDoc[0].path : 'sample_caste.pdf',
        incomeCertificateUrl: req.files?.incomeDoc ? req.files.incomeDoc[0].path : 'sample_income.pdf'
      },
      aiScrutiny: aiData,
      status: evaluation.status,
      deficiencyNotes: evaluation.flags
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted and evaluated successfully.',
      data: application
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 2. GET STUDENT'S OWN APPLICATIONS
 * Fetches applications belonging to the logged-in student.
 */
export const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ user: req.user._id })
      .populate('scheme', 'schemeCode name description maxIncomeLimit')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 3. GET SINGLE APPLICATION DETAILS & TIMELINE
 * Fetches complete application details for viewing status or tracking.
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('scheme');
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    // Ensure students can only access their own applications
    if (req.user.role === 'STUDENT' && application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized access to this application.' });
    }

    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 4. RESUBMIT DEFICIENT APPLICATION (Student Only)
 * Allows a student to correct flagged income/academic fields or re-upload documents.
 */
export const resubmitApplication = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    if (application.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, error: 'Unauthorized action.' });
    }

    if (application.status !== 'DEFICIENT') {
      return res.status(400).json({ 
        success: false, 
        error: 'Only applications marked as DEFICIENT can be resubmitted.' 
      });
    }

    const { applicantData } = req.body;

    // Update modified fields if provided
    if (applicantData?.annualIncome) application.applicant.annualIncome = applicantData.annualIncome;
    if (applicantData?.academicScore) application.applicant.academicScore = applicantData.academicScore;

    // Update documents if re-uploaded
    if (req.files?.incomeDoc) {
      application.documents.incomeCertificateUrl = req.files.incomeDoc[0].path;
    }

    // Change status from DEFICIENT back to MANUAL_REVIEW for re-scrutiny
    application.status = 'MANUAL_REVIEW';
    
    // Add audit note
    application.deficiencyNotes.push({
      field: 'SYSTEM_AUDIT',
      reason: 'Student corrected flagged fields and resubmitted application.',
      flaggedAt: new Date()
    });

    const updatedApp = await application.save();

    res.json({
      success: true,
      message: 'Application resubmitted successfully. Pending re-verification.',
      data: updatedApp
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 5. GET SCRUTINY QUEUE (Scrutinizer & Super Admin)
 * Filterable application list for verification officers.
 */
export const getScrutinyQueue = async (req, res) => {
  try {
    const { status, state, schemeId } = req.query;
    let query = {};

    if (status) query.status = status;
    if (state) query['applicant.state'] = state;
    if (schemeId) query.scheme = schemeId;

    const applications = await Application.find(query)
      .populate('user', 'name email')
      .populate('scheme', 'schemeCode name')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: applications.length, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * 6. UPDATE APPLICATION STATUS / FLAG DEFICIENCY (Scrutinizer Only)
 * Official action: APPROVE, REJECT, or flag specific DEFICIENT fields.
 */
export const updateApplicationStatus = async (req, res) => {
  const { status, deficiencyNotes } = req.body;
  try {
    const validStatuses = ['APPROVED', 'REJECTED', 'DEFICIENT', 'MANUAL_REVIEW'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status provided.' });
    }

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

    application.status = status;

    // Append any new deficiency flags raised by the scrutinizer
    if (deficiencyNotes && Array.isArray(deficiencyNotes)) {
      deficiencyNotes.forEach(note => {
        application.deficiencyNotes.push({
          field: note.field,
          reason: note.reason,
          flaggedAt: new Date()
        });
      });
    }

    const savedApp = await application.save();

    res.json({
      success: true,
      message: `Application marked as ${status}.`,
      data: savedApp
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};