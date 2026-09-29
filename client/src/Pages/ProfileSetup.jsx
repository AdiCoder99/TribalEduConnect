import React, { useState } from 'react';
import { useApp } from '../Context/AppContext';
import { 
  ShieldCheck, 
  User, 
  GraduationCap, 
  FileCheck, 
  Building2, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle,
  Save,
  ArrowRight,
  ArrowLeft,
  FileText
} from 'lucide-react';

const ProfileSetup = () => {
  const { user } = useApp();
  const [activeStep, setActiveStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: user?.name || 'Aditya Srivastava',
    dob: '2004-05-12',
    gender: 'Male',
    category: 'Scheduled Tribe (ST)',
    subCaste: 'Gond',
    institution: 'Central University of Chhattisgarh (GGV)',
    course: 'B.Tech Computer Science & Engineering',
    semester: '4th Semester',
    rollNumber: 'GGV/2024/CSE/042',
    annualIncome: '1,50,000',
    incomeCertNo: 'INC/CG/2025/99812',
    bankName: 'State Bank of India',
    accountNo: '••••••••4819',
    ifscCode: 'SBIN0001234',
    dbtStatus: 'Linked & Verified'
  });

  const [uploadedFiles, setUploadedFiles] = useState({
    casteCert: 'caste_certificate_aditya.pdf',
    incomeCert: null,
    marksheet: '12th_marksheet_verified.pdf'
  });

  const steps = [
    { id: 1, label: 'e-KYC & Personal', icon: User },
    { id: 2, label: 'Academic Details', icon: GraduationCap },
    { id: 3, label: 'Caste & Income', icon: FileCheck },
    { id: 4, label: 'Bank & DBT Link', icon: Building2 },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (field, file) => {
    setUploadedFiles((prev) => ({ ...prev, [field]: file ? file.name : null }));
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-slate-900 border-l-4 border-emerald-600 p-5 text-white rounded-xs shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-xs uppercase font-bold">
              Verification Vault
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Profile Completion: 83%</span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">Student Profile & Verification Vault</h2>
          <p className="text-xs text-slate-300">
            Keep your verified credentials updated to receive instant scheme eligibility matching and direct benefit disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-800 p-2.5 border border-slate-700 rounded-xs text-xs text-emerald-400 font-bold shrink-0">
          <ShieldCheck className="w-4 h-4" /> Aadhaar e-KYC Verified
        </div>
      </div>

      {/* Step Navigation Bar */}
      <div className="bg-white border border-slate-300 rounded-xs p-3 grid grid-cols-2 lg:grid-cols-4 gap-2">
        {steps.map((step) => {
          const StepIcon = step.icon;
          const isActive = activeStep === step.id;
          const isCompleted = activeStep > step.id;

          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              className={`flex items-center gap-3 p-2.5 border rounded-xs text-left transition ${
                isActive
                  ? 'bg-emerald-800 text-white border-emerald-900 font-bold'
                  : isCompleted
                  ? 'bg-slate-50 text-slate-900 border-slate-300 hover:bg-slate-100'
                  : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className={`w-7 h-7 flex items-center justify-center font-mono text-xs rounded-xs font-bold border ${
                isActive 
                  ? 'bg-white text-emerald-900 border-white' 
                  : isCompleted 
                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300' 
                  : 'bg-slate-100 text-slate-500 border-slate-300'
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-emerald-800" /> : step.id}
              </div>
              <div className="min-w-0">
                <p className="text-[10px] uppercase font-mono tracking-wider opacity-80">Step 0{step.id}</p>
                <p className="text-xs font-bold truncate">{step.label}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Form Container */}
      <div className="bg-white border border-slate-300 rounded-xs p-6 shadow-2xs space-y-6">
        
        {/* STEP 1: Personal Details */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 1: e-KYC & Personal Information</h3>
                <p className="text-[11px] text-slate-500">Details synced directly via UIDAI e-KYC authentication.</p>
              </div>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-xs">
                E-KYC LOCKED
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name (As per Aadhaar)</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Social Category</label>
                <input
                  type="text"
                  readOnly
                  value={formData.category}
                  className="w-full p-2 bg-slate-100 border border-slate-300 rounded-xs text-slate-700 font-bold cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Academic Details */}
        {activeStep === 2 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 2: Educational Institution Details</h3>
              <p className="text-[11px] text-slate-500">Provide details of your enrolled higher education institute.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">University / Institute Name</label>
                <input
                  type="text"
                  name="institution"
                  value={formData.institution}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Course / Degree Program</label>
                <input
                  type="text"
                  name="course"
                  value={formData.course}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Current Semester / Year</label>
                <input
                  type="text"
                  name="semester"
                  value={formData.semester}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Enrollment / Roll Number</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Marksheet (Latest Semester)</label>
                <div className="flex items-center gap-2 border border-slate-300 p-1.5 bg-slate-50 rounded-xs">
                  <FileText className="w-4 h-4 text-slate-500 shrink-0" />
                  <span className="text-[11px] text-slate-700 truncate flex-1">
                    {uploadedFiles.marksheet || 'No file selected'}
                  </span>
                  <label className="bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold px-2 py-1 cursor-pointer rounded-xs border border-slate-400">
                    Browse
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload('marksheet', e.target.files[0])} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Caste & Income Verification */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 3: Caste & Income Verification</h3>
              <p className="text-[11px] text-slate-500">Official government certificate numbers for automated eligibility check.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Sub-Tribe / Community</label>
                <input
                  type="text"
                  name="subCaste"
                  value={formData.subCaste}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Annual Family Income (₹)</label>
                <input
                  type="text"
                  name="annualIncome"
                  value={formData.annualIncome}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Income Certificate Number</label>
                <input
                  type="text"
                  name="incomeCertNo"
                  value={formData.incomeCertNo}
                  onChange={handleInputChange}
                  placeholder="e.g. INC/2026/XXXXX"
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Upload Valid Income Certificate (PDF)</label>
                <div className="flex items-center gap-2 border border-amber-300 p-1.5 bg-amber-50/50 rounded-xs">
                  <UploadCloud className="w-4 h-4 text-amber-700 shrink-0" />
                  <span className="text-[11px] text-slate-700 truncate flex-1">
                    {uploadedFiles.incomeCert || 'Action Required: Please upload PDF'}
                  </span>
                  <label className="bg-amber-800 hover:bg-amber-900 text-white text-[10px] font-bold px-2 py-1 cursor-pointer rounded-xs">
                    Upload
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => handleFileUpload('incomeCert', e.target.files[0])} 
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Bank Details & Direct Benefit Transfer */}
        {activeStep === 4 && (
          <div className="space-y-4">
            <div className="border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Step 4: Direct Benefit Transfer (DBT) Account</h3>
              <p className="text-[11px] text-slate-500">Scholarship disbursements are transferred directly to your Aadhaar-seeded bank account.</p>
            </div>

            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xs flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-emerald-950 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-800 shrink-0" />
                <span>Aadhaar Payment Bridge (APB) Seeding Status:</span>
              </div>
              <span className="text-[10px] font-mono font-bold bg-emerald-800 text-white px-2 py-0.5 rounded-xs uppercase">
                {formData.dbtStatus}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  name="accountNo"
                  value={formData.accountNo}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden font-mono uppercase"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Navigation Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            disabled={activeStep === 1}
            onClick={() => setActiveStep((prev) => Math.max(prev - 1, 1))}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-bold border border-slate-300 rounded-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Previous Step
          </button>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-xs transition cursor-pointer">
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>

            {activeStep < 4 ? (
              <button
                onClick={() => setActiveStep((prev) => Math.min(prev + 1, 4))}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xs transition cursor-pointer uppercase tracking-wider"
              >
                Next Step <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => alert('Profile Vault Saved & Sync Request Submitted!')}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xs transition cursor-pointer uppercase tracking-wider"
              >
                Submit Vault & Verify <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileSetup;