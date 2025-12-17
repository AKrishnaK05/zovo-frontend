// frontend/src/pages/Customer/WriteReview.jsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { PartyPopper, X, ThumbsUp, ThumbsDown, Star, ChevronLeft, Wrench, User } from 'lucide-react';
import api from '../../services/api';

const WriteReview = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    rating: 0,
    comment: '',
    wouldRecommend: true
  });

  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    fetchJob();
  }, [jobId]);

  const fetchJob = async () => {
    try {
      const response = await api.get(`/ jobs / ${jobId} `);
      setJob(response.data.data);
    } catch (error) {
      console.error('Failed to fetch job:', error);
      setError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (formData.comment.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await api.post('/reviews', {
        jobId: jobId,
        rating: formData.rating,
        comment: formData.comment,
        wouldRecommend: formData.wouldRecommend
      });

      setSuccess(true);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/customer/history');
      }, 2000);
    } catch (error) {
      console.error('Failed to submit review:', error);
      setError(error.response?.data?.error || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingLabels = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="mb-4 text-yellow-400">
          <PartyPopper size={64} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
        <p className="text-gray-400 mb-6">Your review has been submitted successfully.</p>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-500 text-sm mt-4">Redirecting...</p>
      </div>
    );
  }

  if (!job || !job.worker) {
    return (
      <div className="max-w-lg mx-auto text-center py-12">
        <div className="mb-4 text-red-500">
          <X size={64} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Cannot Review</h2>
        <p className="text-gray-400 mb-6">This job cannot be reviewed.</p>
        <Link to="/customer/history" className="btn-accent">
          Back to Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/customer/history" className="text-gray-400 hover:text-white text-sm mb-4 inline-block">
          <span className="flex items-center gap-2"><ChevronLeft size={20} /> Back to Bookings</span>
        </Link>
        <h1 className="text-3xl font-bold text-white">Write a Review</h1>
        <p className="text-gray-400 mt-2">Share your experience with the service</p>
      </div>

      {/* Job Info Card */}
      <div className="panel-card p-6 mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Service Details</h3>
        <div className="flex items-start space-x-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-3xl">
            <Wrench size={40} />
          </div>
          <div className="flex-1">
            <h4 className="text-white font-medium">{job.title}</h4>
            <p className="text-gray-400 text-sm mt-1">{job.description}</p>
            <p className="text-gray-500 text-sm mt-2">
              {new Date(job.scheduledDate).toLocaleDateString('en-IN', {
                weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
              })}
            </p>
          </div>
        </div>

        {/* Worker Info */}
        <div className="mt-6 p-4 bg-gray-800/50 rounded-lg flex items-center space-x-4">
          <div className="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
            {job.worker.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-medium text-lg">{job.worker.name}</p>
            <p className="text-gray-400 text-sm">Service Provider</p>
            {job.worker.averageRating > 0 && (
              <p className="text-yellow-400 text-sm mt-1">
                <span className="flex items-center gap-1"><Star size={14} fill="currentColor" /> {job.worker.averageRating.toFixed(1)} ({job.worker.totalReviews} reviews)</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {/* Review Form */}
      <form onSubmit={handleSubmit} className="panel-card p-6">
        {/* Star Rating */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-4">
            How was your experience? *
          </label>
          <div className="flex items-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                onClick={() => setFormData({ ...formData, rating: star })}
                className="text-5xl transition-transform hover:scale-110 focus:outline-none"
              >
                {star <= (hoveredRating || formData.rating) ? <Star size={40} fill="currentColor" className="text-yellow-400" /> : <Star size={40} className="text-gray-600" />}
              </button>
            ))}
          </div>
          {(hoveredRating || formData.rating) > 0 && (
            <p className="text-purple-400 mt-2 font-medium">
              {ratingLabels[hoveredRating || formData.rating]}
            </p>
          )}
        </div>

        {/* Comment */}
        <div className="mb-6">
          <label className="block text-lg font-semibold text-white mb-2">
            Your Review *
          </label>
          <p className="text-gray-400 text-sm mb-3">
            Tell others about your experience. What did you like? What could be improved?
          </p>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={5}
            className="input resize-none"
            placeholder="Write your review here... (minimum 10 characters)"
            required
          />
          <p className="text-gray-500 text-sm mt-1">
            {formData.comment.length} / 500 characters
          </p>
        </div>

        {/* Would Recommend */}
        <div className="mb-8">
          <label className="block text-lg font-semibold text-white mb-3">
            Would you recommend this service provider?
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, wouldRecommend: true })}
              className={`flex - 1 p - 4 rounded - xl border - 2 transition ${formData.wouldRecommend
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
                } `}
            >
              <div className="mb-1 text-green-400">
                <ThumbsUp size={32} />
              </div>
              <div className="font-medium">Yes, definitely!</div>
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, wouldRecommend: false })}
              className={`flex - 1 p - 4 rounded - xl border - 2 transition ${!formData.wouldRecommend
                  ? 'border-red-500 bg-red-500/10 text-red-400'
                  : 'border-gray-700 text-gray-400 hover:border-gray-600'
                } `}
            >
              <div className="mb-1 text-red-400">
                <ThumbsDown size={32} />
              </div>
              <div className="font-medium">Not really</div>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={submitting || formData.rating === 0}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {submitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
              Submitting...
            </>
          ) : (
            <>
              Submit Review
              <Star size={20} className="ml-2" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default WriteReview;