import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, Wrench, CheckCircle, ClipboardList, MapPin, Calendar, Tag, Briefcase } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWorker } from '../../context/WorkerContext';

import { useNavigate } from 'react-router-dom';

const WorkerHome = () => {
  const { user } = useAuth();
  const { availableJobs, myJobs, loading, loadJobs, loadStats, stats: workerStats } = useWorker();
  const navigate = useNavigate();

  // ... existing activeJobs/completedJobs/stats logic (unchanged) ...
  // Note: I will use a simplified replacement to avoid repeating lines 10-23 if possible, 
  // but replace_file_content requires exact context.
  // I will replace the start of the component to add the hook.

  useEffect(() => {
    loadJobs();
    loadStats();
  }, [loadJobs, loadStats]);

  const activeJobs = myJobs.filter(j => j.status === 'accepted' || j.status === 'in_progress');
  const completedJobs = myJobs.filter(j => j.status === 'completed');

  const stats = [
    { label: 'Rating', value: workerStats?.averageRating ? `${workerStats.averageRating.toFixed(1)} (${workerStats.totalReviews})` : 'New', icon: <Star size={20} fill="currentColor" />, color: 'from-yellow-500 to-orange-500' },
    { label: 'Active Jobs', value: activeJobs.length, icon: <Wrench size={20} />, color: 'from-blue-500 to-cyan-500' },
    { label: 'Completed', value: completedJobs.length, icon: <CheckCircle size={20} />, color: 'from-green-500 to-emerald-500' },
    { label: 'Available', value: availableJobs.length, icon: <ClipboardList size={20} />, color: 'from-purple-500 to-pink-500' },
  ];

  // ... rest of component ...


  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div>


      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="panel-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`h-12 w-12 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Available Jobs CTA */}
        <Link to="/worker/available-jobs" className="panel-card p-6 hover:bg-white/5 transition group">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-cyan-400 transition">
                Browse Available Jobs
              </h2>
              <p className="text-gray-400 mt-1">
                {availableJobs.length} jobs waiting for you
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl">
              <ClipboardList size={24} />
            </div>
          </div>
        </Link>

        {/* My Jobs CTA */}
        <Link to="/worker/my-jobs" className="panel-card p-6 hover:bg-white/5 transition group">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white group-hover:text-purple-400 transition">
                View My Jobs
              </h2>
              <p className="text-gray-400 mt-1">
                {activeJobs.length} active, {completedJobs.length} completed
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
              <Briefcase size={24} />
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Available Jobs Preview */}
      {!loading && availableJobs.length > 0 && (
        <div className="panel-card">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Latest Available Jobs</h2>
            <Link to="/worker/available-jobs" className="panel-card p-6 hover:bg-white/5 transition group">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {availableJobs.slice(0, 3).map((job) => (
              <div
                key={job._id}
                onClick={() => navigate('/worker/available-jobs', { state: { highlightJobId: job._id } })}
                className="p-6 hover:bg-white/5 transition cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition">{job.title}</h3>
                    <p className="text-gray-400 mt-1 line-clamp-1">{job.description}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} />
                        <span>{job.location?.address}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDate(job.scheduledDate)}</span>
                      </div>
                      <div className="flex items-center gap-1 capitalize">
                        <Tag size={14} />
                        <span>{job.category}</span>
                      </div>
                    </div>
                  </div>
                  {job.estimatedPrice > 0 && (
                    <div className="text-right ml-4">
                      <span className="text-xl font-bold gradient-text">₹{job.estimatedPrice}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="panel-card p-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto"></div>
          <p className="text-gray-400 mt-4">Loading your dashboard...</p>
        </div>
      )}
    </div>
  );
};

export default WorkerHome;