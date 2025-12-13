// frontend/src/services/worker.js
import api from './api';

// ============ PROFILE ============

// Get worker profile
export const getWorkerProfile = async () => {
  const response = await api.get('/worker/profile');
  return response.data;
};

// Update worker profile
export const updateWorkerProfile = async (data) => {
  const response = await api.put('/worker/profile', data);
  return response.data;
};

// ============ SERVICE CATEGORIES ============

// Set service categories
export const setServiceCategories = async (categories) => {
  const response = await api.put('/worker/services', { serviceCategories: categories });
  return response.data;
};

// Get available categories list
export const getServiceCategories = async () => {
  const response = await api.get('/worker/categories');
  return response.data;
};

// ============ AVAILABILITY ============

// Toggle availability
export const toggleAvailability = async (isAvailable) => {
  const response = await api.put('/worker/availability', { isAvailable });
  return response.data;
};

// ============ JOBS ============

// Get all jobs for worker (available + assigned)
export const getWorkerJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

// Get available jobs (matching worker's categories)
export const getAvailableJobs = async () => {
  const response = await api.get('/jobs/available');
  return response.data;
};

// Accept a job
export const acceptJob = async (jobId) => {
  const response = await api.put(`/jobs/${jobId}/accept`);
  return response.data;
};

// Update job status (in_progress, completed, cancelled)
export const updateJobStatus = async (jobId, status) => {
  const response = await api.put(`/jobs/${jobId}/status`, { status });
  return response.data;
};

// Get single job details
export const getJobDetails = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}`);
  return response.data;
};

// ============ STATS ============

// Get worker stats/dashboard data
export const getWorkerStats = async () => {
  const response = await api.get('/worker/stats');
  return response.data;
};

// ============ PUBLIC PROFILE ============

// Get public worker profile (for customers to view)
export const getPublicWorkerProfile = async (workerId) => {
  const response = await api.get(`/worker/${workerId}/public`);
  return response.data;
};

// ============ DEFAULT EXPORT ============
export default {
  getWorkerProfile,
  updateWorkerProfile,
  setServiceCategories,
  getServiceCategories,
  toggleAvailability,
  getWorkerJobs,
  getAvailableJobs,
  acceptJob,
  updateJobStatus,
  getJobDetails,
  getWorkerStats,
  getPublicWorkerProfile
};