import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardCheck,
  AlertTriangle,
  FileCheck2,
  Clock,
  Building2,
  Eye,
  ShieldAlert,
  ChevronRight
} from 'lucide-react';

const OfficerDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    {
      label: 'Pending Scrutiny Queue',
      value: '124',
      subtext: '32 Urgent (Near SLA limit)',
      icon: ClipboardCheck,
      color: 'text-amber-700',
      borderColor: 'border-l-4 border-l-amber-600',
    },
    {
      label: 'Deficiency Reports Sent',
      value: '18',
      subtext: 'Awaiting student clarification',
      icon: AlertTriangle,
      color: 'text-rose-700',
      borderColor: 'border-l-4 border-l-rose-600',
    },
    {
      label: 'Approved Applications',
      value: '1,420',
      subtext: 'Disbursement pipeline ready',
      icon: FileCheck2,
      color: 'text-emerald-700',
      borderColor: 'border-l-4 border-l-emerald-600',
    },
    {
      label: 'Avg. Verification Time',
      value: '1.8 Days',
      subtext: 'SLA target: < 3.0 Days',
      icon: Clock,
      color: 'text-teal-700',
      borderColor: 'border-l-4 border-l-teal-600',
    },
  ];

  const urgentQueue = [
    {
      id: 'APP-2026-8910',
      studentName: 'Birsa Munda',
      scheme: 'National Overseas Scholarship',
      institute: 'Ranchi University',
      slaHoursLeft: 12,
      riskLevel: 'Normal',
    },
    {
      id: 'APP-2026-8914',
      studentName: 'Sunita Hembrom',
      scheme: 'Post-Matric Scholarship ST',
      institute: 'St. Xavier\'s College Ranchi',
      slaHoursLeft: 4,
      riskLevel: 'Flagged (Income Conflict)',
    },
    {
      id: 'APP-2026-8922',
      studentName: 'Ramesh Oraon',
      scheme: 'National Fellowship for ST',
      institute: 'NIT Jamshedpur',
      slaHoursLeft: 28,
      riskLevel: 'Normal',
    },
  ];

  const pendingInstitutes = [
    { name: 'Gossner College, Ranchi', code: 'INST-JH-042', pendingCount: 42 },
    { name: 'St. Xavier\'s College, Ranchi', code: 'INST-JH-011', pendingCount: 28 },
    { name: 'Ranchi Women\'s College', code: 'INST-JH-088', pendingCount: 19 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Official Solid Header Banner */}
      <div className="bg-emerald-800 border-b-2 border-emerald-950 p-6 text-white rounded-xs shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-900 border border-emerald-600 text-emerald-100">
              Official Verification Desk
            </span>
            <span className="text-xs text-emerald-200 font-semibold">• Ranchi Zone-1</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Application Scrutiny & Verification Portal</h1>
          <p className="text-xs text-emerald-100 mt-1 max-w-2xl">
            National Tribal Affairs Department • Verification and Digilocker Document Authentication System
          </p>
        </div>

        <button 
          onClick={() => navigate('/officer/scrutiny')}
          className="bg-white text-emerald-900 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 border border-slate-300 rounded-xs shadow-xs transition shrink-0"
        >
          Start Scrutiny Queue
        </button>
      </div>

      {/* Solid KPI Cards with Left Accent Borders */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className={`bg-white p-4 border border-slate-200 ${item.borderColor} shadow-2xs space-y-2`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-600">{item.label}</span>
                <Icon className={`w-4 h-4 ${item.color}`} />
              </div>
              <div>
                <span className="text-2xl font-black text-slate-900">{item.value}</span>
                <p className="text-[11px] text-slate-500 font-medium">{item.subtext}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Verification Queue Table */}
        <div className="lg:col-span-2 bg-white p-5 border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Priority Scrutiny Queue</h2>
              <p className="text-[11px] text-slate-500">Cases nearing SLA expiration threshold</p>
            </div>
            <button 
              onClick={() => navigate('/officer/scrutiny')}
              className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
            >
              View Full Queue (124) <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-[11px] font-bold text-slate-600 bg-slate-50 uppercase">
                  <th className="p-2">Application / Student</th>
                  <th className="p-2">Scheme</th>
                  <th className="p-2">SLA Status</th>
                  <th className="p-2">Risk Status</th>
                  <th className="p-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs">
                {urgentQueue.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-2">
                      <span className="font-bold text-slate-900 block">{item.studentName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.id}</span>
                    </td>
                    <td className="p-2">
                      <span className="font-medium text-slate-800 block">{item.scheme}</span>
                      <span className="text-[10px] text-slate-500 block">{item.institute}</span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold border ${
                        item.slaHoursLeft <= 4 
                          ? 'bg-rose-50 text-rose-800 border-rose-300' 
                          : 'bg-amber-50 text-amber-900 border-amber-300'
                      }`}>
                        {item.slaHoursLeft}h remaining
                      </span>
                    </td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold ${
                        item.riskLevel.includes('Flagged')
                          ? 'bg-rose-100 text-rose-900 border border-rose-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-300'
                      }`}>
                        {item.riskLevel}
                      </span>
                    </td>
                    <td className="p-2 text-right">
                      <button 
                        onClick={() => navigate(`/officer/scrutiny/${item.id}`)}
                        className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xs text-[11px] inline-flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          
          {/* Institute Directives */}
          <div className="bg-white p-5 border border-slate-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase">Institute Applications</h3>
              <Building2 className="w-4 h-4 text-slate-600" />
            </div>

            <div className="space-y-2">
              {pendingInstitutes.map((inst, idx) => (
                <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{inst.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono">{inst.code}</span>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 border border-emerald-300 text-[10px] font-bold">
                    {inst.pendingCount} Pending
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Official Administrative Directive Box */}
          <div className="bg-slate-900 p-5 text-white border-l-4 border-l-emerald-500 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">Mandatory Directive</span>
              <ShieldAlert className="w-4 h-4 text-emerald-400" />
            </div>
            
            <p className="text-xs text-slate-300 leading-relaxed">
              Verify income certificate validity dates against FY 2026-27 limits. Re-submitted deficiency reports must be acted upon within 24 hours per MoTA guidelines.
            </p>

            <button 
              onClick={() => navigate('/officer/support')}
              className="w-full py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xs text-xs font-bold transition text-center block"
            >
              Open Officer SOP
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OfficerDashboard;