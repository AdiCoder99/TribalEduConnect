import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import OfficerSidebar from '../Components/Sidebars/OfficerSidebar';
import OfficerNavbar from '../Components/Navbars/OfficerNavbar';

const OfficerLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans antialiased text-slate-800">
      {/* Officer Sidebar */}
      <OfficerSidebar 
        mobileOpen={mobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Officer Header */}
        <OfficerNavbar 
          isMobileMenuOpen={mobileMenuOpen} 
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)} 
        />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OfficerLayout;