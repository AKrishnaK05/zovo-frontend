import api from './api';

export const calculatePrice = async (data) => {
  const response = await api.post('/pricing/calculate', data);
  return response.data;
};

export const getCategories = async () => {
  const response = await api.get('/pricing/categories');
  return response.data;
};

export const getCategory = async (slug) => {
  const response = await api.get(`/pricing/categories/${slug}`);
  return response.data;
};

export default { calculatePrice, getCategories, getCategory };