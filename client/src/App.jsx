import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './Pages/Login';
import Register from './Pages/Register';
import StudentDashboard from './Pages/StudentDashboard';
import ApplyScheme from './Pages/ApplyScheme';

const OfficerDashboard = () => <div className="p-8 text-xl font-bold text-slate-800">Officer Dashboard</div>;

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/student/dashboard"
        element={
          <StudentDashboard />
        }
      />
      <Route
        path="/student/apply/:schemeId"
        element={
          <ProtectedRoute allowedRole="Student">
            <ApplyScheme />
          </ProtectedRoute>
        }
      />
      <Route
        path="/officer/dashboard"
        element={
          <ProtectedRoute allowedRole="Officer">
            <OfficerDashboard />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;