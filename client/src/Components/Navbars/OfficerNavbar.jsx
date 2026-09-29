import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  Menu,
  UserCheck,
  LogOut,
  FileSearch,
  Clock
} from 'lucide-react';
import { useApp } from '../../Context/AppContext';

const OfficerNavbar = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const { user, logout } = useApp();
  const location = useLocation();
  const navigate = useNavigate();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifRef = useRef(null);
  const userRef = useRef(null);

  // Click-outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (userRef.current && !userRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Title Mapping
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/officer/dashboard': return 'Nodal Verification Dashboard';
      case '/officer/scrutiny': return 'Application Scrutiny Queue';
      case '/officer/deficiencies': return 'Flagged & Deficient Cases';
      case '/officer/approved': return 'Approved Register';
      case '/officer/institutes': return 'Recognized Institutions';
      case '/officer/analytics': return 'Verification Performance Metrics';
      default: return 'Officer Operations Desk';
    }
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-30 shadow-2xs">
      
      {/* Title & Mobile Menu Toggle */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden sm:block">
          <h2 className="text-sm font-extrabold text-slate-900 leading-none">{getPageTitle()}</h2>
          <p className="text-[10px] text-slate-400 mt-1 font-semibold">State Level Verification Portal</p>
        </div>
      </div>

      {/* Global Search Input */}
      <div className="relative w-44 sm:w-80">
        <label htmlFor="officer-search" className="sr-only">Search Applications</label>
        <FileSearch className="w-4 h-4 absolute left-3.5 top-2.5 text-slate-400 pointer-events-none" aria-hidden="true" />
        <input
          id="officer-search"
          type="text"
          placeholder="Search App ID, Aadhaar or Student Name..."
          className="w-full pl-9 pr-4 py-2 bg-slate-100/80 rounded-xl text-xs border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden transition"
        />
      </div>

      {/* Right User & Notification Controls */}
      <div className="flex items-center gap-3">
        
        {/* Workload Alerts Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
            aria-label="View Workload Notifications"
            aria-expanded={showNotifications}
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full ring-2 ring-white" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-40 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-xs font-bold text-slate-900">Workload Alerts</h3>
                <span className="text-[10px] font-extrabold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                  2 SLA Escalations
                </span>
              </div>

              <div className="space-y-2 mt-3 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                <div className="p-2.5 bg-amber-50/60 rounded-xl text-xs space-y-1 border border-amber-100">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-amber-900">SLA Warning: NFST-8910</p>
                    <Clock className="w-3 h-3 text-amber-600" />
                  </div>
                  <p className="text-[11px] text-amber-800">Pending review for 48 hours. Auto-escalation in 12 hours.</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/officer/scrutiny');
                }}
                className="w-full text-center text-xs font-bold text-emerald-700 hover:underline pt-3 mt-2 border-t border-slate-100 block"
              >
                Go to Scrutiny Queue →
              </button>
            </div>
          )}
        </div>

        {/* Profile Pill */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2.5 pl-3 border-l border-slate-200/80 hover:opacity-80 transition cursor-pointer focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 rounded-lg py-1"
            aria-expanded={showUserDropdown}
            aria-label="User Profile Menu"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
              NO
            </div>
            <div className="text-left leading-tight hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user?.name || 'Dr. R. K. Mahapatra'}</p>
              <p className="text-[10px] text-emerald-700 font-extrabold uppercase">District Nodal Officer</p>
            </div>
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-40 space-y-1 text-xs font-medium text-slate-700 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="p-3 border-b border-slate-100">
                <p className="font-bold text-slate-900">{user?.name || 'Dr. R. K. Mahapatra'}</p>
                <p className="text-[10px] text-slate-400">ID: #NOD-JH-80492</p>
              </div>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  navigate('/officer/profile');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 text-slate-700 transition"
              >
                <UserCheck className="w-3.5 h-3.5 text-slate-500" /> Verification Credentials
              </button>

              <button
                onClick={() => {
                  setShowUserDropdown(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-rose-50 text-rose-600 font-semibold transition"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout Desk
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default OfficerNavbar;