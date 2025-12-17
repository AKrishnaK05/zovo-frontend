// frontend/src/pages/Admin/Jobs.jsx
import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  ClipboardList, RefreshCcw, Trash2, Wrench, Zap, SprayCan,
  Paintbrush, Hammer, Plug, Package, Snowflake
} from 'lucide-react';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.put(`/jobs/${jobId}/status`, { status: newStatus });
      // Refresh jobs after update
      fetchJobs();
    } catch (error) {
      console.error('Failed to update job status:', error);
      alert('Failed to update job status');
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;

    try {
      await api.delete(`/jobs/${jobId}`);
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job');
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesFilter = filter === 'all' || job.status === filter;
    const matchesSearch =
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
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
      other: <Package size={20} />
    };
    return icons[category] || <Package size={20} />;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Jobs Management</h1>
          <p className="text-gray-400 mt-2">View and manage all service jobs</p>
        </div>
        <button
          onClick={fetchJobs}
          className="btn-secondary flex items-center"
        >
          <RefreshCcw size={16} className="mr-2" />
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

      {/* Filters & Search */}
      <div className="panel-card p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, category, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'accepted', 'in_progress', 'completed', 'cancelled'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${filter === f
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

      {/* Jobs Table */}
      {filteredJobs.length === 0 ? (
        <div className="panel-card p-12 text-center">
          <div className="flex justify-center mb-4"><ClipboardList size={64} className="text-gray-600" /></div>
          <h3 className="text-xl font-semibold text-white mb-2">No Jobs Found</h3>
          <p className="text-gray-400">
            {searchTerm || filter !== 'all'
              ? 'Try adjusting your filters or search term.'
              : 'No jobs have been created yet.'}
          </p>
        </div>
      ) : (
        <div className="panel-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr>
                  <th className="text-left p-4 text-gray-400 font-medium">Job</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Customer</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Worker</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Price</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-400 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-gray-800/30">
                    {/* Job Info */}
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-purple-400">{getCategoryIcon(job.category)}</span>
                        <div>
                          <p className="text-white font-medium">{job.title}</p>
                          <p className="text-gray-500 text-sm capitalize">{job.category}</p>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="p-4">
                      <div>
                        <p className="text-white">{job.customer?.name || 'N/A'}</p>
                        <p className="text-gray-500 text-sm">{job.customer?.email || ''}</p>
                      </div>
                    </td>

                    {/* Worker */}
                    <td className="p-4">
                      {job.worker ? (
                        <div>
                          <p className="text-white">{job.worker.name}</p>
                          <p className="text-gray-500 text-sm">{job.worker.email}</p>
                        </div>
                      ) : (
                        <span className="text-gray-500">Not assigned</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <p className="text-white">{formatDate(job.scheduledDate)}</p>
                      {job.timeSlot?.time && (
                        <p className="text-gray-500 text-sm">{job.timeSlot.time}</p>
                      )}
                    </td>

                    {/* Price */}
                    <td className="p-4">
                      <p className="text-white font-medium">
                        ₹{job.estimatedPrice || 0}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                        {(job.status || 'pending').replace('_', ' ').toUpperCase()}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center space-x-2">
                        {/* Status Dropdown */}
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          className="bg-gray-800 text-white text-sm rounded-lg px-2 py-1 border border-gray-700"
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDelete(job._id)}
                          className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                          title="Delete Job"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-gray-400 text-sm">
        Showing {filteredJobs.length} of {jobs.length} jobs
      </div>
    </div>
  );
};

export default Jobs;