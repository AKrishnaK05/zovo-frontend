// frontend/src/pages/Customer/JobHistory.jsx
import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../services/api';

const JobHistory = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedJob, setSelectedJob] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check URL for filter param
    const urlFilter = searchParams.get('filter');
    if (urlFilter) {
      setFilter(urlFilter);
    }
    fetchJobs();
  }, [searchParams]);

  const fetchJobs = async () => {
    try {
      const response = await api.get('/jobs');
      console.log('Jobs fetched:', response.data);
      setJobs(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  // Check if job can be reviewed
  const canReview = (job) => {
    return job.status === 'completed' && job.worker && !job.hasReview;
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'needsReview') return canReview(job);
    return job.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-500/20 text-yellow-400',
      accepted: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-purple-500/20 text-purple-400',
      completed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400'
    };
    return styles[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: '🔧', electrical: '⚡', cleaning: '🧹', painting: '🎨',
      carpentry: '🪚', appliance: '🔌', 'ac-service': '❄️', 'pest-control': '🦟',
      salon: '💇‍♀️', 'men-grooming': '💇‍♂️', movers: '🚚', other: '📦'
    };
    return icons[category] || '📦';
  };

  const formatDate = (date) => {
    if (!date) return 'No date';
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  // Count jobs needing review
  const reviewCount = jobs.filter(canReview).length;

  // Handle Cancellation
  const handleCancelJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;

    try {
      await api.put(`/jobs/${jobId}/cancel`);

      // Update local state to reflect cancellation
      setJobs(prevJobs =>
        prevJobs.map(job =>
          job._id === jobId ? { ...job, status: 'cancelled' } : job
        )
      );
    } catch (error) {
      console.error('Failed to cancel job:', error);
      alert(error.response?.data?.error || 'Failed to cancel job');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your bookings...</p>
        </div>
      </div>
    );
  }

  // Job Details Modal Component
  const JobDetailsModal = ({ job, onClose }) => {
    if (!job) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-[#2d2d2d] w-full max-w-3xl rounded-2xl shadow-2xl border border-white/10 max-h-[90vh] overflow-y-auto custom-scrollbar">

          {/* Modal Header */}
          <div className="p-6 border-b border-white/10 flex justify-between items-start sticky top-0 bg-[#2d2d2d] z-10">
            <div>
              <div className="flex items-center gap-3">
                <span className="text-3xl">{getCategoryIcon(job.category)}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white">{job.title}</h2>
                  <p className="text-gray-400 text-sm">ID: {job._id}</p>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-8 space-y-8">

            {/* Status & Price Banner */}
            <div className="flex flex-wrap gap-4 items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold border ${getStatusBadge(job.status).replace('bg-', 'border-').replace('/20', '')}`}>
                  {job.status?.toUpperCase().replace('_', ' ')}
                </span>
                <div className="h-6 w-px bg-white/10"></div>
                <div className="flex items-center gap-2 text-gray-300">
                  <span>📅 Scheduled:</span>
                  <span className="text-white font-medium">{formatDate(job.scheduledDate)}</span>
                  {job.timeSlot?.time && <span className="text-purple-400">({job.timeSlot.time})</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Estimated Price</p>
                <p className="text-2xl font-bold gradient-text">₹{job.estimatedPrice || 0}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">📝 Description</h3>
              <p className="text-gray-300 bg-black/20 p-4 rounded-lg border border-white/5 leading-relaxed">
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* People Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Customer (Self) */}
              <div className="panel-card p-5 border border-blue-500/20 bg-blue-500/5">
                <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  👤 My Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 block">Notes for Worker</span> <span className="text-white">{job.customerNotes || 'None'}</span></p>
                </div>
              </div>

              {/* Worker */}
              <div className="panel-card p-5 border border-purple-500/20 bg-purple-500/5">
                <h3 className="text-purple-400 font-bold mb-3 flex items-center gap-2">
                  🔧 Worker Details
                </h3>
                {job.worker ? (
                  <div className="space-y-2 text-sm">
                    <p><span className="text-gray-500 block">Name</span> <span className="text-white text-lg">{job.worker.name}</span></p>
                    <p><span className="text-gray-500 block">Email</span> <span className="text-white">{job.worker.email}</span></p>
                    <p><span className="text-gray-500 block">Phone</span> <span className="text-white font-mono">{job.worker.phone || 'N/A'}</span></p>
                    <a href={`tel:${job.worker.phone}`} className="inline-block mt-2 text-purple-400 hover:underline">📞 Call Worker</a>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                    <span className="text-4xl mb-2">⏳</span>
                    <p>No worker assigned yet</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">📍 Service Location</h3>
              <div className="bg-gray-800 p-4 rounded-xl border border-gray-700 flex justify-between items-start gap-4">
                <div>
                  <p className="text-white text-lg">{job.location?.address}</p>
                  {job.location?.city && <p className="text-gray-400">{job.location.city}</p>}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location?.address || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary whitespace-nowrap"
                >
                  🗺️ Open Map
                </a>
              </div>
            </div>

            {/* Review If Exists */}
            {job.review && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">⭐ Your Review</h3>
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
                  <div className="flex text-yellow-400 mb-2">
                    {Array(job.review.rating).fill('⭐').join('')}
                  </div>
                  <p className="text-gray-300 italic">"{job.review.comment}"</p>
                  <p className="text-xs text-gray-500 mt-2">Submitted on {new Date(job.review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end pt-4 border-t border-white/10 gap-3">
              <button onClick={onClose} className="btn-secondary">Close</button>
              {/* Can add more actions like 'Cancel' later if needed */}
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Bookings</h1>
        <p className="text-gray-400 mt-2">View and manage all your service requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-white">{jobs.length}</p>
          <p className="text-gray-500 text-sm">Total</p>
        </div>
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {jobs.filter(j => j.status === 'pending').length}
          </p>
          <p className="text-gray-500 text-sm">Pending</p>
        </div>
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {jobs.filter(j => j.status === 'accepted').length}
          </p>
          <p className="text-gray-500 text-sm">Accepted</p>
        </div>
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-purple-400">
            {jobs.filter(j => j.status === 'in_progress').length}
          </p>
          <p className="text-gray-500 text-sm">In Progress</p>
        </div>
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {jobs.filter(j => j.status === 'completed').length}
          </p>
          <p className="text-gray-500 text-sm">Completed</p>
        </div>
        {/* Review Needed Count */}
        <div
          className={`panel-card p-4 text-center cursor-pointer transition ${filter === 'needsReview' ? 'ring-2 ring-yellow-500' : ''
            }`}
          onClick={() => setFilter('needsReview')}
        >
          <p className="text-2xl font-bold text-yellow-400">{reviewCount}</p>
          <p className="text-gray-500 text-sm">Needs Review ⭐</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'needsReview', label: '⭐ Needs Review' },
          { key: 'pending', label: 'Pending' },
          { key: 'accepted', label: 'Accepted' },
          { key: 'in_progress', label: 'In Progress' },
          { key: 'completed', label: 'Completed' },
          { key: 'cancelled', label: 'Cancelled' }
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f.key
              ? f.key === 'needsReview'
                ? 'bg-yellow-500 text-black'
                : 'bg-purple-500 text-white'
              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
          >
            {f.label}
            {f.key === 'needsReview' && reviewCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-black/20 rounded-full text-xs">
                {reviewCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Refresh */}
      <div className="mb-6">
        <button
          onClick={() => { setLoading(true); fetchJobs(); }}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center"
        >
          <span className="mr-2">🔄</span>
          Refresh
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <div className="text-6xl mb-4">
            {filter === 'needsReview' ? '⭐' : '📋'}
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {filter === 'needsReview' ? 'All Caught Up!' : 'No Bookings Found'}
          </h3>
          <p className="text-gray-400 mb-6">
            {filter === 'needsReview'
              ? "You've reviewed all your completed jobs."
              : filter === 'all'
                ? "You haven't made any bookings yet."
                : `No ${filter.replace('_', ' ')} bookings found.`}
          </p>
          {filter === 'all' && (
            <Link to="/customer/home" className="btn-accent inline-block">
              Browse Services
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="panel-card p-6 hover:bg-white/5 transition cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                      {(job.status || 'pending').replace('_', ' ').toUpperCase()}
                    </span>
                    {canReview(job) && (
                      <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-medium animate-pulse">
                        ⭐ Review Pending
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 text-sm mb-3">{job.description}</p>

                  {/* Details */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <span className="mr-1">📅</span>
                      {formatDate(job.scheduledDate)}
                    </span>
                    {job.timeSlot?.time && (
                      <span className="flex items-center">
                        <span className="mr-1">🕐</span>
                        {job.timeSlot.time}
                      </span>
                    )}
                    <span className="flex items-center">
                      <span className="mr-1">📍</span>
                      {job.location?.address || 'No address'}
                    </span>
                  </div>

                  {/* Worker Info */}
                  {job.worker && (
                    <div className="mt-4 flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold">
                        {job.worker.name?.charAt(0).toUpperCase() || 'W'}
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">{job.worker.name}</p>
                        <p className="text-gray-500 text-sm">Service Provider</p>
                      </div>
                      <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                        {job.worker.phone && (
                          <a
                            href={`tel:${job.worker.phone}`}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition"
                          >
                            📞 Call
                          </a>
                        )}
                        {/* ⭐ Review Button for Worker */}
                        {canReview(job) && (
                          <Link
                            to={`/customer/review/${job._id}`}
                            className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-medium rounded-lg text-sm transition flex items-center"
                          >
                            ⭐ Write Review
                          </Link>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Price & Actions */}
                <div className="ml-6 text-right flex flex-col items-end space-y-3">
                  {job.estimatedPrice > 0 && (
                    <div>
                      <p className="text-gray-500 text-sm">Price</p>
                      <p className="text-2xl font-bold gradient-text">₹{job.estimatedPrice}</p>
                    </div>
                  )}

                  {/* Cancel Button (Pending Only) */}
                  {job.status === 'pending' && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCancelJob(job._id); }}
                      className="px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-sm transition"
                    >
                      Cancel Request
                    </button>
                  )}

                  {/* Big Review Button for completed jobs */}
                  {canReview(job) && (
                    <Link
                      to={`/customer/review/${job._id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition flex items-center"
                    >
                      <span className="text-xl mr-2">⭐</span>
                      Rate & Review
                    </Link>
                  )}

                  {/* Show Review if exists */}
                  {job.status === 'completed' && job.review && (
                    <div className="mt-2 text-left bg-green-500/10 border border-green-500/20 p-3 rounded-xl w-full">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-green-400 text-xs font-bold uppercase tracking-wider">Your Review</span>
                        <div className="flex text-yellow-400 text-sm">
                          {Array(job.review.rating).fill('⭐').join('')}
                        </div>
                      </div>
                      <p className="text-gray-300 text-sm italic">"{job.review.comment}"</p>
                    </div>
                  )}

                  {/* Show if cancelled */}
                  {job.status === 'cancelled' && (
                    <div className="flex items-center text-red-400 text-sm">
                      <span className="mr-1">⨯</span>
                      Cancelled
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default JobHistory;