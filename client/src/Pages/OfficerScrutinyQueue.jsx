import { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ClipboardCheck, Eye, LoaderCircle, Search, XCircle } from 'lucide-react';
import API from '../services/api';

const statusStyles = {
  APPROVED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  REJECTED: 'bg-rose-100 text-rose-900 border-rose-300',
  DEFICIENT: 'bg-amber-100 text-amber-900 border-amber-300',
  MANUAL_REVIEW: 'bg-sky-100 text-sky-900 border-sky-300',
};

const OfficerScrutinyQueue = () => {
  const [applications, setApplications] = useState([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    const params = statusFilter === 'ALL' ? {} : { status: statusFilter };
    API.get('/applications/scrutiny-queue', { params })
      .then((response) => {
        if (active) setApplications(response.data?.data || []);
      })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.error || 'Unable to load the scrutiny queue.');
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [statusFilter]);

  const loadQueue = async () => {
    const params = statusFilter === 'ALL' ? {} : { status: statusFilter };
    const response = await API.get('/applications/scrutiny-queue', { params });
    setApplications(response.data?.data || []);
  };

  const filteredApplications = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return applications;
    return applications.filter((application) =>
      [application.user?.name, application.user?.email, application.scheme?.name, application._id]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [applications, search]);

  const review = async (status) => {
    if (!selected) return;
    setSaving(true);
    setError('');
    try {
      await API.patch(`/applications/${selected._id}/review`, {
        status,
        deficiencyNotes: note.trim() ? [{ field: 'OFFICER_REVIEW', reason: note.trim() }] : [],
      });
      setSelected(null);
      setNote('');
      await loadQueue();
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to update this application.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <div className="bg-emerald-800 p-5 text-white shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Live workflow</span>
            <h1 className="mt-1 text-xl font-bold">Application Scrutiny Queue</h1>
            <p className="mt-1 text-xs text-emerald-100">Review submitted applications and record a clear decision for each student.</p>
          </div>
          <ClipboardCheck className="h-10 w-10 text-emerald-200" />
        </div>
      </div>

      <div className="flex flex-col gap-3 border border-slate-200 bg-white p-3 shadow-2xs sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search student, scheme, email, or application ID"
            className="w-full border border-slate-300 py-2 pl-9 pr-3 text-xs outline-none focus:border-emerald-700"
          />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="border border-slate-300 px-3 py-2 text-xs">
          <option value="ALL">All statuses</option>
          <option value="MANUAL_REVIEW">Manual review</option>
          <option value="DEFICIENT">Deficient</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
        </select>
      </div>

      {error && <div className="border border-rose-300 bg-rose-50 p-3 text-xs text-rose-900">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center gap-2 p-12 text-sm text-slate-500"><LoaderCircle className="h-5 w-5 animate-spin" /> Loading queue…</div>
      ) : filteredApplications.length === 0 ? (
        <div className="border border-slate-200 bg-white p-12 text-center text-sm text-slate-500">No applications match this queue filter.</div>
      ) : (
        <div className="overflow-x-auto border border-slate-200 bg-white shadow-2xs">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500">
              <tr><th className="p-3">Student</th><th className="p-3">Scheme</th><th className="p-3">Submitted</th><th className="p-3">Status</th><th className="p-3 text-right">Action</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredApplications.map((application) => (
                <tr key={application._id} className="hover:bg-slate-50">
                  <td className="p-3"><strong className="block text-slate-900">{application.user?.name || 'Unknown student'}</strong><span className="text-[10px] text-slate-500">{application.user?.email}</span></td>
                  <td className="p-3 text-slate-700">{application.scheme?.name || 'Unassigned scheme'}</td>
                  <td className="p-3 text-slate-500">{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : '—'}</td>
                  <td className="p-3"><span className={`border px-2 py-1 text-[10px] font-bold uppercase ${statusStyles[application.status] || 'bg-slate-100 text-slate-700 border-slate-300'}`}>{application.status}</span></td>
                  <td className="p-3 text-right"><button onClick={() => setSelected(application)} className="inline-flex items-center gap-1 bg-emerald-700 px-3 py-1.5 font-bold text-white hover:bg-emerald-800"><Eye className="h-3.5 w-3.5" /> Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 p-4 text-white">
              <div><h2 className="font-bold">Review application</h2><p className="text-[10px] text-slate-300">{selected._id}</p></div>
              <button onClick={() => setSelected(null)} aria-label="Close review"><XCircle className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4 p-5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-slate-200 p-3"><span className="text-slate-500">Student</span><strong className="mt-1 block">{selected.user?.name || 'Unknown'}</strong></div>
                <div className="border border-slate-200 p-3"><span className="text-slate-500">Scheme</span><strong className="mt-1 block">{selected.scheme?.name || 'Unknown'}</strong></div>
                <div className="border border-slate-200 p-3"><span className="text-slate-500">Annual income</span><strong className="mt-1 block">₹{Number(selected.applicant?.annualIncome || 0).toLocaleString()}</strong></div>
                <div className="border border-slate-200 p-3"><span className="text-slate-500">AI confidence</span><strong className="mt-1 block">{selected.aiScrutiny?.confidenceScore || 0}%</strong></div>
              </div>
              {selected.documents && <div className="border border-slate-200 p-3"><p className="font-bold text-slate-800">Documents</p><div className="mt-2 space-y-1 text-slate-600"><div>Caste certificate: {selected.documents.casteCertificateUrl ? 'Uploaded' : 'Missing'}</div><div>Income certificate: {selected.documents.incomeCertificateUrl ? 'Uploaded' : 'Missing'}</div></div></div>}
              <label className="block font-bold text-slate-700">Review note <textarea value={note} onChange={(event) => setNote(event.target.value)} rows="3" placeholder="Explain a deficiency or record your decision…" className="mt-1 w-full border border-slate-300 p-2 font-normal outline-none focus:border-emerald-700" /></label>
              <div className="flex flex-wrap justify-end gap-2 border-t border-slate-200 pt-3">
                <button disabled={saving} onClick={() => review('DEFICIENT')} className="inline-flex items-center gap-1 border border-amber-300 bg-amber-50 px-3 py-2 font-bold text-amber-900 disabled:opacity-50"><AlertCircle className="h-4 w-4" /> Request correction</button>
                <button disabled={saving} onClick={() => review('REJECTED')} className="inline-flex items-center gap-1 border border-rose-300 bg-rose-50 px-3 py-2 font-bold text-rose-900 disabled:opacity-50"><XCircle className="h-4 w-4" /> Reject</button>
                <button disabled={saving} onClick={() => review('APPROVED')} className="inline-flex items-center gap-1 bg-emerald-700 px-3 py-2 font-bold text-white disabled:opacity-50"><CheckCircle2 className="h-4 w-4" /> Approve</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfficerScrutinyQueue;
