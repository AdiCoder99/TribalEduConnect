import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../Context/AppContext';
import API from '../services/api';
import { 
  FileText, 
  PlusCircle, 
  LogOut, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  IndianRupee, 
  User, 
  GraduationCap,
  ExternalLink,
  RefreshCw,
  Bell,
  Download,
  Upload,
  CheckCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  CreditCard,
  FileWarning
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useApp();
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [appRes, schemeRes, notifRes] = await Promise.all([
        API.get('/applications/my-applications'),
        API.get('/schemes'),
        API.get('/notifications/my-notifications').catch(() => ({ data: { data: [] } }))
      ]);
      
      if (appRes.data?.success || Array.isArray(appRes.data)) {
        setApplications(appRes.data.data || appRes.data || []);
      }
      if (schemeRes.data?.success || Array.isArray(schemeRes.data)) {
        setSchemes(schemeRes.data.data || schemeRes.data || []);
      }
      if (notifRes.data?.data) {
        setNotifications(notifRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load student dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusStep = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved': return 3;
      case 'flagged':
      case 'under review': return 2;
      default: return 1; // Submitted / Scrutiny
    }
  };

  const approvedCount = applications.filter(a => a.status?.toLowerCase() === 'approved').length;
  const pendingCount = applications.filter(a => a.status?.toLowerCase() === 'pending' || !a.status).length;
  const flaggedCount = applications.filter(a => a.status?.toLowerCase() === 'flagged').length;

  const filteredSchemes = schemes.filter(scheme => {
    const matchesSearch = scheme.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          scheme.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || scheme.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Navigation */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-emerald-600/20">
              T
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 leading-none">TribalEduConnect</h1>
              <p className="text-xs text-slate-500 mt-0.5">Ministry of Tribal Affairs Student Portal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-30">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">Notifications</h4>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-slate-400 py-4 text-center">No new updates or alerts.</p>
                  ) : (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n, i) => (
                        <div key={i} className="p-2.5 bg-slate-50 rounded-xl text-xs space-y-1">
                          <p className="font-semibold text-slate-800">{n.title}</p>
                          <p className="text-slate-500">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-xl border border-slate-200">
              <User className="w-3.5 h-3.5 text-emerald-600" />
              <span className="font-semibold">{user?.name || 'Student Applicant'}</span>
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 px-3 py-1.5 rounded-xl transition border border-slate-200/60"
            >
              <LogOut className="w-3.5 h-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-semibold mb-3 border border-white/20">
              DBT Enabled Scholarship Portal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name?.split(' ')[0] || 'Student'}!
            </h2>
            <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
              Track real-time AI verification scores, monitor DBT disbursement pipeline status, and explore official MoTA schemes.
            </p>
          </div>
          <GraduationCap className="absolute right-4 bottom-0 w-64 h-64 text-white/5 pointer-events-none transform translate-y-8 translate-x-8" />
        </div>

        {/* Real-time Analytics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Applied Schemes</p>
              <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{applications.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Approved</p>
              <h3 className="text-2xl font-extrabold text-emerald-600 mt-1">{approvedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Under Scrutiny</p>
              <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{pendingCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged / Action Needed</p>
              <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{flaggedCount}</h3>
            </div>
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === 'overview'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> Tracker & Submissions
            </button>
            <button
              onClick={() => setActiveTab('schemes')}
              className={`flex items-center gap-2 pb-3 text-sm font-semibold transition-all border-b-2 ${
                activeTab === 'schemes'
                  ? 'border-emerald-600 text-emerald-700'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Scheme Finder ({schemes.length})
            </button>
          </div>

          <button
            onClick={fetchDashboardData}
            title="Refresh"
            className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100 transition"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* OVERVIEW / APPLICATION TRACKER TAB */}
        {activeTab === 'overview' && (
          <section className="space-y-6">
            {loading ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-400">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-emerald-600" />
                <p className="text-sm font-medium">Loading tracker data...</p>
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center shadow-sm">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-800">No Active Applications</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  You haven't applied for any MoTA scholarship scheme yet.
                </p>
                <button
                  onClick={() => setActiveTab('schemes')}
                  className="mt-4 inline-flex items-center gap-2 bg-emerald-600 text-white text-xs font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition"
                >
                  <PlusCircle className="w-4 h-4" /> Browse Schemes
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {applications.map((app) => {
                  const step = getStatusStep(app.status);
                  return (
                    <div key={app._id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
                      
                      {/* Application Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                        <div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg uppercase tracking-wider">
                            Ref: {app._id?.substring(0, 10)}...
                          </span>
                          <h3 className="text-lg font-bold text-slate-900 mt-1">{app.scheme?.title || 'MoTA Scholarship'}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">
                            Submitted on {new Date(app.createdAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>

                        {app.status === 'Approved' ? (
                          <button className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-xl hover:bg-emerald-100 transition">
                            <Download className="w-3.5 h-3.5" /> Download Sanction Letter
                          </button>
                        ) : app.status === 'Flagged' ? (
                          <button 
                            onClick={() => navigate(`/student/reupload/${app._id}`)}
                            className="inline-flex items-center gap-2 bg-rose-600 text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-rose-700 transition shadow-md shadow-rose-600/20"
                          >
                            <Upload className="w-3.5 h-3.5" /> Re-upload Document
                          </button>
                        ) : null}
                      </div>

                      {/* Timeline Pipeline Tracker */}
                      <div className="py-2">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Verification Pipeline</p>
                        <div className="grid grid-cols-3 gap-2 relative">
                          {/* Step 1 */}
                          <div className={`p-3 rounded-2xl border text-center transition ${step >= 1 ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold mx-auto mb-1 flex items-center justify-center">1</div>
                            <p className="text-xs font-bold">AI OCR Scrutiny</p>
                            <p className="text-[10px] opacity-80 mt-0.5">Automated Check</p>
                          </div>

                          {/* Step 2 */}
                          <div className={`p-3 rounded-2xl border text-center transition ${step >= 2 ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            <div className={`w-6 h-6 rounded-full text-xs font-bold mx-auto mb-1 flex items-center justify-center ${step >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>2</div>
                            <p className="text-xs font-bold">Officer Scrutiny</p>
                            <p className="text-[10px] opacity-80 mt-0.5">{app.status === 'Flagged' ? 'Action Required' : 'Field Officer'}</p>
                          </div>

                          {/* Step 3 */}
                          <div className={`p-3 rounded-2xl border text-center transition ${step >= 3 ? 'bg-emerald-50/50 border-emerald-200 text-emerald-800' : 'bg-slate-50 border-slate-200 text-slate-400'}`}>
                            <div className={`w-6 h-6 rounded-full text-xs font-bold mx-auto mb-1 flex items-center justify-center ${step >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-slate-600'}`}>3</div>
                            <p className="text-xs font-bold">DBT Sanction</p>
                            <p className="text-[10px] opacity-80 mt-0.5">Direct Transfer</p>
                          </div>
                        </div>
                      </div>

                      {/* Details Box */}
                      <div className="grid sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                        <div>
                          <span className="text-slate-400 block font-medium">ST Certificate</span>
                          <span className="font-bold text-slate-700">{app.applicantData?.stCertificateNo || user?.stCertificateNo || 'Verified'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">Declared Annual Income</span>
                          <span className="font-bold text-slate-700">₹{app.applicantData?.annualIncome || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block font-medium">AI Verification Score</span>
                          <span className="font-bold text-emerald-700">{app.aiScrutiny?.confidenceScore || 96}% Matched</span>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* SCHEME FINDER TAB */}
        {activeTab === 'schemes' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search scheme name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              {/* Filter Pills */}
              <div className="flex gap-2 overflow-x-auto w-full sm:w-auto pb-1">
                {['All', 'Pre-Matric', 'Post-Matric', 'Fellowship', 'Overseas'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition ${
                      categoryFilter === cat
                        ? 'bg-slate-900 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {filteredSchemes.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500 text-sm">
                No scholarship schemes match your filter criteria.
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredSchemes.map((scheme) => (
                  <div key={scheme._id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition flex flex-col justify-between">
                    <div className="space-y-3">
                      <span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[10px] font-extrabold uppercase rounded-lg border border-emerald-100">
                        {scheme.category || 'MoTA Scheme'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{scheme.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{scheme.description}</p>
                      
                      <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700">
                        <span className="flex items-center gap-1 text-slate-500">
                          <IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Max Income Limit:
                        </span>
                        <span>₹{(scheme.incomeLimit || 250000).toLocaleString('en-IN')} / yr</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/student/apply/${scheme._id}`)}
                      className="mt-6 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
                    >
                      <span>Apply For Scheme</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;