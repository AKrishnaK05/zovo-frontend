// frontend/src/context/WorkerContext.jsx
import { createContext, useContext, useState, useCallback } from 'react';
import {
  getWorkerJobs,
  getAvailableJobs,
  acceptJob as acceptJobAPI,
  rejectJob as rejectJobAPI,
  updateJobStatus as updateJobStatusAPI,
  getWorkerStats
} from '../services/worker';

const WorkerContext = createContext(null);

export const useWorker = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorker must be used within a WorkerProvider');
  }
  return context;
};

export const WorkerProvider = ({ children }) => {
  const [availableJobs, setAvailableJobs] = useState([]);
  const [myJobs, setMyJobs] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all jobs (available + my jobs)
  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [availableResponse, allJobsResponse] = await Promise.all([
        getAvailableJobs().catch(() => ({ data: [] })),
        getWorkerJobs()
      ]);

      setAvailableJobs(availableResponse.data || []);

      // Filter my jobs (assigned to me)
      const allJobs = allJobsResponse.data || [];
      const assigned = allJobs.filter(job => job.worker);
      setMyJobs(assigned);

    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError(err.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load worker stats
  const loadStats = useCallback(async () => {
    try {
      const response = await getWorkerStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  }, []);

  // Accept a job
  const acceptJob = useCallback(async (jobId) => {
    try {
      const response = await acceptJobAPI(jobId);

      // Move job from available to myJobs
      setAvailableJobs(prev => prev.filter(job => job._id !== jobId));
      setMyJobs(prev => [...prev, response.data]);

      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to accept job';
      return { success: false, message };
    }
  }, []);

  // Reject a job
  const rejectJob = useCallback(async (jobId) => {
    try {
      // Optimistic update: Remove from available jobs immediately
      setAvailableJobs(prev => prev.filter(job => job._id !== jobId));

      await rejectJobAPI(jobId);

      return { success: true };
    } catch (err) {
      console.error('Failed to reject job:', err);
      // If failure, maybe restore? But for rejection, usually safe to just hide.
      // Reloading jobs would ensure consistency.
      loadJobs();

      const message = err.response?.data?.message || 'Failed to reject job';
      return { success: false, message };
    }
  }, [loadJobs]);

  // Update job status
  const updateJobStatus = useCallback(async (jobId, status) => {
    try {
      const response = await updateJobStatusAPI(jobId, status);

      // Update job in myJobs list
      setMyJobs(prev => prev.map(job =>
        job._id === jobId ? { ...job, status } : job
      ));

      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update job status';
      return { success: false, message };
    }
  }, []);

  // Refresh all data
  const refresh = useCallback(async () => {
    await Promise.all([loadJobs(), loadStats()]);
  }, [loadJobs, loadStats]);

  const value = {
    availableJobs,
    myJobs,
    stats,
    loading,
    error,
    loadJobs,
    loadStats,
    loadStats,
    acceptJob,
    rejectJob,
    updateJobStatus,
    refresh
  };

  return (
    <WorkerContext.Provider value={value}>
      {children}
    </WorkerContext.Provider>
  );
};

export default WorkerContext;