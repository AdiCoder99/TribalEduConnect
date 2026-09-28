import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Upload, ArrowLeft, CheckCircle } from 'lucide-react';

const ApplyScheme = () => {
  const { schemeId } = useParams();
  const navigate = useNavigate();

  const [applicantData, setApplicantData] = useState({
    name: '',
    phone: '',
    stCertificateNo: '',
    annualIncome: '',
    academicScore: '',
    state: '',
    university: '',
    course: '',
    rollNumber: '',
  });

  const [bankDetails, setBankDetails] = useState({
    accountNo: '',
    ifscCode: '',
  });

  const [casteDoc, setCasteDoc] = useState(null);
  const [incomeDoc, setIncomeDoc] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!casteDoc || !incomeDoc) {
      setError('Please upload both Caste and Income Certificates.');
      return;
    }

    setSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('schemeId', schemeId);
    formData.append('applicantData', JSON.stringify(applicantData));
    formData.append('bankDetails', JSON.stringify(bankDetails));
    formData.append('casteDoc', casteDoc);
    formData.append('incomeDoc', incomeDoc);

    try {
      const res = await API.post('/applications/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data?.success) {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit application.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-slate-800 mb-1">Scholarship Application</h1>
        <p className="text-slate-500 text-sm mb-6">Complete your profile details and attach verified documents.</p>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase border-b pb-1">Applicant Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={applicantData.name}
                  onChange={(e) => setApplicantData({ ...applicantData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                <input
                  type="text"
                  required
                  value={applicantData.phone}
                  onChange={(e) => setApplicantData({ ...applicantData, phone: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">ST Certificate Number</label>
                <input
                  type="text"
                  required
                  value={applicantData.stCertificateNo}
                  onChange={(e) => setApplicantData({ ...applicantData, stCertificateNo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Annual Family Income (₹)</label>
                <input
                  type="number"
                  required
                  value={applicantData.annualIncome}
                  onChange={(e) => setApplicantData({ ...applicantData, annualIncome: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Academic Info */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase border-b pb-1">Academic & Bank Info</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">University / Institute</label>
                <input
                  type="text"
                  required
                  value={applicantData.university}
                  onChange={(e) => setApplicantData({ ...applicantData, university: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  value={applicantData.course}
                  onChange={(e) => setApplicantData({ ...applicantData, course: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Bank Account Number</label>
                <input
                  type="text"
                  required
                  value={bankDetails.accountNo}
                  onChange={(e) => setBankDetails({ ...bankDetails, accountNo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">IFSC Code</label>
                <input
                  type="text"
                  required
                  value={bankDetails.ifscCode}
                  onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* S3 Document Uploads */}
          <div className="space-y-4">
            <h2 className="text-sm font-bold text-slate-700 uppercase border-b pb-1">Upload Documents (Direct S3 Storage)</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Caste Certificate</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setCasteDoc(e.target.files[0])}
                  className="mt-2 text-xs w-full text-slate-500"
                />
              </div>

              <div className="border-2 border-dashed border-slate-200 p-4 rounded-xl text-center">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Income Certificate</p>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={(e) => setIncomeDoc(e.target.files[0])}
                  className="mt-2 text-xs w-full text-slate-500"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {submitting ? 'Uploading to S3 & Running AI Scrutiny...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ApplyScheme;