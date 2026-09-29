import React, { useState } from 'react';
import {
  Users,
  GraduationCap,
  FileCheck2,
  AlertCircle,
  TrendingUp,
  ShieldAlert,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  MoreVertical,
  ArrowUpRight,
  Database,
  Building2,
  Layers
} from 'lucide-react';

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('Overview');

  // Key Platform Metrics
  const systemMetrics = [
    { label: 'Total Registered Students', value: '1,42,850', change: '+12.4%', isPositive: true, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Active Scholarship Schemes', value: '18', change: '2 Pending Review', isPositive: true, icon: GraduationCap, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Applications Disbursed', value: '₹48.2 Cr', change: '+18.6%', isPositive: true, icon: TrendingUp, color: 'text-sky-600', bg: 'bg-sky-50' },
    { label: 'Pending Nodal Approvals', value: '1,240', change: '-4.1%', isPositive: true, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  // Scheme Operational Status
  const activeSchemes = [
    { name: 'National Fellowship for ST (NFST)', portal: 'Higher Education', allocated: '₹12.5 Cr', applications: '4,210', status: 'Active', statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'National Overseas Scholarship (NOS)', portal: 'International Studies', allocated: '₹8.0 Cr', applications: '890', status: 'Active', statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Post-Matric Scholarship Scheme', portal: 'State/UT Level', allocated: '₹22.0 Cr', applications: '98,400', status: 'Active', statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { name: 'Eklavya Model Residential Support', portal: 'School Education', allocated: '₹5.7 Cr', applications: '39,350', status: 'Under Audit', statusBg: 'bg-amber-50 text-amber-700 border-amber-200' },
  ];

  // Regional Verification Performance
  const regionalPerformance = [
    { state: 'Jharkhand', nodalOfficers: 24, pendingApps: 340, SLA: '94.2%', health: 'Good' },
    { state: 'Odisha', nodalOfficers: 30, pendingApps: 210, SLA: '98.1%', health: 'Good' },
    { state: 'Chhattisgarh', nodalOfficers: 28, pendingApps: 512, SLA: '88.5%', health: 'Warning' },
    { state: 'Madhya Pradesh', nodalOfficers: 45, pendingApps: 178, SLA: '96.4%', health: 'Good' },
  ];

  // System Audit Logs
  const auditLogs = [
    { action: 'Scheme Updated', detail: 'Budget allocation adjusted for NOS 2026-27', actor: 'Admin (System)', time: '10 mins ago', type: 'info' },
    { action: 'Role Escalation', detail: 'Nodal Officer access granted to ID: #NOD-9082', actor: 'SuperAdmin', time: '1 hour ago', type: 'warning' },
    { action: 'DB Backup Completed', detail: 'Automated full system snapshot taken', actor: 'System Core', time: '4 hours ago', type: 'success' },
    { action: 'Flagged Application', detail: 'Duplicate Aadhaar detected across 2 submissions', actor: 'Fraud Prevention AI', time: '6 hours ago', type: 'danger' },
  ];

  return (
    <>
      {/* SuperAdmin Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-md border border-slate-800">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 tracking-wider">
              System Operations Center
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold">Live System Normal</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">SuperAdmin Command Center</h2>
          <p className="text-xs text-slate-300 max-w-xl">
            Monitor real-time scheme performance, manage state nodal officers, oversee fund distributions, and audit platform security.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-indigo-600/20">
            <Download className="w-3.5 h-3.5" /> Export Audit Log
          </button>
          <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl border border-white/10 transition">
            <Layers className="w-3.5 h-3.5" /> New Scheme Setup
          </button>
        </div>
      </div>

      {/* Primary System Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">{item.label}</span>
                <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${item.color}`} />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-slate-900">{item.value}</span>
                <span className={`text-[11px] font-bold ${item.isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {item.change}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Administrative Control Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width): Scheme Status & Nodal Performance */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Schemes Overview Table */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">National Scheme Operations</h3>
                <p className="text-[11px] text-slate-400">Live statistics on active scholarship programs</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-slate-600 rounded-xl bg-slate-50 border border-slate-100">
                  <Filter className="w-3.5 h-3.5" />
                </button>
                <button className="text-xs font-bold text-indigo-600 hover:underline">
                  Manage All Schemes →
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3 pl-1">Scheme Name</th>
                    <th className="pb-3">Budget Allocated</th>
                    <th className="pb-3">Applications</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 text-right pr-1">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {activeSchemes.map((scheme, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition">
                      <td className="py-3.5 pl-1 font-bold text-slate-900">
                        {scheme.name}
                        <span className="block text-[10px] text-slate-400 font-normal">{scheme.portal}</span>
                      </td>
                      <td className="py-3.5 font-semibold text-slate-700">{scheme.allocated}</td>
                      <td className="py-3.5 text-slate-600 font-medium">{scheme.applications}</td>
                      <td className="py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${scheme.statusBg}`}>
                          {scheme.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-1">
                        <button className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Regional Nodal Verification Health */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">State Nodal Verification Health</h3>
                <p className="text-[11px] text-slate-400">Application processing metrics per state nodal center</p>
              </div>
              <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-xl">
                4 Active Regions
              </span>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {regionalPerformance.map((region, idx) => (
                <div key={idx} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <h4 className="text-xs font-bold text-slate-900">{region.state}</h4>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      region.health === 'Good' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      SLA: {region.SLA}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                    <div>
                      <span className="text-slate-400 block">Nodal Officers</span>
                      <span className="font-bold text-slate-800">{region.nodalOfficers}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Pending Scrutiny</span>
                      <span className="font-bold text-slate-800">{region.pendingApps}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width): System Audit & Security */}
        <div className="space-y-6">
          
          {/* Real-time System Audit Feed */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">System Audit Trail</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-4">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs pb-3 border-b border-slate-100 last:border-none last:pb-0">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    log.type === 'danger' ? 'bg-rose-500' : log.type === 'warning' ? 'bg-amber-500' : log.type === 'success' ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`} />
                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900">{log.action}</p>
                      <span className="text-[9px] text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-500 leading-snug">{log.detail}</p>
                    <span className="text-[9px] font-semibold text-slate-400 block">By: {log.actor}</span>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full text-center text-xs font-bold text-indigo-600 hover:underline pt-2 block">
              View Complete Audit Logs →
            </button>
          </div>

          {/* Platform Infrastructure Health */}
          <div className="bg-slate-900 p-6 rounded-3xl text-white space-y-4 border border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Infrastructure Status</h3>
              <Database className="w-4 h-4 text-indigo-400" />
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">AWS S3 Storage (Documents)</span>
                  <span className="font-bold text-slate-200">64% Used</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-[64%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] mb-1">
                  <span className="text-slate-400">Database Load</span>
                  <span className="font-bold text-slate-200">28% Capacity</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full w-[28%]" />
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </>
  );
};

export default SuperAdminDashboard;