// frontend/src/pages/Admin/Jobs.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState(null);
  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch jobs function
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/jobs');
      console.log('Admin Jobs response:', response.data);
      setJobs(response.data.data || response.data || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  // Update job status
  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { status: newStatus });
      fetchJobs(); // Refresh
    } catch (error) {
      console.error('Failed to update status:', error);
      alert(error.response?.data?.error || 'Failed to update status');
    }
  };

  // Delete job
  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      fetchJobs(); // Refresh
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert(error.response?.data?.error || 'Failed to delete job');
    }
  };

  // Filter logic
  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Status badge styles
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

  // Category icons
  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: '🔧',
      electrical: '⚡',
      cleaning: '🧹',
      painting: '🎨',
      carpentry: '🪚',
      appliance: '🔌',
      'ac-service': '❄️',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  // Format date
  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Loading state
  const LoadingView = () => (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto"></div>
        <p className="text-gray-400 mt-4">Loading jobs...</p>
      </div>
    </div>
  );

  if (loading) return <LoadingView />;




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
              {/* Customer */}
              <div className="panel-card p-5 border border-blue-500/20 bg-blue-500/5">
                <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
                  👤 Customer Details
                </h3>
                <div className="space-y-2 text-sm">
                  <p><span className="text-gray-500 block">Name</span> <span className="text-white text-lg">{job.customer?.name}</span></p>
                  <p><span className="text-gray-500 block">Email</span> <span className="text-white">{job.customer?.email}</span></p>
                  <p><span className="text-gray-500 block">Phone</span> <span className="text-white font-mono">{job.customer?.phone || 'N/A'}</span></p>
                  <a href={`tel:${job.customer?.phone}`} className="inline-block mt-2 text-blue-400 hover:underline">📞 Call Customer</a>
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

            {/* Timestamps */}
            <div className="text-xs text-gray-500 border-t border-white/5 pt-4 flex justify-between">
              <span>Created: {new Date(job.createdAt).toLocaleString()}</span>
              <span>Last Updated: {new Date(job.updatedAt).toLocaleString()}</span>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Jobs Management</h1>
          <p className="text-gray-400 mt-2">View and manage all service jobs</p>
        </div>
        <button onClick={fetchJobs} className="btn-secondary flex items-center">
          <span className="mr-2">🔄</span>
          Refresh
        </button>
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
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-red-400">
            {jobs.filter(j => j.status === 'cancelled').length}
          </p>
          <p className="text-gray-500 text-sm">Cancelled</p>
        </div>
      </div>

      {/* Filters */}
      <div className="panel-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search jobs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input flex-1"
          />
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filter === f
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
              >
                {f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Jobs Found</h3>
          <p className="text-gray-400">No jobs match your current filters.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job._id}
              className="panel-card p-6 hover:border-white/20 transition cursor-pointer group"
              onClick={() => setSelectedJob(job)}
            >
              <div className="flex items-start justify-between">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">{job.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadge(job.status)}`}>
                      {(job.status || 'pending').replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-3 line-clamp-2">{job.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Customer:</span>
                      <p className="text-white">{job.customer?.name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Worker:</span>
                      <p className="text-white">{job.worker?.name || 'Not assigned'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date:</span>
                      <p className="text-white">{formatDate(job.scheduledDate)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Location:</span>
                      <p className="text-white truncate">{job.location?.address || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="ml-4 flex flex-col items-end space-y-2" onClick={(e) => e.stopPropagation()}>
                  <p className="text-xl font-bold gradient-text">₹{job.estimatedPrice || 0}</p>

                  <select
                    value={job.status || 'pending'}
                    onChange={(e) => handleStatusChange(job._id, e.target.value)}
                    className="bg-gray-800 text-white text-sm rounded-lg px-3 py-2 border border-gray-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    🗑️ Delete
                  </button>

                  <button
                    onClick={(e) => { e.stopPropagation(); setSelectedJob(job); }}
                    className="text-blue-400 hover:text-blue-300 text-sm mt-2"
                  >
                    👁️ View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Count */}
      <p className="mt-4 text-gray-400 text-sm">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </p>

      {/* Render Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </div>
  );
};

export default Jobs;