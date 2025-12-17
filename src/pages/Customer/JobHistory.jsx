// frontend/src/pages/Customer/JobHistory.jsx
import { useState, useEffect } from 'react';
import {
  Calendar, MapPin, Clock, CheckCircle, XCircle, AlertTriangle, ChevronRight, Star,
  Wrench, Zap, SprayCan, Paintbrush, Hammer, Plug, Snowflake, Bug, Scissors, Truck,
  Package, X, Check, Phone, ClipboardList, RefreshCw, RefreshCcw, User, Tool
} from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
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
      plumbing: <Wrench size={20} />,
      electrical: <Zap size={20} />,
      cleaning: <SprayCan size={20} />,
      painting: <Paintbrush size={20} />,
      carpentry: <Hammer size={20} />,
      appliance: <Plug size={20} />,
      'ac-service': <Snowflake size={20} />,
      'pest-control': <Bug size={20} />,
      salon: <Scissors size={20} />,
      'men-grooming': <Scissors size={20} />,
      movers: <Truck size={20} />,
      other: <Package size={20} />
    };
    return icons[category] || <Package size={20} />;
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
              <X size={24} />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6">

            {/* Status & Price Banner */}
            <div className="flex flex-wrap gap-3 items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex items-center gap-3">
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold border ${getStatusBadge(job.status).replace('bg-', 'border-').replace('/20', '')}`}>
                  {job.status?.toUpperCase().replace('_', ' ')}
                </span>
                <div className="h-5 w-px bg-white/10"></div>
                <div className="flex items-center gap-2 text-gray-300 text-sm">
                  <span className="flex items-center gap-1"><Clock size={15} /> Scheduled:</span>
                  <span className="text-white font-medium">{formatDate(job.scheduledDate)}</span>
                  {job.timeSlot?.time && <span className="text-purple-400">({job.timeSlot.time})</span>}
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Estimated Price</p>
                <p className="text-xl font-bold gradient-text">₹{job.estimatedPrice || 0}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2"><ClipboardList size={18} /> Description</h3>
              <p className="text-gray-300 bg-black/20 p-3 rounded-lg border border-white/5 leading-relaxed text-sm">
                {job.description || 'No description provided.'}
              </p>
            </div>

            {/* People Involved */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Customer (Self) */}
              <div className="panel-card p-4 border border-blue-500/20 bg-blue-500/5">
                <h3 className="text-blue-400 font-bold mb-2 flex items-center gap-2 text-sm">
                  <User size={16} /> My Details
                </h3>
                <div className="space-y-1 text-sm">
                  <p><span className="text-gray-500 block text-xs">Notes for Worker</span> <span className="text-white">{job.customerNotes || 'None'}</span></p>
                </div>
              </div>

              {/* Worker */}
              <div className="panel-card p-4 border border-purple-500/20 bg-purple-500/5">
                <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2 text-sm">
                  <Wrench size={16} /> Worker Details
                </h3>
                {job.worker ? (
                  <div className="space-y-1 text-sm">
                    <p><span className="text-gray-500 block text-xs">Name</span> <span className="text-white font-medium">{job.worker.name}</span></p>
                    <p><span className="text-gray-500 block text-xs">Phone</span> <span className="text-white font-mono">{job.worker.phone || 'N/A'}</span></p>
                    <a href={`tel:${job.worker.phone}`} className="inline-block mt-1 text-purple-400 hover:underline flex items-center gap-1 text-xs"><Phone size={12} /> Call Worker</a>
                  </div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-60">
                    <Clock className="text-gray-400 mb-1" size={24} />
                    <p className="text-xs">No worker assigned</p>
                  </div>
                )}
              </div>
            </div>

            {/* Location */}
            <div>
              <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2"><MapPin size={18} /> Service Location</h3>
              <div className="bg-gray-800 p-3 rounded-xl border border-gray-700 flex justify-between items-start gap-4">
                <div>
                  <p className="text-white">{job.location?.address}</p>
                  {job.location?.city && <p className="text-gray-400 text-sm">{job.location.city}</p>}
                </div>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(job.location?.address || '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary whitespace-nowrap py-1.5 px-3 text-xs"
                >
                  <span className="flex items-center gap-1.5"><MapPin size={14} /> Open Map</span>
                </a>
              </div>
            </div>

            {/* Review If Exists */}
            {job.review && (
              <div>
                <h3 className="text-base font-semibold text-white mb-2 flex items-center gap-2"><Star size={18} /> Your Review</h3>
                <div className="bg-green-500/10 border border-green-500/20 p-3 rounded-xl">
                  <div className="flex text-yellow-400 mb-1">
                    {Array(job.review.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="currentColor" className="text-yellow-400" />)}
                  </div>
                  <p className="text-gray-300 italic text-sm">"{job.review.comment}"</p>
                  <p className="text-xs text-gray-500 mt-1">Submitted on {new Date(job.review.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            )}

            {/* Footer Actions */}
            <div className="flex justify-end pt-3 border-t border-white/10 gap-3">
              <button onClick={onClose} className="btn-secondary py-1.5 px-4 text-sm">Close</button>
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
          <p className="text-gray-500 text-sm flex items-center gap-1">Needs Review <Star size={12} /></p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { key: 'all', label: 'All' },
          { key: 'needsReview', label: 'Needs Review', icon: <Star size={16} /> },
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
          <RefreshCcw size={16} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <div className="flex justify-center mb-4">
            {filter === 'needsReview' ? <Star size={64} className="text-yellow-500" /> : <ClipboardList size={64} className="text-gray-600" />}
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
              className="panel-card p-5 hover:bg-white/5 transition cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start space-x-4">
                <div className="p-2 bg-gray-700/50 rounded-lg shrink-0">
                  <CheckCircle className="text-white" size={20} />
                </div>

                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        {job.category.charAt(0).toUpperCase() + job.category.slice(1)} Service
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getStatusBadge(job.status)}`}>
                          {job.status.toUpperCase()}
                        </span>
                      </h3>
                      <p className="text-gray-400 text-sm mt-0.5 truncate">{job.title}</p>
                    </div>

                    <div className="text-right shrink-0 ml-4">
                      {job.estimatedPrice > 0 && (
                        <div className="mb-2">
                          <p className="text-xl font-bold gradient-text">₹{job.estimatedPrice}</p>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex flex-col gap-2 items-end">
                        {job.status === 'pending' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); handleCancelJob(job._id); }}
                            className="px-3 py-1.5 border border-red-500/50 text-red-400 hover:bg-red-500/10 rounded-lg text-xs transition"
                          >
                            Cancel
                          </button>
                        )}

                        {canReview(job) && (
                          <Link
                            to={`/customer/review/${job._id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 transition flex items-center"
                          >
                            <Star size={16} className="mr-1.5" fill="currentColor" />
                            Rate & Review
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-6 gap-y-2 mt-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <Calendar size={14} className="mr-1.5 text-gray-500" />
                      {new Date(job.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock size={14} className="mr-1.5 text-gray-500" />
                      {job.timeSlot?.time || 'Unscheduled'}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-1.5 text-gray-500" />
                      <span className="truncate max-w-[200px]">{job.location.address.split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Worker Info - Compact */}
                  {job.worker && (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold">
                        {job.worker.name.charAt(0)}
                      </div>
                      <p className="text-gray-300 text-sm flex items-center gap-2">
                        {job.worker.name}
                        {job.status === 'in_progress' && (
                          <button onClick={(e) => e.stopPropagation()} className="text-green-400 hover:text-green-300">
                            <Phone size={14} />
                          </button>
                        )}
                      </p>
                    </div>
                  )}

                  {/* Compact Review Display */}
                  {job.status === 'completed' && job.review && (
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-start gap-3">
                      <div className="flex text-yellow-400 shrink-0 mt-0.5">
                        <span className="font-bold text-sm mr-1">{job.review.rating}</span>
                        <Star size={14} fill="currentColor" />
                      </div>
                      <p className="text-gray-400 text-sm italic line-clamp-1">"{job.review.comment}"</p>
                    </div>
                  )}

                  {job.status === 'cancelled' && (
                    <p className="mt-2 text-red-400 text-xs flex items-center gap-1">
                      <X size={14} /> Cancelled
                    </p>
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