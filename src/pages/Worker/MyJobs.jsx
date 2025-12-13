// frontend/src/pages/Worker/MyJobs.jsx
import { useEffect, useState } from 'react';
import { useWorker } from '../../context/WorkerContext';

const MyJobs = () => {
  const { myJobs, loading, loadJobs, updateJobStatus } = useWorker();
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [expandedJob, setExpandedJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);

  const handleStatusUpdate = async (jobId, newStatus) => {
    setUpdatingId(jobId);
    await updateJobStatus(jobId, newStatus);
    setUpdatingId(null);
  };

  const filteredJobs = myJobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'active') return ['accepted', 'in_progress'].includes(job.status);
    return job.status === filter;
  });

  const getStatusBadge = (status) => {
    const styles = {
      accepted: 'bg-blue-500/20 text-blue-400',
      in_progress: 'bg-yellow-500/20 text-yellow-400',
      completed: 'bg-green-500/20 text-green-400',
      cancelled: 'bg-red-500/20 text-red-400'
    };
    return styles[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: '🔧',
      electrical: '⚡',
      cleaning: '🧹',
      painting: '🎨',
      carpentry: '🪚',
      appliance: '🔌',
      other: '📦'
    };
    return icons[category] || '📦';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const openInMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  const openDirections = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`, '_blank');
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Jobs</h1>
        <p className="text-gray-400 mt-2">Manage your accepted jobs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-blue-400">
            {myJobs.filter(j => j.status === 'accepted').length}
          </p>
          <p className="text-gray-500 text-sm">Accepted</p>
        </div>
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">
            {myJobs.filter(j => j.status === 'in_progress').length}
          </p>
          <p className="text-gray-500 text-sm">In Progress</p>
        </div>
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {myJobs.filter(j => j.status === 'completed').length}
          </p>
          <p className="text-gray-500 text-sm">Completed</p>
        </div>
        <div className="panel-card p-4 text-center">
          <p className="text-2xl font-bold text-white">{myJobs.length}</p>
          <p className="text-gray-500 text-sm">Total</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['all', 'active', 'accepted', 'in_progress', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
              filter === f
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            {f.replace('_', ' ').charAt(0).toUpperCase() + f.replace('_', ' ').slice(1)}
          </button>
        ))}
      </div>

      {/* Jobs */}
      {filteredJobs.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white">No Jobs Found</h3>
          <p className="text-gray-400 mt-2">Accept some jobs to see them here</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job._id} className="panel-card p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                    <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                      {job.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <p className="text-gray-400 mb-4">{job.description}</p>

                  {/* Location Card with Map Actions */}
                  <div className="p-4 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <span className="text-xl">📍</span>
                        </div>
                        <div>
                          <p className="text-white font-medium">Service Location</p>
                          <p className="text-gray-300 text-sm mt-1">{job.location?.address}</p>
                          {job.location?.city && (
                            <p className="text-gray-500 text-sm">{job.location.city}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button
                          onClick={() => openDirections(job.location?.address)}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition flex items-center"
                        >
                          🧭 Directions
                        </button>
                        <button
                          onClick={() => openInMaps(job.location?.address)}
                          className="px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg text-sm transition"
                        >
                          View Map
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                    <span>📅 {formatDate(job.scheduledDate)}</span>
                    {job.timeSlot?.time && <span>🕐 {formatTime(job.timeSlot.time)}</span>}
                    <span className="capitalize">🏷️ {job.category}</span>
                  </div>

                  {/* Customer Info */}
                  {job.customer && (
                    <div className="mt-4 p-3 bg-gray-800/50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                          {job.customer.name?.charAt(0).toUpperCase() || 'C'}
                        </div>
                        <div>
                          <p className="text-white font-medium">{job.customer.name}</p>
                          <p className="text-gray-500 text-sm">{job.customer.email}</p>
                        </div>
                      </div>
                      {job.customer.phone && (
                        <a
                          href={`tel:${job.customer.phone}`}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition flex items-center"
                        >
                          📞 Call
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Price & Actions */}
                <div className="ml-6 flex flex-col items-end space-y-3">
                  {job.estimatedPrice > 0 && (
                    <p className="text-2xl font-bold gradient-text">₹{job.estimatedPrice}</p>
                  )}
                  
                  {job.status === 'accepted' && (
                    <button
                      onClick={() => handleStatusUpdate(job._id, 'in_progress')}
                      disabled={updatingId === job._id}
                      className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg text-sm transition"
                    >
                      {updatingId === job._id ? '...' : '▶️ Start Work'}
                    </button>
                  )}
                  
                  {job.status === 'in_progress' && (
                    <button
                      onClick={() => handleStatusUpdate(job._id, 'completed')}
                      disabled={updatingId === job._id}
                      className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg text-sm transition"
                    >
                      {updatingId === job._id ? '...' : '✅ Complete'}
                    </button>
                  )}
                  
                  {job.status === 'completed' && (
                    <span className="text-green-400 text-sm font-medium">✓ Completed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;