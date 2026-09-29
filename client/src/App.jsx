import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from '../src/Pages/AuthPages/Login';
import Register from '../src/Pages/AuthPages/Register';
import StudentDashboard from './Pages/Dashboards/StudentDashboard';
import ApplyScheme from './Pages/ApplyScheme';
import SchemesPage from './Pages/SchemesPage';
import DashboardLayout from './Layouts/DashboardLayout';
import OfficerDashboard from './Pages/Dashboards/OfficerDashboard';
import OfficerLayout from './Layouts/OfficerLayout';
import ProfileSetup from './Pages/ProfileSetup';



function App() {

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/student/profile/setup"
          element={
            <ProtectedRoute allowedRoles="STUDENT">
              <ProfileSetup /> {/* Clean full-screen step layout without Dashboard Sidebar */}
            </ProtectedRoute>
          }
        />

        {/* Dashboard Layout Group */}
        <Route path="/student" element={<ProtectedRoute allowedRoles="STUDENT">
          <DashboardLayout />
        </ProtectedRoute>}>
          <Route path="dashboard" element={<StudentDashboard />} />
          <Route path="schemes" element={<SchemesPage />} />
          <Route path="apply" element={<ApplyScheme />} />
          {/* Add future routes seamlessly here */}
          {/* <Route path="applications" element={<MyApplicationsPage />} /> */}
          {/* <Route path="documents" element={<MyDocumentsPage />} /> */}
        </Route>
        <Route
          path="/student/apply/:schemeId"
          element={
            <ProtectedRoute allowedRole="Student">
              <ApplyScheme />
            </ProtectedRoute>
          }
        />

        <Route path="/officer" element={<ProtectedRoute allowedRole="['OFFICER', 'SCRUTINIZER']">
          <OfficerLayout />
        </ProtectedRoute>}>
          <Route path="dashboard" element={<OfficerDashboard />} />
          {/* Add future routes for officer here */}
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;