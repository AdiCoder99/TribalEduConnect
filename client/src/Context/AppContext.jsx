import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';


const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 1. Authentication & Profile State
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [authLoading, setAuthLoading] = useState(true);

  const navigate = useNavigate();

  // 2. Data Collections
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [notifications, setNotifications] = useState([]);

  // 3. Global UI & Feedback States
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message: '' }

  // Toast Helper
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  // Sync token header and verify profile on initial mount
  useEffect(() => {

  const initAuth = async () => {

    setLoading(true);

    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;

      try {
        const res = await API.get('/auth/me');

setUser(res.data?.user || res.data);

        setUser(res.data?.user || res.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        logout();
      } finally {
        setLoading(false);
      }
    }

    setAuthLoading(false);
  };

  initAuth();
}, []);

  // --- AUTH ACTIONS ---
  const login = async (credentials) => {
    setLoading(true);
    try {
      const res = await API.post('/auth/login', credentials);
      const { token: newToken, user: userData } = res.data;
      console.log('Login successful:', userData);

      localStorage.setItem('token', newToken);
      API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setToken(newToken);
      setUser(userData);
      showToast('Login successful!', 'success');
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.error || err.response?.data?.message || 'Login failed';
      showToast(msg, 'error');
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
    setToken(null);
    setUser(null);
    setApplications([]);
    setSchemes([]);
    setNotifications([]);
    showToast('Logged out successfully', 'info');
    navigate('/login', { replace: true });
  };

  // --- APPLICATION DATA ACTIONS ---
  const fetchMyApplications = useCallback(async () => {
    try {
      const res = await API.get('/applications/my-applications');
      const data = res.data?.data || res.data || [];
      setApplications(data);
      return data;
    } catch (err) {
      console.error('Error fetching applications:', err);
    }
  }, []);

  const fetchSchemes = useCallback(async () => {
    try {
      const res = await API.get('/schemes');
      const data = res.data?.data || res.data || [];
      setSchemes(data);
      return data;
    } catch (err) {
      console.error('Error fetching schemes:', err);
    }
  }, []);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await API.get('/notifications/my-notifications');
      const data = res.data?.data || res.data || [];
      setNotifications(data);
      return data;
    } catch (err) {
      // Ignore fallback errors if notifications service is inactive
    }
  }, []);

  // Helper to trigger a complete data refresh
  const refreshAppData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchMyApplications(), fetchSchemes(), fetchNotifications()]);
    setLoading(false);
  }, [fetchMyApplications, fetchSchemes, fetchNotifications]);

  const value = {
    // Auth & User State
    user,
    token,
    authLoading,
    isAuthenticated: !!user,
    login,
    logout,
    setUser,

    // Data Collections
    applications,
    schemes,
    notifications,
    fetchMyApplications,
    fetchSchemes,
    fetchNotifications,
    refreshAppData,

    // Global UI Feedback
    loading,
    setLoading,
    toast,
    showToast,
  };

  return (
    <AppContext.Provider value={value}>
      {children}

      {/* Global Toast Notification Banner */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl text-xs font-semibold border border-slate-700 animate-bounce">
          <span className={toast.type === 'error' ? 'text-rose-400' : 'text-emerald-400'}>●</span>
          {toast.message}
        </div>
      )}
    </AppContext.Provider>
  );
};

// Custom Hook to consume AppContext throughout the project
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Backward-compatible alias so existing components using useAuth() won't break
export const useAuth = () => useApp();