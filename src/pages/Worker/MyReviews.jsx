import { useState, useEffect } from 'react';
import { Star, Loader2 } from 'lucide-react';
import api from '../../services/api';

const MyReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, average: 0 });

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('/reviews/my-reviews');
      setReviews(response.data.data || []);
      setStats({
        total: response.data.total || 0,
        average: calculateAverage(response.data.data || [])
      });
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAverage = (reviewsList) => {
    if (reviewsList.length === 0) return 0;
    const sum = reviewsList.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviewsList.length).toFixed(1);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StarDisplay = ({ rating }) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? 'text-yellow-400' : 'text-gray-600'}>
          <Star size={16} fill={star <= rating ? "currentColor" : "none"} />
        </span>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-purple-500" size={48} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Reviews</h1>
        <p className="text-gray-400 mt-2">See what customers say about your work</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="panel-card p-6 text-center">
          <div className="text-5xl font-bold gradient-text mb-2">{stats.average}</div>
          <StarDisplay rating={Math.round(stats.average)} />
          <p className="text-gray-400 mt-2">Average Rating</p>
        </div>
        <div className="panel-card p-6 text-center">
          <div className="text-5xl font-bold text-white mb-2">{stats.total}</div>
          <p className="text-gray-400">Total Reviews</p>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <div className="flex justify-center mb-4"><Star size={64} className="text-gray-600" /></div>
          <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
          <p className="text-gray-400">Complete jobs to start receiving reviews.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review._id} className="panel-card p-6">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {review.customer?.name?.charAt(0).toUpperCase() || 'C'}
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{review.customer?.name || 'Customer'}</h4>
                    <p className="text-gray-500 text-sm">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <StarDisplay rating={review.rating} />
              </div>

              {/* Job Info */}
              {review.job && (
                <div className="mb-3 px-3 py-2 bg-gray-800/50 rounded-lg">
                  <p className="text-sm text-gray-400">
                    Job: <span className="text-gray-300">{review.job.title}</span>
                  </p>
                </div>
              )}

              {/* Comment */}
              <p className="text-gray-300">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReviews;