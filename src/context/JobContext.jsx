import { createContext, useContext, useState, useCallback } from 'react';
import { fetchJobs, createNewJob, updateJobById, deleteJobById } from '../services/jobs';

const JobContext = createContext(null);

export const JobProvider = ({ children }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all jobs
  const loadJobs = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchJobs();
      setJobs(response.data || []);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to load jobs';
      setError(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a job
  const createJob = useCallback(async (jobData) => {
    setError(null);
    try {
      const response = await createNewJob(jobData);
      setJobs(prev => [response.data, ...prev]);
      return { success: true, job: response.data };
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to create job';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Update a job
  const updateJob = useCallback(async (id, jobData) => {
    setError(null);
    try {
      const response = await updateJobById(id, jobData);
      setJobs(prev => prev.map(job => job._id === id ? response.data : job));
      return { success: true, job: response.data };
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to update job';
      setError(message);
      return { success: false, message };
    }
  }, []);

  // Delete a job
  const deleteJob = useCallback(async (id) => {
    setError(null);
    try {
      await deleteJobById(id);
      setJobs(prev => prev.filter(job => job._id !== id));
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.error || 'Failed to delete job';
      setError(message);
      return { success: false, message };
    }
  }, []);

  const value = {
    jobs,
    loading,
    error,
    loadJobs,
    createJob,
    updateJob,
    deleteJob
  };

  return (
    <JobContext.Provider value={value}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook
export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};

export default JobContext;