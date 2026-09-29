import React from 'react';
import { Navigate } from 'react-router-dom';
import { useApp } from '../Context/AppContext';

const ROLE_DASHBOARDS = {
  STUDENT: '/student/dashboard',
  OFFICER: '/officer/dashboard',
  SCRUTINIZER: '/officer/dashboard',
};

const ProtectedRoute = ({ children, allowedRoles }) => {

  const { user, authLoading } = useApp();

  console.log("PROTECTED:", {
  path: window.location.pathname,
  authLoading,
  user,
});

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (!user) {
  console.log("🚨 REDIRECTING TO LOGIN");
  return <Navigate to="/login" replace />;
}

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Convert incoming allowedRoles into an uppercase array
  const rawRoles = Array.isArray(allowedRoles)
    ? allowedRoles
    : allowedRoles
    ? [allowedRoles]
    : [];

  const normalizedAllowedRoles = rawRoles.map((r) => r.toUpperCase());
  const userRole = (user.role || '').toUpperCase();

  // Allow OFFICER and SCRUTINIZER interchangeably
  const isAuthorized = normalizedAllowedRoles.some((role) => {
    if (role === 'OFFICER' || role === 'SCRUTINIZER') {
      return userRole === 'OFFICER' || userRole === 'SCRUTINIZER';
    }
    return userRole === role;
  });

  if (normalizedAllowedRoles.length > 0 && !isAuthorized) {
    const fallbackPath = ROLE_DASHBOARDS[userRole] || '/login';
    return <Navigate to={fallbackPath} replace />;
  }

  return children;
};

export default ProtectedRoute;