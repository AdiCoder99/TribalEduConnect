import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FilePlus,
  FileText,
  Folder,
  Bell,
  GraduationCap,
  User,
  HelpCircle,
  LogOut,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useApp } from '../../Context/AppContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useApp();

  const navGroups = [
    {
      groupLabel: 'Main Menu',
      items: [
        { label: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
        { label: 'Apply for Scheme', path: '/student/apply', icon: FilePlus },
        { label: 'My Applications', path: '/student/applications', icon: FileText },
        { label: 'My Documents', path: '/student/documents', icon: Folder },
      ],
    },
    {
      groupLabel: 'Services & Support',
      items: [
        { label: 'Notifications', path: '/student/notifications', icon: Bell, badge: 3 },
        { label: 'Scholarship Schemes', path: '/student/schemes', icon: GraduationCap },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 hidden lg:flex h-screen sticky top-0 font-sans">
      <div className="flex-1 overflow-y-auto min-h-0">
        
        {/* Official Branding Header */}
        <div 
          onClick={() => navigate('/student/dashboard')} 
          className="p-4 flex items-center gap-3 border-b border-slate-200 bg-slate-50 cursor-pointer"
        >
          <div className="w-9 h-9 bg-emerald-800 text-white flex items-center justify-center font-bold rounded-xs shrink-0 shadow-2xs">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-900 leading-none tracking-tight">TribalVidya</h1>
            <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mt-1">Student Portal</p>
          </div>
        </div>

        {/* User Identity / Verification Badge Box */}
        <div className="mx-3 my-3 p-3 bg-slate-50 border border-slate-200 rounded-xs flex items-center gap-3">
          <div className="w-8 h-8 rounded-xs bg-emerald-800 text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user?.name ? user.name.charAt(0) : 'S'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Student Desk'}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
              <span className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Aadhaar e-KYC Verified</span>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="px-2 space-y-4">
          {navGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {group.groupLabel}
              </p>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-xs transition ${
                      isActive
                        ? 'bg-emerald-800 text-white font-bold'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className={`px-1.5 py-0.5 text-[10px] font-bold border rounded-xs ${
                        isActive 
                          ? 'bg-white text-emerald-900 border-white' 
                          : 'bg-rose-100 text-rose-900 border-rose-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}

          {/* User Account Settings */}
          <div className="space-y-1 pt-2 border-t border-slate-200">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Account Settings
            </p>
            <button 
              onClick={() => navigate('/student/profile')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xs transition ${
                location.pathname === '/student/profile'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <User className="w-4 h-4 text-slate-500 shrink-0" /> Profile & Settings
            </button>
            <button 
              onClick={() => navigate('/student/support')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-xs transition ${
                location.pathname === '/student/support'
                  ? 'bg-emerald-800 text-white font-bold'
                  : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" /> Help & Support
            </button>
          </div>
        </nav>
      </div>

      {/* Official Government Footer Notice */}
      <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-2">
        <div className="bg-white border border-slate-200 p-2.5 rounded-xs space-y-1">
          <div className="flex items-center gap-1.5 text-slate-700">
            <Building2 className="w-3.5 h-3.5 text-emerald-800 shrink-0" />
            <span className="text-[10px] font-bold uppercase text-slate-800 tracking-wider">Ministry of Tribal Affairs</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Government of India Scholarship Direct Benefit Transfer (DBT) System
          </p>
        </div>

        <button 
          onClick={logout}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 rounded-xs transition"
        >
          <LogOut className="w-4 h-4 text-rose-700 shrink-0" /> Logout Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;