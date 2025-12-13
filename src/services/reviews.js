import api from './api';

// Create a new review
export const createReview = async (reviewData) => {
  try {
    const response = await api.post('/reviews', reviewData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit review' };
  }
};

// Get reviews for a worker
export const getWorkerReviews = async (workerId, page = 1, limit = 10) => {
  try {
    const response = await api.get(`/reviews/worker/${workerId}?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reviews' };
  }
};

// Get my reviews (for worker)
export const getMyReviews = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/reviews/my-reviews?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch reviews' };
  }
};

// Get review for a specific job
export const getJobReview = async (jobId) => {
  try {
    const response = await api.get(`/reviews/job/${jobId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch review' };
  }
};

// Update a review
export const updateReview = async (reviewId, data) => {
  try {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update review' };
  }
};

// Worker responds to review
export const respondToReview = async (reviewId, comment) => {
  try {
    const response = await api.put(`/reviews/${reviewId}/respond`, { comment });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to submit response' };
  }
};

// Delete a review
export const deleteReview = async (reviewId) => {
  try {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete review' };
  }
};

export default {
  createReview,
  getWorkerReviews,
  getMyReviews,
  getJobReview,
  updateReview,
  respondToReview,
  deleteReview
};