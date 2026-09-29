import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  Building2,
  AlertTriangle,
  FileCheck,
  BarChart3,
  HelpCircle,
  LogOut,
  ShieldCheck,
  ChevronRight,
  X
} from 'lucide-react';
import { useApp } from '../../Context/AppContext';

const OfficerSidebar = ({ mobileOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useApp();

  useEffect(() => {
    if (mobileOpen && onClose) onClose();
  }, [location.pathname]);

  const navGroups = [
    {
      groupLabel: 'Core Verification',
      items: [
        { label: 'Dashboard', path: '/officer/dashboard', icon: LayoutDashboard },
        { label: 'Scrutiny Queue', path: '/officer/scrutiny', icon: ClipboardCheck, badge: '124', badgeColor: 'bg-amber-100 text-amber-900 border-amber-300' },
        { label: 'Deficiency Reports', path: '/officer/deficiencies', icon: AlertTriangle, badge: '18', badgeColor: 'bg-rose-100 text-rose-900 border-rose-300' },
        { label: 'Approved Register', path: '/officer/approved', icon: FileCheck },
      ]
    },
    {
      groupLabel: 'Administration',
      items: [
        { label: 'Institute Directory', path: '/officer/institutes', icon: Building2 },
        { label: 'Verification Analytics', path: '/officer/analytics', icon: BarChart3 },
      ]
    }
  ];

  return (
    <>
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside 
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-white text-slate-800 border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 lg:translate-x-0 lg:static lg:z-auto h-screen shrink-0
          ${mobileOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
        `}
      >
        <div className="flex-1 overflow-y-auto min-h-0">
          
          {/* Official Brand Header */}
          <div className="p-4 flex items-center justify-between border-b border-slate-200 bg-slate-50">
            <button
              onClick={() => navigate('/officer/dashboard')}
              className="flex items-center gap-3 text-left focus:outline-hidden"
            >
              <div className="w-9 h-9 bg-emerald-700 text-white flex items-center justify-center font-bold rounded-xs shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-slate-900 leading-none">TribalEduConnect</h1>
                <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider mt-1">Nodal Officer Portal</p>
              </div>
            </button>

            <button onClick={onClose} className="lg:hidden p-1 text-slate-500 hover:text-slate-800">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Assigned Jurisdiction Box */}
          <div className="mx-3 my-3 p-3 bg-slate-100 border border-slate-200 rounded-xs flex items-center justify-between">
            <div>
              <span className="text-[9px] uppercase font-bold text-slate-500 block">Assigned District</span>
              <p className="text-xs font-bold text-slate-900">Ranchi Zone-1 Desk</p>
            </div>
            <span className="w-2.5 h-2.5 bg-emerald-600 rounded-full shrink-0" title="Active" />
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
                          ? 'bg-emerald-700 text-white font-bold'
                          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold border rounded-xs ${item.badgeColor}`}>
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 space-y-1">
          <button 
            onClick={() => navigate('/officer/support')}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-xs transition"
          >
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0" /> Verification SOP Manual
          </button>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-100 rounded-xs transition"
          >
            <LogOut className="w-4 h-4 text-rose-700 shrink-0" /> Logout Desk
          </button>
        </div>
      </aside>
    </>
  );
};

export default OfficerSidebar;