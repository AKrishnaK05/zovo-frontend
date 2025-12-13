// frontend/src/context/DataContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const DataContext = createContext(null);

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}

const FALLBACK_CATEGORIES = [
  { _id: '1', name: 'Plumbing', slug: 'plumbing', icon: '🔧', basePrice: 499, minDuration: 60, description: 'Leak repairs and installations' },
  { _id: '2', name: 'Electrical', slug: 'electrical', icon: '⚡', basePrice: 599, minDuration: 60, description: 'Wiring and electrical repairs' },
  { _id: '3', name: 'Cleaning', slug: 'cleaning', icon: '🧹', basePrice: 399, minDuration: 120, description: 'Deep cleaning services' },
  { _id: '4', name: 'Painting', slug: 'painting', icon: '🎨', basePrice: 1999, minDuration: 240, description: 'Wall painting services' },
  { _id: '5', name: 'Carpentry', slug: 'carpentry', icon: '🪚', basePrice: 699, minDuration: 60, description: 'Furniture and woodwork' },
  { _id: '6', name: 'AC Service', slug: 'ac-service', icon: '❄️', basePrice: 799, minDuration: 60, description: 'AC repair and servicing' },
  { _id: '7', name: 'Appliance', slug: 'appliance', icon: '🔌', basePrice: 599, minDuration: 60, description: 'Appliance repairs' },
  { _id: '8', name: 'Other', slug: 'other', icon: '📦', basePrice: 499, minDuration: 60, description: 'Other services' },
];

export function DataProvider({ children }) {
  const [categories, setCategories] = useState(FALLBACK_CATEGORIES);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastFetch, setLastFetch] = useState(null);

  // Fetch all data
  const fetchData = useCallback(async (force = false) => {
    const token = localStorage.getItem('token');
    
    // Skip if recently fetched (within 30 seconds) unless forced
    if (!force && lastFetch && Date.now() - lastFetch < 30000) {
      console.log('⏭️ Skipping fetch - recently fetched');
      return;
    }

    setLoading(true);
    console.log('📊 Fetching data...', { hasToken: !!token });

    try {
      // Always fetch categories
      const catRes = await api.get('/pricing/categories');
      const catData = catRes.data?.data || catRes.data || [];
      if (catData.length > 0) {
        setCategories(catData);
      }

      // Fetch jobs only if authenticated
      if (token) {
        try {
          const jobsRes = await api.get('/jobs');
          console.log('📋 Jobs response:', jobsRes.data);
          const jobsData = jobsRes.data?.data || jobsRes.data || [];
          setJobs(jobsData);
          console.log('✅ Jobs loaded:', jobsData.length);
        } catch (jobErr) {
          console.error('❌ Jobs fetch error:', jobErr.response?.data || jobErr.message);
          setJobs([]);
        }
      } else {
        setJobs([]);
      }

      setLastFetch(Date.now());
      console.log('✅ Data fetch complete');
    } catch (err) {
      console.error('❌ Fetch error:', err.message);
    } finally {
      setLoading(false);
    }
  }, [lastFetch]);

  // Initial fetch
  useEffect(() => {
    fetchData(true);
  }, []);

  // Listen for token changes (login/logout)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log('🔄 Token changed, refetching...');
        fetchData(true);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchData]);

  // Manual refresh function
  const refreshData = useCallback(async () => {
    console.log('🔄 Manual refresh triggered');
    await fetchData(true);
  }, [fetchData]);

  // Refresh jobs only
  const refreshJobs = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const jobsRes = await api.get('/jobs');
      const jobsData = jobsRes.data?.data || [];
      setJobs(jobsData);
      console.log('✅ Jobs refreshed:', jobsData.length);
    } catch (err) {
      console.error('❌ Jobs refresh error:', err.message);
    }
  }, []);

  const value = {
    categories,
    jobs,
    loading,
    refreshData,
    refreshJobs
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;