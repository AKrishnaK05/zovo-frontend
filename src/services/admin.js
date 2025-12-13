import api from './api';

// Dashboard
export const getAdminStats = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const getRecentActivity = async () => {
  const response = await api.get('/admin/activity');
  return response.data;
};

// Users
export const getAllUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

export const getUser = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data;
};

export const updateUser = async (id, data) => {
  const response = await api.put(`/admin/users/${id}`, data);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

// Jobs
export const getAllJobs = async (params = {}) => {
  const response = await api.get('/admin/jobs', { params });
  return response.data;
};

export const updateJob = async (id, data) => {
  const response = await api.put(`/admin/jobs/${id}`, data);
  return response.data;
};

export const deleteJob = async (id) => {
  const response = await api.delete(`/admin/jobs/${id}`);
  return response.data;
};