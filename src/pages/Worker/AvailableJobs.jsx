// frontend/src/pages/Worker/AvailableJobs.jsx
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MapPin, Calendar, Clock, User, Phone, Check,
  Wrench, Zap, SprayCan, Paintbrush, Hammer, Plug, Package,
  Inbox, Loader2
} from 'lucide-react';
import { useWorker } from '../../context/WorkerContext';

const AvailableJobs = () => {
  const { availableJobs, loading, error, loadJobs, acceptJob, rejectJob } = useWorker();
  const location = useLocation();
  const [acceptingId, setAcceptingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [selectedJob, setSelectedJob] = useState(null);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    // Check for passed state to highlight a job (from Dashboard click)
    if (location.state?.highlightJobId && availableJobs.length > 0) {
      const jobToHighlight = availableJobs.find(j => j._id === location.state.highlightJobId);
      if (jobToHighlight) {
        setSelectedJob(jobToHighlight);
        // Optional: Scroll to it? Browser might handle it, or we can add ref logic later.
        // For now, auto-expanding details is great UX.

        // Clear state so refresh doesn't keep re-opening
        window.history.replaceState({}, document.title);
      }
    }
  }, [availableJobs, location.state]);

  useEffect(() => {
    loadJobs();
  }, [loadJobs]);
  const handleAccept = async (jobId) => {
    setAcceptingId(jobId);
    setMessage({ type: '', text: '' });

    const result = await acceptJob(jobId);

    if (result.success) {
      setMessage({ type: 'success', text: 'Job accepted successfully!' });
      setSelectedJob(null);
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setAcceptingId(null);
  };

  const handleReject = async (jobId) => {
    if (!window.confirm('Are you sure you want to decline this job? It will be offered to another worker.')) {
      return;
    }

    setRejectingId(jobId);
    setMessage({ type: '', text: '' });

    const result = await rejectJob(jobId);

    if (result.success) {
      setMessage({ type: 'success', text: 'Job declined.' });
      if (selectedJob?._id === jobId) setSelectedJob(null);
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setRejectingId(null);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: <Wrench size={20} />,
      electrical: <Zap size={20} />,
      cleaning: <SprayCan size={20} />,
      painting: <Paintbrush size={20} />,
      carpentry: <Hammer size={20} />,
      appliance: <Plug size={20} />,
      other: <Package size={20} />
    };
    return icons[category] || <Package size={20} />;
  };

  const openInMaps = (address) => {
    const encodedAddress = encodeURIComponent(address);
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Available Jobs</h1>
        <p className="text-gray-400 mt-2">
          Jobs matching your service categories
        </p>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
          ? 'bg-green-500/10 border border-green-500/20 text-green-400'
          : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
          {message.text}
        </div>
      )}

      {/* Jobs List */}
      {loading ? (
        <div className="panel-card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading available jobs...</p>
        </div>
      ) : error ? (
        <div className="panel-card p-12 text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={loadJobs} className="mt-4 text-cyan-400 hover:text-cyan-300 font-medium">
            Try again
          </button>
        </div>
      ) : availableJobs.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <div className="flex justify-center mb-4">
            <Inbox size={64} className="text-gray-600" />
          </div>
          <h3 className="text-xl font-medium text-white">No jobs available</h3>
          <p className="text-gray-400 mt-2">Check back later or update your service categories</p>
        </div>
      ) : (
        <div className="space-y-4">
          {availableJobs.map((job) => (
            <div key={job._id} className="panel-card p-6 hover:bg-white/5 transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Title & Category */}
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="text-purple-400">{getCategoryIcon(job.category)}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{job.title}</h3>
                      <span className="text-sm text-purple-400 capitalize">{job.category}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-400 mt-2 mb-4">{job.description}</p>

                  {/* Location - WITH MAP LINK */}
                  <div className="p-4 bg-gray-800/50 rounded-lg mb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <MapPin className="text-blue-400 mt-1" size={20} />
                        <div>
                          <p className="text-white font-medium">Service Location</p>
                          <p className="text-gray-400 text-sm mt-1">{job.location?.address || 'Address not provided'}</p>
                          {job.location?.city && (
                            <p className="text-gray-500 text-sm">{job.location.city}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => openInMaps(job.location?.address)}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition flex items-center text-sm"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        Open in Maps
                      </button>
                    </div>
                  </div>

                  {/* Date, Time & Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="mr-2 text-purple-400" size={16} />
                      <span>{formatDate(job.scheduledDate)}</span>
                    </div>
                    {job.timeSlot?.time && (
                      <div className="flex items-center text-gray-400">
                        <Clock className="mr-2 text-purple-400" size={16} />
                        <span>{formatTime(job.timeSlot.time)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-gray-400">
                      <User className="mr-2 text-purple-400" size={16} />
                      <span>{job.customer?.name || 'Customer'}</span>
                    </div>
                  </div>

                  {/* Customer Contact */}
                  {job.customer?.phone && (
                    <div className="mt-4 p-3 bg-cyan-500/10 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone size={16} className="text-cyan-400" />
                        <span className="text-cyan-400">{job.customer.phone}</span>
                      </div>
                      <a
                        href={`tel:${job.customer.phone}`}
                        className="text-sm text-cyan-400 hover:text-cyan-300"
                      >
                        Call Customer
                      </a>
                    </div>
                  )}
                </div>

                {/* Price & Accept Button */}
                <div className="text-right ml-6 flex flex-col items-end">
                  {job.estimatedPrice > 0 && (
                    <div className="mb-4">
                      <p className="text-gray-500 text-sm">Estimated</p>
                      <p className="text-2xl font-bold gradient-text">₹{job.estimatedPrice}</p>
                    </div>
                  )}
                  <button
                    onClick={() => handleAccept(job._id)}
                    disabled={acceptingId === job._id}
                    className="btn-accent flex items-center px-6 py-3"
                  >
                    {acceptingId === job._id ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Accepting...
                      </>
                    ) : (
                      <>
                        <Check size={18} className="mr-2" />
                        Accept Job
                      </>
                    )}
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleReject(job._id)}
                    disabled={acceptingId === job._id || rejectingId === job._id}
                    className="mt-2 w-full px-6 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-xl transition font-medium text-sm"
                  >
                    {rejectingId === job._id ? 'Declining...' : 'Decline Offer'}
                  </button>

                  {/* View Details */}
                  <button
                    onClick={() => setSelectedJob(selectedJob?._id === job._id ? null : job)}
                    className="mt-2 text-sm text-gray-400 hover:text-white"
                  >
                    {selectedJob?._id === job._id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Expanded Details */}
              {selectedJob?._id === job._id && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Full Location Details */}
                    <div>
                      <h4 className="text-white font-medium mb-3">📍 Full Address</h4>
                      <div className="p-4 bg-gray-800 rounded-lg">
                        <p className="text-gray-300">{job.location?.address}</p>
                        {job.location?.city && <p className="text-gray-500 mt-1">City: {job.location.city}</p>}
                        {job.location?.coordinates?.lat && (
                          <p className="text-gray-500 text-sm mt-2">
                            Coordinates: {job.location.coordinates.lat.toFixed(4)}, {job.location.coordinates.lng.toFixed(4)}
                          </p>
                        )}
                        <button
                          onClick={() => openInMaps(job.location?.address)}
                          className="mt-3 w-full py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Get Directions
                        </button>
                      </div>
                    </div>

                    {/* Customer Details */}
                    <div>
                      <h4 className="text-white font-medium mb-3">👤 Customer Information</h4>
                      <div className="p-4 bg-gray-800 rounded-lg space-y-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                            {job.customer?.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <p className="text-white font-medium">{job.customer?.name}</p>
                            <p className="text-gray-500 text-sm">{job.customer?.email}</p>
                          </div>
                        </div>
                        {job.customer?.phone && (
                          <a
                            href={`tel:${job.customer.phone}`}
                            className="flex items-center justify-center w-full py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
                          >
                            📞 Call {job.customer.phone}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Customer Notes */}
                  {job.customerNotes && (
                    <div className="mt-4">
                      <h4 className="text-white font-medium mb-2">📝 Customer Notes</h4>
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                        <p className="text-yellow-100">{job.customerNotes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={loadJobs}
          disabled={loading}
          className="btn-secondary"
        >
          🔄 Refresh Jobs
        </button>
      </div>
    </div>
  );
};

export default AvailableJobs;