import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Context/AppContext';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  Plane,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Download,
  UploadCloud,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Building2,
  Calendar,
  Eye,
  Check
} from 'lucide-react';

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useApp();
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [expandedAppId, setExpandedAppId] = useState(1);

  // Application Data List
  const applications = [
    {
      id: 1,
      schemeName: 'National Fellowship for Scheduled Tribe (NFST)',
      appId: 'NFST-2025-8841',
      category: 'Research Fellowship',
      course: 'Ph.D. / M.Phil. Research Studies',
      institution: 'Central University of Chhattisgarh (GGV)',
      appliedDate: '15 Aug 2025',
      sanctionAmount: '₹31,000 / month + HRA',
      status: 'Under Verification',
      statusColor: 'bg-sky-100 text-sky-900 border-sky-300',
      actionNeeded: true,
      actionNote: 'Clarification requested by District Officer: Re-upload updated latest semester marksheet.',
      currentStageIndex: 2,
      stages: [
        { name: 'Application Submitted', date: '15 Aug 2025', state: 'completed' },
        { name: 'Institute Verification', date: '28 Aug 2025', state: 'completed' },
        { name: 'District Desk Scrutiny', date: 'In Progress', state: 'active' },
        { name: 'State Selection Board', date: 'Pending', state: 'pending' },
        { name: 'Disbursement Order', date: 'Pending', state: 'pending' },
      ],
      documents: [
        { name: 'Aadhaar e-KYC Verification Slip', status: 'Verified', ref: 'UIDAI-eKYC-OK' },
        { name: 'Caste Certificate (Gond Community)', status: 'Verified', ref: 'CG/CST/2024/4910' },
        { name: 'Income Certificate (FY 2025-26)', status: 'Verified', ref: 'INC/CG/2025/99812' },
        { name: 'Latest Semester Marksheet', status: 'Resubmission Requested', ref: 'MARK-SEM4.pdf' },
      ],
      paymentStatus: {
        apbSeeded: true,
        bankName: 'State Bank of India',
        accountMasked: '••••••••4819',
        disbursementBatch: 'Batch 4 (Awaiting Final Sanction)',
      }
    },
    {
      id: 2,
      schemeName: 'National Overseas Scholarship (NOS)',
      appId: 'NOS-2024-1102',
      category: 'International Education Grant',
      course: "Master's Programme in Advanced Computer Science",
      institution: 'Foreign University Enrolment',
      appliedDate: '10 Jan 2024',
      sanctionAmount: 'Full Tuition + $15,400 Contingency / annum',
      status: 'Sanctioned',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      actionNeeded: false,
      actionNote: null,
      currentStageIndex: 4,
      stages: [
        { name: 'Application Submitted', date: '10 Jan 2024', state: 'completed' },
        { name: 'Institute Verification', date: '25 Jan 2024', state: 'completed' },
        { name: 'Desk Scrutiny', date: '15 Feb 2024', state: 'completed' },
        { name: 'Selection Board Approved', date: '15 Mar 2024', state: 'completed' },
        { name: 'Direct Treasury Disbursed', date: '15 Apr 2024', state: 'completed' },
      ],
      documents: [
        { name: 'Passport & Visa Verification', status: 'Verified', ref: 'PASS-VERIFIED' },
        { name: 'Caste Validity Certificate', status: 'Verified', ref: 'VAL/ST/2023/118' },
        { name: 'Offer Letter from Enrolled Institution', status: 'Verified', ref: 'UNIV-OFFER-2024' },
      ],
      paymentStatus: {
        apbSeeded: true,
        bankName: 'State Bank of India',
        accountMasked: '••••••••4819',
        disbursementBatch: 'Disbursed • UTR: SBIN202404159981',
      }
    }
  ];

  // Filtering Logic
  const filteredApps = applications.filter((app) => {
    if (activeFilter === 'UNDER_VERIFICATION') return app.status === 'Under Verification';
    if (activeFilter === 'SANCTIONED') return app.status === 'Sanctioned';
    if (activeFilter === 'ACTION_REQUIRED') return app.actionNeeded;
    return true;
  });

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. Header Banner */}
      <div className="bg-slate-900 border-l-4 border-emerald-600 p-5 text-white rounded-xs shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-xs uppercase font-bold">
              Lifecycle Governance
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              Academic Session: 2026-27
            </span>
          </div>
          <h2 className="text-lg font-bold text-slate-100">My Scholarship Applications & Disbursements</h2>
          <p className="text-xs text-slate-300">
            Real-time tracking of institutional verification, scrutiny officer audit logs, and Aadhaar APB fund disbursements.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 rounded-xs text-xs transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Dashboard
          </button>
        </div>
      </div>

      {/* 2. Top Analytics / Filter Toolbar */}
      <div className="bg-white border border-slate-300 rounded-xs p-3 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
        
        {/* Filter Buttons */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Applications (2)' },
            { id: 'UNDER_VERIFICATION', label: 'Under Review (1)' },
            { id: 'SANCTIONED', label: 'Sanctioned (1)' },
            { id: 'ACTION_REQUIRED', label: 'Action Required (1)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-bold rounded-xs transition cursor-pointer border ${
                activeFilter === tab.id
                  ? 'bg-emerald-800 text-white border-emerald-900'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-slate-500 shrink-0">
          Auto-Sync: National Grants Gateway
        </span>
      </div>

      {/* 3. Applications List */}
      <div className="space-y-4">
        {filteredApps.map((app) => {
          const isExpanded = expandedAppId === app.id;

          return (
            <div 
              key={app.id}
              className="bg-white border border-slate-300 rounded-xs shadow-2xs overflow-hidden transition"
            >
              {/* Card Summary Header */}
              <div className="p-5 border-b border-slate-200">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left: Info */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded-xs">
                        APP ID: {app.appId}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        Applied On: {app.appliedDate}
                      </span>
                      <span className={`text-[10px] font-bold border px-2 py-0.5 rounded-xs uppercase tracking-wider ${app.statusColor}`}>
                        {app.status}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {app.schemeName}
                    </h3>

                    <p className="text-xs text-slate-600">
                      {app.course} • <span className="font-semibold text-slate-800">{app.institution}</span>
                    </p>
                  </div>

                  {/* Right: Grant Amount & Quick Toggle */}
                  <div className="flex items-center gap-4 shrink-0 lg:text-right">
                    <div>
                      <p className="text-[10px] uppercase font-mono text-slate-500">Grant Value</p>
                      <p className="text-sm font-bold font-mono text-emerald-800">{app.sanctionAmount}</p>
                    </div>

                    <button
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-xs text-xs transition cursor-pointer"
                    >
                      {isExpanded ? (
                        <>Hide Details <ChevronUp className="w-3.5 h-3.5" /></>
                      ) : (
                        <>Audit View <ChevronDown className="w-3.5 h-3.5" /></>
                      )}
                    </button>
                  </div>

                </div>

                {/* Clarification Alert if Action Required */}
                {app.actionNeeded && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-300 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-amber-950">Action Required: </span>
                        <span className="text-amber-900">{app.actionNote}</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigate('/student/profile/setup')}
                      className="px-3 py-1 bg-amber-800 hover:bg-amber-900 text-white font-bold text-[11px] rounded-xs uppercase tracking-wider transition shrink-0 cursor-pointer"
                    >
                      Upload Marksheet →
                    </button>
                  </div>
                )}

                {/* Horizontal SOP Progress Tracker */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <p className="text-[10px] uppercase font-mono font-bold text-slate-500 mb-3 tracking-wider">
                    SOP Verification Progress
                  </p>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 relative">
                    {app.stages.map((stage, idx) => {
                      const isCompleted = stage.state === 'completed';
                      const isActive = stage.state === 'active';

                      return (
                        <div key={idx} className="flex flex-col items-center text-center p-2 rounded-xs bg-slate-50 border border-slate-200">
                          <div className={`w-6 h-6 rounded-xs flex items-center justify-center font-mono text-[10px] font-bold border mb-1.5 ${
                            isCompleted
                              ? 'bg-emerald-800 border-emerald-900 text-white'
                              : isActive
                              ? 'bg-sky-100 border-sky-600 text-sky-900 ring-2 ring-sky-200'
                              : 'bg-white border-slate-300 text-slate-400'
                          }`}>
                            {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : idx + 1}
                          </div>
                          <span className={`text-[11px] font-bold leading-tight ${
                            isCompleted || isActive ? 'text-slate-900' : 'text-slate-400'
                          }`}>
                            {stage.name}
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 mt-0.5">
                            {stage.date}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Expandable Scrutiny & Vault Details */}
              {isExpanded && (
                <div className="p-5 bg-slate-50/50 border-t border-slate-200 space-y-5 animate-in fade-in-50 duration-150">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Associated Vault Documents */}
                    <div className="bg-white border border-slate-300 p-4 rounded-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-emerald-800" /> Attached Vault Credentials
                        </h4>
                        <span className="text-[10px] font-mono text-slate-500">4 Items</span>
                      </div>

                      <div className="divide-y divide-slate-100 text-xs">
                        {app.documents.map((doc, dIdx) => (
                          <div key={dIdx} className="py-2 flex items-center justify-between gap-2">
                            <div>
                              <p className="font-bold text-slate-800 text-[11px]">{doc.name}</p>
                              <p className="font-mono text-[9px] text-slate-500">Ref: {doc.ref}</p>
                            </div>
                            <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs uppercase ${
                              doc.status === 'Verified'
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                : 'bg-amber-100 text-amber-900 border border-amber-300'
                            }`}>
                              {doc.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Aadhaar Payment Bridge (APB) Telemetry */}
                    <div className="bg-white border border-slate-300 p-4 rounded-xs space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-emerald-800" /> APB Disbursement Channel
                        </h4>
                        <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-2 py-0.5 rounded-xs">
                          SEEDED
                        </span>
                      </div>

                      <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded-xs">
                          <span className="text-slate-500">Bank Destination:</span>
                          <span className="font-bold text-slate-900">{app.paymentStatus.bankName}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded-xs">
                          <span className="text-slate-500">Aadhaar Linked Account:</span>
                          <span className="font-bold text-slate-900">{app.paymentStatus.accountMasked}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-slate-50 border border-slate-200 rounded-xs">
                          <span className="text-slate-500">Disbursement Milestone:</span>
                          <span className="font-bold text-emerald-800">{app.paymentStatus.disbursementBatch}</span>
                        </div>
                      </div>

                      <p className="text-[10px] text-slate-500">
                        Disbursements execute via Ministry of Tribal Affairs Aadhaar Payment Bridge Gateway under Treasury Direct Transfer.
                      </p>
                    </div>

                  </div>

                  {/* Action Footer for this Application */}
                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 text-xs">
                    <span className="text-[11px] font-mono text-slate-500">
                      Digital Cryptographic Hash: Verified Authentic
                    </span>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => alert(`Downloading Acknowledgement slip for ${app.appId}...`)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold border border-slate-300 rounded-xs transition cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" /> Acknowledgement Slip
                      </button>
                      {app.status === 'Sanctioned' && (
                        <button 
                          onClick={() => alert(`Opening Sanction Order for ${app.appId}...`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold rounded-xs transition cursor-pointer uppercase tracking-wider"
                        >
                          <FileText className="w-3.5 h-3.5" /> Sanction Order (PDF)
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MyApplications;