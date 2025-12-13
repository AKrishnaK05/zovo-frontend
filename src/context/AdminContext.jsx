// frontend/src/context/AdminContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import api from '../services/api';

// Create context
const AdminContext = createContext(null);

// Custom hook
export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
}

// Provider component
export function AdminProvider({ children }) {
  const [stats, setStats] = useState({
    users: { total: 0, customers: 0, workers: 0, newThisWeek: 0 },
    jobs: { total: 0, pending: 0, active: 0, completed: 0, newThisWeek: 0 },
    revenue: { total: 0, thisMonth: 0, thisWeek: 0 }
  });

  const [activity, setActivity] = useState({
    recentUsers: [],
    recentJobs: []
  });

  const [loading, setLoading] = useState(false);

  const loadStats = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/stats');
      if (response.data?.data) {
        setStats(response.data.data);
        // Also populate activity from the same response since it includes recent data
        setActivity({
          recentUsers: response.data.data.recentUsers || [],
          recentJobs: response.data.data.recentJobs || []
        });
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Deprecated/Removed separate call, kept for compatibility if needed but empty
  const loadActivity = useCallback(async () => {
    // No-op, data loaded in loadStats
  }, []);

  const value = {
    stats,
    activity,
    loading,
    loadStats,
    loadActivity
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export default AdminContext;