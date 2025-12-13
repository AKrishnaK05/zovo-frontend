// frontend/src/pages/Customer/CustomerHome.jsx
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const CustomerHome = () => {
  const { user } = useAuth();
  const { categories, jobs, loading, refreshData } = useData();

  useEffect(() => {
    refreshData();
  }, []);

  // Check if job can be reviewed
  const canReview = (job) => {
    return job.status === 'completed' && job.worker && !job.hasReview;
  };

  // Get status badge style
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

  // Get category icon
  const getCategoryIcon = (category) => {
    const icons = {
      plumbing: '🔧', electrical: '⚡', cleaning: '🧹', painting: '🎨',
      carpentry: '🪚', appliance: '🔌', 'ac-service': '❄️', 'pest-control': '🦟',
      salon: '💇‍♀️', 'men-grooming': '💇‍♂️', movers: '🚚', other: '📦'
    };
    return icons[category] || '📦';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Separate jobs needing review
  const jobsNeedingReview = jobs.filter(canReview);
  const recentJobs = jobs.slice(0, 5);

  return (
    <div>


      {/* Stats */}
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-white mt-1">{jobs.length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
              📋
            </div>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active</p>
              <p className="text-3xl font-bold text-white mt-1">
                {jobs.filter(j => ['accepted', 'in_progress'].includes(j.status)).length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              🔧
            </div>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pending</p>
              <p className="text-3xl font-bold text-white mt-1">
                {jobs.filter(j => j.status === 'pending').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-xl">
              ⏳
            </div>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-1">
                {jobs.filter(j => j.status === 'completed').length}
              </p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-xl">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* 🌟 Pending Reviews Alert */}
      {jobsNeedingReview.length > 0 && (
        <div className="mb-8 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/20 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl">
                ⭐
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {jobsNeedingReview.length} Completed Job{jobsNeedingReview.length > 1 ? 's' : ''} Awaiting Review
                </h3>
                <p className="text-gray-400 text-sm">Share your experience and help others!</p>
              </div>
            </div>
            <Link
              to="/customer/history"
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-black font-medium rounded-lg transition"
            >
              Write Reviews
            </Link>
          </div>

          {/* Quick Review Cards */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            {jobsNeedingReview.slice(0, 2).map((job) => (
              <div key={job._id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-xl">{getCategoryIcon(job.category)}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{job.title}</p>
                    <p className="text-gray-500 text-xs">Worker: {job.worker?.name}</p>
                  </div>
                </div>
                <Link
                  to={`/customer/review/${job._id}`}
                  className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm rounded-lg hover:from-purple-600 hover:to-pink-600 transition"
                >
                  ⭐ Review
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link to="/customer/history" className="panel-card p-4 hover:bg-white/5 transition text-center">
          <span className="text-2xl mb-2 block">📋</span>
          <span className="text-white text-sm font-medium">My Bookings</span>
        </Link>
        <Link to="/customer/profile" className="panel-card p-4 hover:bg-white/5 transition text-center">
          <span className="text-2xl mb-2 block">👤</span>
          <span className="text-white text-sm font-medium">Profile</span>
        </Link>
        <button onClick={refreshData} className="panel-card p-4 hover:bg-white/5 transition text-center">
          <span className="text-2xl mb-2 block">🔄</span>
          <span className="text-white text-sm font-medium">Refresh</span>
        </button>
        <Link to="/customer/history?filter=completed" className="panel-card p-4 hover:bg-white/5 transition text-center">
          <span className="text-2xl mb-2 block">⭐</span>
          <span className="text-white text-sm font-medium">Write Review</span>
        </Link>
      </div>

      {/* Categories */}
      <h2 className="text-2xl font-bold text-white mb-6">Our Services</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat._id || cat.slug}
            to={`/customer/book/${cat.slug}`}
            className="panel-card p-4 hover:bg-white/5 transition group"
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h3 className="text-white font-medium text-sm">{cat.name}</h3>
                <p className="text-gray-500 text-xs">{cat.minDuration || 60} min</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
              <span className="text-lg font-bold gradient-text">₹{cat.basePrice}</span>
              <span className="text-purple-400 text-sm group-hover:translate-x-1 transition-transform">Book →</span>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Recent Bookings</h2>
          {jobs.length > 0 && (
            <Link to="/customer/history" className="text-purple-400 hover:text-purple-300 text-sm">
              View all →
            </Link>
          )}
        </div>

        {jobs.length === 0 ? (
          <div className="panel-card p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-semibold text-white mb-2">No Bookings Yet</h3>
            <p className="text-gray-400 mb-6">Book your first service to get started!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentJobs.map((job) => (
              <div key={job._id} className="panel-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-2xl">{getCategoryIcon(job.category)}</span>
                    <div>
                      <p className="text-white font-medium">{job.title}</p>
                      <p className="text-gray-500 text-sm">
                        {job.scheduledDate
                          ? new Date(job.scheduledDate).toLocaleDateString('en-IN', {
                            weekday: 'short', month: 'short', day: 'numeric'
                          })
                          : 'Date TBD'}
                        {job.worker && ` • ${job.worker.name}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Price */}
                    {job.estimatedPrice > 0 && (
                      <span className="text-white font-medium hidden md:block">₹{job.estimatedPrice}</span>
                    )}

                    {/* Status */}
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(job.status)}`}>
                      {(job.status || 'pending').replace('_', ' ').toUpperCase()}
                    </span>

                    {/* 🌟 Review Button */}
                    {canReview(job) && (
                      <Link
                        to={`/customer/review/${job._id}`}
                        className="px-3 py-1.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-medium rounded-lg hover:from-yellow-600 hover:to-orange-600 transition flex items-center"
                      >
                        ⭐ Review
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHome;