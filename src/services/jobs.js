import api from './api';

export const fetchJobs = async () => {
  const response = await api.get('/jobs');
  return response.data;
};

export const fetchJob = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};

export const createNewJob = async (jobData) => {
  const response = await api.post('/jobs', jobData);
  return response.data;
};

export const updateJobById = async (id, jobData) => {
  const response = await api.put(`/jobs/${id}`, jobData);
  return response.data;
};

export const deleteJobById = async (id) => {
  const response = await api.delete(`/jobs/${id}`);
  return response.data;
};