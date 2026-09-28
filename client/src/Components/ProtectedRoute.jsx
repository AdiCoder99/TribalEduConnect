import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../Context/AppContext';
 const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={user.role === 'Officer' ? '/officer/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

export default ProtectedRoute;