import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Components/Sidebars/SideBar';
import Navbar from '../Components/Navbars/NavBar';

const DashboardLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex font-sans antialiased text-slate-800">
      {/* Reusable Sidebar */}
      <Sidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Reusable Navbar */}
        <Navbar 
          isMobileMenuOpen={mobileMenuOpen} 
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />

        {/* Dynamic Page Views are injected here */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;