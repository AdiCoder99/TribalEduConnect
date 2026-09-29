import React, { useState } from 'react';
import { Search, Bell, Menu, X, User, LogOut, HelpCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { useApp } from '../../Context/AppContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ onMobileMenuToggle, isMobileMenuOpen }) => {
  const { user, notifications, logout } = useApp();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const unreadCount = notifications?.filter((n) => !n.isRead)?.length || 3;

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between sticky top-0 z-30 font-sans shadow-2xs">
      
      {/* Left: Mobile Toggle & Global Portal Search */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuToggle}
          className="lg:hidden p-1.5 rounded-xs text-slate-600 hover:bg-slate-100 border border-slate-300 transition"
          aria-label="Toggle Navigation Menu"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Global Search Bar */}
        <div className="relative w-48 sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search Application ID, Scheme, or FAQs..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-xs text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:border-emerald-800 focus:ring-1 focus:ring-emerald-800 focus:outline-hidden transition"
          />
        </div>
      </div>

      {/* Right: Notifications & Official Profile Menu */}
      <div className="flex items-center gap-3">
        
        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowUserDropdown(false);
            }}
            className={`relative p-2 text-slate-600 hover:bg-slate-100 border rounded-xs transition ${
              showNotifications ? 'bg-slate-100 border-slate-400' : 'border-slate-200'
            }`}
            aria-label="Notifications Drawer"
          >
            <Bell className="w-4 h-4 text-slate-700" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1 py-0.2 bg-rose-700 text-white font-bold text-[9px] border border-white rounded-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Official Notifications Flyout Drawer */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-300 shadow-lg p-0 z-40 rounded-xs">
              <div className="flex items-center justify-between p-3 bg-slate-50 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Portal Bulletins & Alerts</h4>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded-xs">
                  {unreadCount} Unread
                </span>
              </div>

              <div className="divide-y divide-slate-200 max-h-64 overflow-y-auto">
                <div className="p-3 bg-slate-50/50 hover:bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">Scrutiny Status Update</p>
                    <span className="text-[9px] font-mono text-slate-400">2h ago</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Your NFST 2026 application document verification is currently undergoing officer review.
                  </p>
                </div>

                <div className="p-3 hover:bg-slate-50 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-slate-900">Scheme Opening Notice</p>
                    <span className="text-[9px] font-mono text-slate-400">1d ago</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    National Overseas Scholarship (NOS) applications for Academic Year 2026-27 are active.
                  </p>
                </div>
              </div>

              <button 
                onClick={() => {
                  setShowNotifications(false);
                  navigate('/student/notifications');
                }}
                className="w-full text-center text-xs font-bold text-emerald-800 bg-slate-50 hover:bg-slate-100 p-2.5 border-t border-slate-200 flex items-center justify-center gap-1 transition"
              >
                View Notification History <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* User Profile Pill & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowNotifications(false);
            }}
            className={`flex items-center gap-2.5 pl-3 border-l border-slate-200 py-1 hover:opacity-90 transition cursor-pointer text-left`}
          >
            <div className="w-8 h-8 rounded-xs bg-emerald-800 text-white font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-900 shadow-2xs">
              {user?.name ? user.name.charAt(0) : 'A'}
            </div>
            <div className="leading-tight hidden sm:block">
              <p className="text-xs font-bold text-slate-900">{user?.name || 'Aditya Srivastava'}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">ST Beneficiary</span>
              </div>
            </div>
          </button>

          {/* Profile Quick Action Flyout */}
          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-300 shadow-lg p-0 z-40 rounded-xs text-xs">
              <div className="p-3 border-b border-slate-200 bg-slate-50">
                <p className="font-bold text-slate-900">{user?.name || 'Aditya Srivastava'}</p>
                <p className="text-[10px] font-mono text-slate-500 truncate">{user?.email || 'aditya.st@tribal.gov.in'}</p>
                <div className="mt-2 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500">e-KYC Verification:</span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-1 rounded-xs">VERIFIED</span>
                </div>
              </div>

              <div className="p-1 space-y-0.5">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/student/profile');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-xs text-left"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" /> My Profile & Documents
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    navigate('/student/support');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-100 font-medium rounded-xs text-left"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" /> Portal Support & Help Desk
                </button>

                <div className="border-t border-slate-200 my-1"></div>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    logout();
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-700 hover:bg-rose-50 font-bold rounded-xs text-left"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-700" /> Logout Desk Session
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;