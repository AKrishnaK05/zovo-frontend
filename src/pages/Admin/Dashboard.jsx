import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, activity, loadStats, loadActivity } = useAdmin();

  useEffect(() => {
    loadStats();
    loadActivity();
  }, [loadStats, loadActivity]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>


      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.users?.total || 0}</p>
              <p className="text-xs text-green-400 mt-1">+{stats?.users?.newThisWeek || 0} this week</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-xl">
              👥
            </div>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Jobs</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.jobs?.total || 0}</p>
              <p className="text-xs text-green-400 mt-1">+{stats?.jobs?.newThisWeek || 0} this week</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-xl">
              📋
            </div>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Active Jobs</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.jobs?.active || 0}</p>
              <p className="text-xs text-yellow-400 mt-1">{stats?.jobs?.pending || 0} pending</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 flex items-center justify-center text-xl">
              🔄
            </div>
          </div>
        </div>

        <div className="panel-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white mt-1">{stats?.jobs?.completed || 0}</p>
              <p className="text-xs text-green-400 mt-1">₹{stats?.revenue?.total || 0} revenue</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-xl">
              ✅
            </div>
          </div>
        </div>
      </div>

      {/* User Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link to="/admin/users?role=customer" className="panel-card p-6 hover:bg-white/5 transition">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center text-2xl">
              🏠
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">{stats?.users?.customers || 0}</p>
              <p className="text-gray-400 text-sm">Customers</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/users?role=worker" className="panel-card p-6 hover:bg-white/5 transition">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-2xl">
              🔧
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">{stats?.users?.workers || 0}</p>
              <p className="text-gray-400 text-sm">Workers</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/jobs?status=pending" className="panel-card p-6 hover:bg-white/5 transition">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-2xl">
              ⏳
            </div>
            <div className="ml-4">
              <p className="text-2xl font-bold text-white">{stats?.jobs?.pending || 0}</p>
              <p className="text-gray-400 text-sm">Pending Jobs</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Earnings Chart */}
        <div className="panel-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Top Workers by Earnings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.performance?.earnings || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Bar dataKey="earnings" fill="#8B5CF6" name="Earnings (₹)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs & Ratings Chart */}
        <div className="panel-card p-6">
          <h2 className="text-xl font-bold text-white mb-4">Worker Performance (Jobs & Rating)</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.performance?.earnings || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis yAxisId="left" orientation="left" stroke="#9CA3AF" />
                <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '0.5rem' }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="jobs" fill="#06B6D4" name="Jobs Completed" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="panel-card">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Users</h2>
            <Link to="/admin/users" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {activity?.recentUsers?.map((u) => (
              <div key={u._id} className="p-4 flex items-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${u.role === 'customer' ? 'bg-purple-500' : u.role === 'worker' ? 'bg-cyan-500' : 'bg-red-500'
                  }`}>
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-white">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <span className={`badge ${u.role === 'customer' ? 'badge-pending' : u.role === 'worker' ? 'badge-accepted' : 'badge-cancelled'
                    }`}>
                    {u.role}
                  </span>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(u.createdAt)}</p>
                </div>
              </div>
            ))}
            {(!activity?.recentUsers || activity.recentUsers.length === 0) && (
              <div className="p-8 text-center text-gray-500">No recent users</div>
            )}
          </div>
        </div>

        {/* Recent Jobs */}
        <div className="panel-card">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">Recent Jobs</h2>
            <Link to="/admin/jobs" className="text-cyan-400 hover:text-cyan-300 text-sm">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-800">
            {activity?.recentJobs?.map((job) => (
              <div key={job._id} className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-white">{job.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      by {job.customer?.name} • {job.category}
                    </p>
                  </div>
                  <span className={`badge badge-${job.status.replace('_', '-')}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
            {(!activity?.recentJobs || activity.recentJobs.length === 0) && (
              <div className="p-8 text-center text-gray-500">No recent jobs</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;