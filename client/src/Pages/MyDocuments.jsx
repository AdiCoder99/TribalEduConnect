import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Context/AppContext';
import {
  FileText,
  ShieldCheck,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  ArrowLeft,
  FileCheck,
  Search,
  Filter,
  ExternalLink,
  Lock,
  X
} from 'lucide-react';

const MyDocuments = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Document Vault State
  const [documents, setDocuments] = useState([
    {
      id: 'DOC-01',
      title: 'Aadhaar e-KYC Verification Certificate',
      category: 'IDENTITY',
      issuer: 'UIDAI Authority of India',
      refNumber: 'eKYC-UIDAI-VERIFIED',
      uploadDate: '12 May 2025',
      fileSize: '420 KB',
      fileType: 'PDF',
      fileName: 'aadhaar_ekyc_verified.pdf',
      status: 'Verified',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isLocked: true,
      notes: 'Cryptographically sealed via UIDAI e-KYC authentication pipeline.'
    },
    {
      id: 'DOC-02',
      title: 'Permanent Caste Certificate (Scheduled Tribe)',
      category: 'CASTE',
      issuer: 'Tehsildar / Sub-Divisional Magistrate (SDM)',
      refNumber: 'CG/CST/2024/4910',
      uploadDate: '14 Jun 2025',
      fileSize: '1.2 MB',
      fileType: 'PDF',
      fileName: 'caste_certificate_aditya.pdf',
      status: 'Verified',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      sha256Hash: '4f53cda18c2baa0c0354bb5f9a3ecbe5ed12ab4d8e11ba873c2f11161202b945',
      isLocked: true,
      notes: 'Verified against State Tribal Welfare database registry.'
    },
    {
      id: 'DOC-03',
      title: 'Annual Family Income Certificate (FY 2025-26)',
      category: 'INCOME',
      issuer: 'Revenue Department, Government of Chhattisgarh',
      refNumber: 'INC/CG/2025/99812',
      uploadDate: '20 Jul 2025',
      fileSize: '880 KB',
      fileType: 'PDF',
      fileName: 'income_certificate_2025.pdf',
      status: 'Pending Verification',
      statusColor: 'bg-sky-100 text-sky-900 border-sky-300',
      sha256Hash: '98234abccfe09121a8479213cbdfa321980312cbdeaa1123bc891723ab987213',
      isLocked: false,
      notes: 'Queued for district revenue authority digital cross-match.'
    },
    {
      id: 'DOC-04',
      title: 'Class 12th Higher Secondary Marksheet',
      category: 'ACADEMIC',
      issuer: 'Central Board of Secondary Education (CBSE)',
      refNumber: 'CBSE/2022/HS/88912',
      uploadDate: '10 Aug 2025',
      fileSize: '1.5 MB',
      fileType: 'PDF',
      fileName: '12th_marksheet_verified.pdf',
      status: 'Verified',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      sha256Hash: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
      isLocked: true,
      notes: 'DigiLocker direct verification record.'
    },
    {
      id: 'DOC-05',
      title: 'Current Academic Year Enrolment Bonafide',
      category: 'ACADEMIC',
      issuer: 'Guru Ghasidas Vishwavidyalaya (GGV)',
      refNumber: 'GGV/CSE/BONA/2026/042',
      uploadDate: '02 Sep 2025',
      fileSize: '650 KB',
      fileType: 'PDF',
      fileName: 'bonafide_certificate_ggv.pdf',
      status: 'Action Required',
      statusColor: 'bg-amber-100 text-amber-900 border-amber-300',
      sha256Hash: 'Pending',
      isLocked: false,
      notes: 'Clarification requested: Principal seal must be clearly visible.'
    }
  ]);

  // Upload Form State
  const [newUpload, setNewUpload] = useState({
    title: '',
    category: 'ACADEMIC',
    refNumber: '',
    file: null
  });

  const categories = [
    { id: 'ALL', label: 'All Documents', count: documents.length },
    { id: 'IDENTITY', label: 'Identity & e-KYC', count: documents.filter(d => d.category === 'IDENTITY').length },
    { id: 'CASTE', label: 'Caste & Tribe', count: documents.filter(d => d.category === 'CASTE').length },
    { id: 'INCOME', label: 'Income Certificates', count: documents.filter(d => d.category === 'INCOME').length },
    { id: 'ACADEMIC', label: 'Academic & Institute', count: documents.filter(d => d.category === 'ACADEMIC').length },
  ];

  // Filtering Logic
  const filteredDocuments = documents.filter((doc) => {
    const matchesCategory = activeCategory === 'ALL' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.issuer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFileUpload = (e) => {
    e.preventDefault();
    if (!newUpload.title || !newUpload.refNumber || !newUpload.file) {
      alert('Please fill out all required fields and choose a valid document.');
      return;
    }

    const newDocObj = {
      id: `DOC-0${documents.length + 1}`,
      title: newUpload.title,
      category: newUpload.category,
      issuer: 'Institutional Upload',
      refNumber: newUpload.refNumber,
      uploadDate: 'Today',
      fileSize: `${(newUpload.file.size / 1024).toFixed(0)} KB`,
      fileType: 'PDF',
      fileName: newUpload.file.name,
      status: 'Pending Verification',
      statusColor: 'bg-sky-100 text-sky-900 border-sky-300',
      sha256Hash: 'Auto-generating SHA256...',
      isLocked: false,
      notes: 'Uploaded by student. Awaiting desk scrutiny audit.'
    };

    setDocuments([newDocObj, ...documents]);
    setIsUploadModalOpen(false);
    setNewUpload({ title: '', category: 'ACADEMIC', refNumber: '', file: null });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this document from your vault?')) {
      setDocuments(documents.filter(doc => doc.id !== id));
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border-l-4 border-emerald-600 p-5 text-white rounded-xs shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-xs uppercase font-bold">
              Digital Locker Vault
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Encryption: SHA-256 Validated
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">Student Document & Verification Vault</h2>
          <p className="text-xs text-slate-300">
            Secure, reusable digital certificate repository. Verified documents are directly linked to scholarship applications[cite: 1].
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 rounded-xs text-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xs text-xs uppercase tracking-wider transition cursor-pointer"
          >
            <UploadCloud className="w-3.5 h-3.5" /> Upload Document
          </button>
        </div>
      </div>

      {/* 2. Vault Telemetry & DigiLocker Sync Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-white border border-slate-300 p-3.5 rounded-xs flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Vault Verification Status</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">4 of 5 Verified</p>
          </div>
          <ShieldCheck className="w-6 h-6 text-emerald-800" />
        </div>

        <div className="bg-white border border-slate-300 p-3.5 rounded-xs flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">DigiLocker Integration</span>
            <p className="text-sm font-bold text-slate-900 mt-0.5">Active & Synced</p>
          </div>
          <button 
            onClick={() => alert('Syncing latest certificates with DigiLocker API...')}
            className="flex items-center gap-1 text-[11px] font-mono font-bold text-emerald-800 hover:underline cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Sync Now
          </button>
        </div>

        <div className="bg-white border border-slate-300 p-3.5 rounded-xs flex items-center justify-between shadow-2xs">
          <div>
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">Digital Integrity Lock</span>
            <p className="text-sm font-bold text-emerald-800 mt-0.5 font-mono">e-KYC Sealed[cite: 1]</p>
          </div>
          <Lock className="w-5 h-5 text-slate-600" />
        </div>
      </div>

      {/* 3. Category Filter & Search Toolbar */}
      <div className="bg-white border border-slate-300 rounded-xs p-3 space-y-3 shadow-2xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          
          {/* Category Tabs */}
          <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-xs transition cursor-pointer border whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-emerald-800 text-white border-emerald-900'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat.label} ({cat.count})
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title or ref number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xs text-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
            />
          </div>

        </div>
      </div>

      {/* 4. Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredDocuments.map((doc) => (
          <div 
            key={doc.id}
            className="bg-white border border-slate-300 rounded-xs shadow-2xs p-4 flex flex-col justify-between space-y-4 hover:border-slate-400 transition"
          >
            {/* Top Info */}
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5">
                  <div className="p-2 bg-slate-100 border border-slate-300 rounded-xs text-slate-700 shrink-0 mt-0.5">
                    <FileText className="w-5 h-5 text-emerald-800" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-snug">{doc.title}</h3>
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">Issuer: {doc.issuer}</p>
                  </div>
                </div>

                <span className={`px-2 py-0.5 text-[9px] font-mono font-bold border rounded-xs uppercase tracking-wider shrink-0 ${doc.statusColor}`}>
                  {doc.status}
                </span>
              </div>

              {/* Document Metadata Fields */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs">
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">Certificate Number</span>
                  <span className="text-slate-900 font-bold truncate block">{doc.refNumber}</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs">
                  <span className="text-[9px] text-slate-500 uppercase block font-semibold">File Spec</span>
                  <span className="text-slate-900 font-bold block">{doc.fileType} • {doc.fileSize}</span>
                </div>
              </div>

              <div className="p-2 bg-slate-50/80 border border-slate-200 rounded-xs text-[11px] text-slate-600 flex items-start gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span className="line-clamp-2">{doc.notes}</span>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[10px] font-mono text-slate-400">
                Uploaded: {doc.uploadDate}
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setPreviewDoc(doc)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 rounded-xs text-[11px] transition cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> Inspect
                </button>

                <button
                  onClick={() => alert(`Downloading ${doc.fileName}...`)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 rounded-xs text-[11px] transition cursor-pointer"
                >
                  <Download className="w-3 h-3" />
                </button>

                {!doc.isLocked && (
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="p-1 text-slate-400 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200 rounded-xs transition cursor-pointer"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {filteredDocuments.length === 0 && (
        <div className="bg-white border border-slate-300 rounded-xs p-8 text-center space-y-2">
          <FileText className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-xs font-bold text-slate-800 uppercase">No Documents Located</h4>
          <p className="text-[11px] text-slate-500">No records match the specified search query or category filter.</p>
        </div>
      )}

      {/* 5. Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xs w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-emerald-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs tracking-tight uppercase font-mono">Vault Verification Audit Slip</span>
              </div>
              <button 
                onClick={() => setPreviewDoc(null)}
                className="text-slate-400 hover:text-white font-mono text-xs font-bold px-2 py-0.5 rounded-xs hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase font-bold">Document Title</span>
                <h4 className="text-sm font-bold text-slate-900">{previewDoc.title}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5 font-mono">Registry Reference: {previewDoc.refNumber}</p>
              </div>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs flex justify-between">
                  <span className="text-slate-500">Issuer Authority:</span>
                  <span className="font-bold text-slate-900">{previewDoc.issuer}</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs flex justify-between">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="font-bold text-emerald-800">{previewDoc.status}</span>
                </div>
                <div className="p-2 bg-slate-50 border border-slate-200 rounded-xs flex justify-between">
                  <span className="text-slate-500">Storage Filename:</span>
                  <span className="font-bold text-slate-800">{previewDoc.fileName}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-slate-500 block mb-1 uppercase font-semibold">Cryptographic SHA-256 Hash</span>
                <div className="p-2 bg-slate-100 border border-slate-300 rounded-xs text-[10px] font-mono break-all text-slate-800">
                  {previewDoc.sha256Hash}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  onClick={() => alert(`Downloading verified record for ${previewDoc.refNumber}...`)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xs transition text-xs flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> Download Verified Copy
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 6. Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-xs w-full max-w-md shadow-xl overflow-hidden">
            
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b-2 border-emerald-600">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-emerald-400" />
                <span className="font-bold text-xs uppercase tracking-tight font-mono">Upload Certificate to Vault</span>
              </div>
              <button 
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-xs font-bold px-2 py-0.5 rounded-xs hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="p-5 space-y-3.5 text-xs">
              
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Classification</label>
                <select 
                  value={newUpload.category}
                  onChange={(e) => setNewUpload({ ...newUpload, category: e.target.value })}
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                >
                  <option value="IDENTITY">Identity & e-KYC</option>
                  <option value="CASTE">Caste & Tribe Certificate</option>
                  <option value="INCOME">Income Certificate</option>
                  <option value="ACADEMIC">Academic Marksheet / Bonafide</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Certificate / Document Title</label>
                <input 
                  type="text" 
                  placeholder="e.g. 4th Semester Marksheet"
                  value={newUpload.title}
                  onChange={(e) => setNewUpload({ ...newUpload, title: e.target.value })}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Certificate Registration Number</label>
                <input 
                  type="text" 
                  placeholder="e.g. INC/2026/XXXXX or Roll Number"
                  value={newUpload.refNumber}
                  onChange={(e) => setNewUpload({ ...newUpload, refNumber: e.target.value })}
                  required
                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xs text-slate-900 focus:bg-white focus:border-emerald-800 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select File (PDF, Max 5MB)</label>
                <input 
                  type="file" 
                  accept=".pdf"
                  onChange={(e) => setNewUpload({ ...newUpload, file: e.target.files[0] })}
                  required
                  className="w-full text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-xs file:border file:border-slate-300 file:text-xs file:font-bold file:bg-slate-100 hover:file:bg-slate-200 cursor-pointer"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-300 rounded-xs transition text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xs uppercase tracking-wider transition text-xs"
                >
                  Upload & Verify
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyDocuments;