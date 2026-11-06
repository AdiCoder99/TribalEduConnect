import { useEffect, useState } from 'react';
import { BarChart3, CheckCircle2, Clock3, Download, FileWarning, LoaderCircle, RefreshCw, XCircle } from 'lucide-react';
import API from '../services/api';

const metrics = [
  ['submitted', 'Submitted', FileWarning, 'text-sky-700', 'bg-sky-50'],
  ['pending', 'Pending action', Clock3, 'text-amber-700', 'bg-amber-50'],
  ['approved', 'Approved', CheckCircle2, 'text-emerald-700', 'bg-emerald-50'],
  ['rejected', 'Rejected', XCircle, 'text-rose-700', 'bg-rose-50'],
];

const OfficerReports = () => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadReport = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await API.get('/applications/analytics/dashboard');
      setReport(response.data?.data || null);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to load workflow analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    API.get('/applications/analytics/dashboard')
      .then((response) => {
        if (active) setReport(response.data?.data || null);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.error || 'Unable to load workflow analytics.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, []);

  const exportReport = () => {
    if (!report) return;
    const rows = [
      ['Metric', 'Count'],
      ['Total applications', report.totalApplications],
      ['Submitted', report.submitted],
      ['Pending action', report.pending],
      ['Approved', report.approved],
      ['Rejected', report.rejected],
      ['Deficient', report.deficient],
    ];
    const csv = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `application-workflow-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 bg-slate-900 p-5 text-white sm:flex-row sm:items-center sm:justify-between">
        <div><span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Operational reporting</span><h1 className="mt-1 text-xl font-bold">Approval Pipeline Reports</h1><p className="mt-1 text-xs text-slate-300">Live application outcomes from the shared review workflow.</p></div>
        <div className="flex gap-2"><button onClick={loadReport} className="inline-flex items-center gap-1 border border-slate-600 px-3 py-2 text-xs font-bold hover:bg-slate-800"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button><button onClick={exportReport} disabled={!report} className="inline-flex items-center gap-1 bg-emerald-700 px-3 py-2 text-xs font-bold disabled:opacity-50"><Download className="h-3.5 w-3.5" /> Export CSV</button></div>
      </div>
      {error && <div className="border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900">{error}</div>}
      {loading ? <div className="flex justify-center p-12 text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /></div> : report && <><div className="grid grid-cols-2 gap-3 lg:grid-cols-4">{metrics.map(([key, label, Icon, text, bg]) => <div key={key} className={`border border-slate-200 p-4 ${bg}`}><Icon className={`h-5 w-5 ${text}`} /><p className="mt-3 text-[11px] font-bold uppercase text-slate-500">{label}</p><p className="text-2xl font-black text-slate-900">{report[key] || 0}</p></div>)}</div><div className="grid gap-5 lg:grid-cols-2"><div className="border border-slate-200 bg-white p-5"><h2 className="flex items-center gap-2 text-sm font-bold"><BarChart3 className="h-4 w-4 text-emerald-700" /> Pipeline summary</h2><div className="mt-4 space-y-3">{[['Auto verified', report.autoVerified], ['Manual review', report.manualReview], ['Deficient', report.deficient], ['Pending action', report.pending]].map(([label, value]) => <div key={label}><div className="flex justify-between text-xs"><span>{label}</span><strong>{value || 0}</strong></div><div className="mt-1 h-2 bg-slate-100"><div className="h-2 bg-emerald-700" style={{ width: `${report.totalApplications ? Math.min(100, ((value || 0) / report.totalApplications) * 100) : 0}%` }} /></div></div>)}</div></div><div className="border border-slate-200 bg-white p-5"><h2 className="text-sm font-bold">Applications by state</h2><div className="mt-4 space-y-2 text-xs">{(report.stateDistribution || []).map((item) => <div key={item._id || 'unknown'} className="flex justify-between border-b border-slate-100 py-2"><span>{item._id || 'Unspecified'}</span><strong>{item.total}</strong></div>)}</div></div></div></>}
    </div>
  );
};

export default OfficerReports;
