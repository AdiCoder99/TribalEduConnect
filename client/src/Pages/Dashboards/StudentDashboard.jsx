import React from 'react';
import { useApp } from '../../Context/AppContext';
import { useNavigate, useLocation} from 'react-router-dom'
import {
  FileText,
  Clock,
  CheckCircle2,
  Bell,
  GraduationCap,
  Plane,
  BookOpen,
  ArrowRight,
  Check,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useApp();

  const stats = [
    { label: 'Total Applications', count: '2', sub: 'View details →', bg: 'bg-emerald-50/50', border: 'border-emerald-300', text: 'text-emerald-900', icon: FileText },
    { label: 'Under Verification', count: '1', sub: 'Track status →', bg: 'bg-sky-50/50', border: 'border-sky-300', text: 'text-sky-900', icon: Clock },
    { label: 'Scholarship Sanctioned', count: '1', sub: 'View ledger →', bg: 'bg-amber-50/50', border: 'border-amber-300', text: 'text-amber-900', icon: CheckCircle2 },
    { label: 'Portal Alerts', count: '3', sub: 'View history →', bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-900', icon: Bell },
  ];

  const applicationTracker = [
    {
      id: 1,
      title: 'National Fellowship for Scheduled Tribe (NFST)',
      subtitle: 'Ph.D. Research Fellowship (India) • App ID: NFST-2025-8841',
      status: 'Under Verification',
      statusColor: 'bg-sky-100 text-sky-900 border-sky-300',
      icon: GraduationCap,
      steps: [
        { name: 'Submitted', date: '15 Aug 2025', state: 'completed' },
        { name: 'Doc Verified', date: '28 Aug 2025', state: 'completed' },
        { name: 'Desk Scrutiny', date: 'In Progress', state: 'active' },
        { name: 'Selection Board', date: '', state: 'pending' },
        { name: 'Sanction Order', date: '', state: 'pending' },
      ]
    },
    {
      id: 2,
      title: 'National Overseas Scholarship (NOS)',
      subtitle: "Master's Programme (Abroad) • App ID: NOS-2024-1102",
      status: 'Sanctioned',
      statusColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: Plane,
      steps: [
        { name: 'Submitted', date: '10 Jan 2024', state: 'completed' },
        { name: 'Verified', date: '25 Jan 2024', state: 'completed' },
        { name: 'Selected', date: '15 Mar 2024', state: 'completed' },
        { name: 'Sanctioned', date: '01 Apr 2024', state: 'completed' },
        { name: 'Disbursed', date: '15 Apr 2024', state: 'completed' },
      ]
    }
  ];

  const exploreSchemes = [
    {
      title: 'National Fellowship for Scheduled Tribe (NFST)',
      description: 'Financial support for M.Phil. / Ph.D. higher research studies in Indian institutions.',
      lastDate: '30 Sep 2026',
      icon: GraduationCap,
    },
    {
      title: 'National Overseas Scholarship (NOS)',
      description: 'Scholarship assistance for Master\'s, Ph.D. & Post-Doctoral qualifications abroad.',
      lastDate: '15 Oct 2026',
      icon: Plane,
    },
    {
      title: 'Post-Matric Scholarship for ST Students',
      description: 'Financial assistance for post-matriculation or post-secondary courses.',
      lastDate: '31 Dec 2026',
      icon: BookOpen,
    }
  ];

  const profileSteps = [
    { label: 'Personal Information', status: 'Verified', isDone: true },
    { label: 'Contact & Communication Details', status: 'Verified', isDone: true },
    { label: 'Academic & Institute Details', status: 'Verified', isDone: true },
    { label: 'Caste Certificate Verification', status: 'Verified', isDone: true },
    { label: 'Income Certificate Upload', status: 'Pending Upload', isDone: false },
    { label: 'Aadhaar Direct Benefit Transfer (DBT) Link', status: 'Active', isDone: true },
  ];

  const recentNotifications = [
    { title: 'Document Scrutiny Update', desc: 'NFST application #NFST-2025-8841 is under officer review.', time: '2 hours ago', tag: 'Action Required' },
    { title: 'NOS AY 2026-27 Notification', desc: 'Portal is accepting fresh applications for NOS overseas programs.', time: '1 day ago', tag: 'Notice' },
    { title: 'Income Verification Success', desc: 'Competent Authority verified income document upload.', time: '3 days ago', tag: 'System' }
  ];

    const navigate = useNavigate();

  const manageProfile = () => {
    // Navigate to profile management page or open modal
    console.log('Navigating to profile management...');
    navigate('/student/profile/setup');
  }

  return (
    <div className="space-y-6 font-sans">
      {/* Official Government Portal Banner */}
      <div className="bg-slate-900 border-l-4 border-emerald-600 p-5 sm:p-6 text-white rounded-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-2xs">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono tracking-widest bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-xs uppercase font-bold">
              Beneficiary Portal
            </span>
            <span className="text-[10px] text-slate-400 font-mono">Academic Year 2026-27</span>
          </div>
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-100">
            Welcome, {user?.name || 'Aditya Srivastava'}
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Ministry of Tribal Affairs Centralized Direct Benefit Transfer (DBT) Dashboard. Monitor application progression, scrutiny logs, and scheme deadlines.
          </p>
        </div>

        <div className="bg-slate-800/80 p-3 rounded-xs border border-slate-700 max-w-xs shrink-0">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
            <ShieldCheck className="w-4 h-4" /> Direct Benefit Transfer (DBT)
          </div>
          <p className="text-[11px] text-slate-300 leading-snug">
            Aadhaar Payment Bridge (APB) status: <span className="text-emerald-400 font-semibold">Active & Linked</span>
          </p>
        </div>
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`${item.bg} p-3.5 border ${item.border} rounded-xs flex flex-col justify-between space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.text}`} />
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <span className={`text-2xl font-bold font-mono ${item.text}`}>{item.count}</span>
                <button className="text-[10px] font-bold text-slate-600 hover:text-slate-900 hover:underline">
                  {item.sub}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Applications & Schemes */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Applications Tracking Board */}
          <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Application Workflows</h3>
              <button className="text-xs font-bold text-emerald-800 hover:underline">
                View Portal History →
              </button>
            </div>

            <div className="space-y-4">
              {applicationTracker.map((app) => (
                <div key={app.id} className="p-4 border border-slate-200 bg-slate-50/50 space-y-4 rounded-xs">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1.5 bg-slate-200/80 border border-slate-300 text-slate-800 rounded-xs shrink-0 mt-0.5">
                        <app.icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{app.title}</h4>
                        <p className="text-[10px] font-mono text-slate-500 mt-0.5">{app.subtitle}</p>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 text-[10px] font-bold border rounded-xs uppercase tracking-wider ${app.statusColor}`}>
                      {app.status}
                    </span>
                  </div>

                  {/* Horizontal Progress Timeline */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between relative">
                      {app.steps.map((step, sIdx) => {
                        const isCompleted = step.state === 'completed';
                        const isActive = step.state === 'active';

                        return (
                          <div key={sIdx} className="flex-1 flex flex-col items-center relative z-10">
                            <div className={`w-5 h-5 rounded-xs flex items-center justify-center border transition font-mono text-[10px] ${
                              isCompleted
                                ? 'bg-emerald-800 border-emerald-900 text-white'
                                : isActive
                                ? 'bg-sky-100 border-sky-600 text-sky-900 font-bold ring-2 ring-sky-200'
                                : 'bg-white border-slate-300 text-slate-300'
                            }`}>
                              {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : sIdx + 1}
                            </div>

                            <span className={`text-[10px] font-semibold mt-1.5 text-center leading-tight ${
                              isCompleted || isActive ? 'text-slate-900' : 'text-slate-400'
                            }`}>
                              {step.name}
                            </span>
                            {step.date && <span className="text-[9px] font-mono text-slate-400 mt-0.5">{step.date}</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explore Schemes Grid */}
          <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Active Ministry Schemes</h3>
              <button className="text-xs font-bold text-emerald-800 hover:underline">
                Scheme Directory →
              </button>
            </div>

            <div className="grid sm:grid-cols-3 gap-3">
              {exploreSchemes.map((scheme, idx) => {
                const Icon = scheme.icon;
                return (
                  <div key={idx} className="p-3.5 border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between space-y-3 rounded-xs">
                    <div className="space-y-2">
                      <div className="w-7 h-7 bg-white border border-slate-300 flex items-center justify-center rounded-xs text-slate-800">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-snug">{scheme.title}</h4>
                      <p className="text-[10px] text-slate-600 leading-relaxed">{scheme.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-mono">Closing: <span className="font-bold text-slate-800">{scheme.lastDate}</span></span>
                      <button className="p-1 bg-slate-200 hover:bg-emerald-800 hover:text-white text-slate-800 rounded-xs transition">
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: e-KYC Verification & Bulletins */}
        <div className="space-y-6">
          
          {/* Profile & Document Verification Status */}
          <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-2xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-3">Profile & Verification</h3>
            
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-300 p-3 rounded-xs">
              <div className="w-10 h-10 border-2 border-emerald-800 flex items-center justify-center font-bold font-mono text-xs text-emerald-900 bg-white shrink-0">
                83%
              </div>
              <div>
                <h4 className="text-xs font-bold text-emerald-950">Draft Profile Readiness</h4>
                <p className="text-[10px] text-emerald-800 leading-tight mt-0.5">Upload valid income certificate to enable 100% scheme eligibility matching.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100 pt-1">
              {profileSteps.map((step, sIdx) => (
                <div key={sIdx} className="flex items-center justify-between text-xs py-2">
                  <div className="flex items-center gap-2">
                    {step.isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    ) : (
                      <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    )}
                    <span className="text-slate-800 text-[11px] font-medium">{step.label}</span>
                  </div>
                  <span className={`text-[9px] font-mono font-bold uppercase ${step.isDone ? 'text-emerald-800' : 'text-amber-800 bg-amber-50 border border-amber-200 px-1 rounded-xs'}`}>
                    {step.status}
                  </span>
                </div>
              ))}
            </div>

            <button className="w-full bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold py-2 rounded-xs transition shadow-2xs uppercase tracking-wider" onClick={manageProfile()}>
              Manage Profile & Vault →
            </button>
          </div>

          {/* Official Notices / Alerts Widget */}
          <div className="bg-white p-5 border border-slate-300 rounded-xs shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Recent Bulletins</h3>
              <button className="text-xs font-bold text-emerald-800 hover:underline">
                Alert Log →
              </button>
            </div>

            <div className="space-y-2.5">
              {recentNotifications.map((notif, idx) => (
                <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold font-mono uppercase bg-slate-200 text-slate-800 px-1 rounded-xs">
                      {notif.tag}
                    </span>
                    <span className="text-[9px] font-mono text-slate-400">{notif.time}</span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 leading-snug">{notif.title}</h4>
                  <p className="text-[10px] text-slate-600 leading-relaxed">{notif.desc}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;