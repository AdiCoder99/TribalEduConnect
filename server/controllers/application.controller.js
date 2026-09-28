import Application from '../models/Application.js';
import Scheme from '../models/Scheme.js';
import { evaluateEligibility } from '../services/ruleEngine.js';
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * 1. SUBMIT NEW APPLICATION
 * Handles multi-step form data, forwards uploaded files to Python OCR, and triggers AI Rule Engine.
 */
export const submitApplication = async (req, res) => {
  try {
    // Parse nested object fields if sent via multipart/form-data
    const applicantData = typeof req.body.applicantData === 'string'
      ? JSON.parse(req.body.applicantData)
      : req.body.applicantData || {};

    const bankDetails = typeof req.body.bankDetails === 'string'
      ? JSON.parse(req.body.bankDetails)
      : req.body.bankDetails || {};

    const { schemeId } = req.body;

    // Validate scheme existence
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return res.status(404).json({ success: false, error: 'Selected scheme not found.' });
    }

    // Check for existing application
    const existingApp = await Application.findOne({ user: req.user._id, scheme: schemeId });
    if (existingApp) {
      return res.status(400).json({ success: false, error: 'You have already submitted an application for this scheme.' });
    }

    // Extract S3 Document URLs provided by multer-s3
    const casteDocUrl = req.files?.casteDoc ? req.files.casteDoc[0].location : '';
    const incomeDocUrl = req.files?.incomeDoc ? req.files.incomeDoc[0].location : '';

    // Baseline AI Scrutiny Object
    let aiData = {
      extractedName: applicantData.name || req.user.name,
      extractedIncome: applicantData.annualIncome,
      isStVerified: false,
      isScDetected: false,
      confidenceScore: 50,
      isTamperSuspected: false
    };

    // Forward income certificate from S3 URL to Python OCR Service if uploaded
    if (incomeDocUrl) {
      try {
        // Fetch document buffer from AWS S3
        const imageResponse = await axios.get(incomeDocUrl, { responseType: 'arraybuffer' });

        const formData = new FormData();
        formData.append('file', Buffer.from(imageResponse.data), {
          filename: req.files.incomeDoc[0].originalname,
          contentType: req.files.incomeDoc[0].mimetype,
        });

        const ocrResponse = await axios.post('http://localhost:8000/api/ocr/verify-document', formData, {
          headers: formData.getHeaders()
        });

        if (ocrResponse.data?.success) {
          const parsed = ocrResponse.data.data;
          aiData.extractedIncome = parsed.extracted_income;
          aiData.isStVerified = parsed.is_st_verified;
          aiData.isScDetected = parsed.is_sc_detected;
          aiData.confidenceScore = parsed.confidence_score;
        }
      } catch (ocrError) {
        console.warn('⚠️ FastAPI OCR microservice unreachable. Proceeding with default values:', ocrError.message);
      }
    }

    // Run AI Rule Engine Evaluation against Scheme Limits
    const evaluation = evaluateEligibility(applicantData, aiData, scheme);

    // Save full application document to MongoDB with S3 URLs
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
        casteCertificateUrl: casteDocUrl,
        incomeCertificateUrl: incomeDocUrl
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
 */
export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id).populate('scheme');
    if (!application) {
      return res.status(404).json({ success: false, error: 'Application not found.' });
    }

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

    const applicantData = typeof req.body.applicantData === 'string'
      ? JSON.parse(req.body.applicantData)
      : req.body.applicantData || {};

    if (applicantData?.annualIncome) application.applicant.annualIncome = applicantData.annualIncome;
    if (applicantData?.academicScore) application.applicant.academicScore = applicantData.academicScore;

    // Handle document re-upload & re-verify via Python service
    if (req.files?.incomeDoc && req.files.incomeDoc[0]) {
      const filePath = req.files.incomeDoc[0].path;
      application.documents.incomeCertificateUrl = filePath;

      try {
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const ocrResponse = await axios.post('http://localhost:8000/api/ocr/verify-document', formData, {
          headers: formData.getHeaders()
        });

        if (ocrResponse.data?.success) {
          const parsed = ocrResponse.data.data;
          application.aiScrutiny.extractedIncome = parsed.extracted_income;
          application.aiScrutiny.isStVerified = parsed.is_st_verified;
          application.aiScrutiny.isScDetected = parsed.is_sc_detected;
          application.aiScrutiny.confidenceScore = parsed.confidence_score;
        }
      } catch (ocrError) {
        console.warn('⚠️ OCR re-verification failed:', ocrError.message);
      }
    }

    application.status = 'MANUAL_REVIEW';
    
    application.deficiencyNotes.push({
      field: 'SYSTEM_AUDIT',
      reason: 'Student corrected flagged fields and resubmitted application for review.',
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
 */
export const reviewApplication = async (req, res) => {
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
      message: `Application status updated to ${status}.`,
      data: savedApp
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};