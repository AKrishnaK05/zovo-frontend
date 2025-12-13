import { useState, useEffect } from 'react';
import api from '../../services/api';

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [ratingFilter, setRatingFilter] = useState('all');
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews'); // Admin route
      setReviews(response.data.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this review?')) return;

    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
      if (selectedReview?._id === id) setSelectedReview(null);
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch =
      review.worker?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);

    return matchesSearch && matchesRating;
  });

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Reviews</h1>
          <p className="text-gray-400 mt-2">Manage customer feedback and ratings</p>
        </div>

        <div className="flex gap-4">
          <select
            value={ratingFilter}
            onChange={(e) => setRatingFilter(e.target.value)}
            className="input md:w-40"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars ⭐⭐⭐⭐⭐</option>
            <option value="4">4 Stars ⭐⭐⭐⭐</option>
            <option value="3">3 Stars ⭐⭐⭐</option>
            <option value="2">2 Stars ⭐⭐</option>
            <option value="1">1 Star ⭐</option>
          </select>

          <input
            type="text"
            placeholder="Search reviews..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input md:w-64"
          />
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="panel-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800 bg-gray-900/50">
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Date</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Rating</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Worker</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Customer</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Job</th>
                <th className="text-left py-4 px-6 text-gray-400 font-medium text-sm">Comment</th>
                <th className="text-right py-4 px-6 text-gray-400 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">
                    No reviews found
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review._id} className="hover:bg-white/5 transition-colors group">
                    <td className="py-4 px-6 text-gray-400 text-sm whitespace-nowrap">
                      {formatDate(review.createdAt)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i}>{i < review.rating ? '⭐' : '☆'}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-white font-medium">
                      {review.worker?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {review.customer?.name || 'Unknown'}
                    </td>
                    <td className="py-4 px-6 text-gray-300">
                      {review.job?.title || 'Unknown'}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-left text-gray-300 hover:text-white transition max-w-xs truncate block w-full"
                        title="Click to view full comment"
                      >
                        {review.comment}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedReview(review)}
                        className="text-cyan-400 hover:text-cyan-300 p-2 rounded-lg transition"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => handleDelete(review._id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-lg transition"
                        title="Delete Review"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedReview(null)}>
          <div className="bg-[#111827] border border-gray-700 rounded-xl max-w-lg w-full p-6 shadow-2xl transform transition-all scale-100" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-white">Review Details</h2>
              <button
                onClick={() => setSelectedReview(null)}
                className="text-gray-400 hover:text-white transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                    {selectedReview.customer?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg">{selectedReview.customer?.name}</p>
                    <p className="text-gray-400 text-sm">{formatDate(selectedReview.createdAt)}</p>
                  </div>
                </div>
                <div className="flex text-yellow-400 text-2xl">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i}>{i < selectedReview.rating ? '⭐' : '☆'}</span>
                  ))}
                </div>
              </div>

              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {selectedReview.comment}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-500 block mb-1">Worker</span>
                  <span className="text-white font-medium">{selectedReview.worker?.name}</span>
                </div>
                <div className="p-3 bg-gray-900 rounded-lg">
                  <span className="text-gray-500 block mb-1">Job</span>
                  <span className="text-white font-medium">{selectedReview.job?.title}</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() => handleDelete(selectedReview._id)}
                  className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 rounded-lg transition flex items-center gap-2"
                >
                  <span>🗑️</span> Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;