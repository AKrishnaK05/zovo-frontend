// frontend/src/pages/Customer/CustomerProfile.jsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

import { useData } from '../../context/DataContext';

const CustomerProfile = () => {
  const { user, updateUser } = useAuth();
  const { jobs } = useData();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/auth/update-profile', formData);

      // Update local user data
      if (updateUser && response.data.data) {
        updateUser(response.data.data);
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        await api.delete('/auth/delete-account');
        // Logout and force redirect is handled by context usually, but let's ensure cleanup
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } catch (error) {
        setMessage({
          type: 'error',
          text: error.response?.data?.error || 'Failed to delete account'
        });
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-gray-400 mt-2">Manage your account information</p>
      </div>

      {/* Profile Card */}
      <div className="panel-card p-6 mb-6">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm capitalize">
              {user?.role || 'Customer'}
            </span>
          </div>
        </div>
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

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="panel-card p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Edit Profile</h3>

        <div className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              className="input bg-gray-800 opacity-50 cursor-not-allowed"
              disabled
            />
            <p className="text-gray-500 text-sm mt-1">Email cannot be changed</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input"
              placeholder="+91 1234567890"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full btn-accent mt-6"
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* Account Stats */}
      <div className="panel-card p-6 mt-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Stats</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-white">{jobs.length}</p>
            <p className="text-gray-500 text-sm">Total Bookings</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-cyan-400">
              {jobs.filter(j => ['accepted', 'in_progress'].includes(j.status)).length}
            </p>
            <p className="text-gray-500 text-sm">Active Jobs</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-400">
              ₹{jobs
                .filter(j => j.status === 'completed')
                .reduce((sum, j) => sum + (j.finalPrice || j.estimatedPrice || 0), 0)
                .toLocaleString('en-IN')}
            </p>
            <p className="text-gray-500 text-sm">Total Spent</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-400">
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : 'N/A'}
            </p>
            <p className="text-gray-500 text-sm">Member Since</p>
          </div>
        </div>
      </div>

      {/* Delete Account */}
      <div className="panel-card p-6 mt-6 border border-red-500/20">
        <h3 className="text-lg font-semibold text-red-400 mb-4">Delete Account</h3>
        <p className="text-gray-400 text-sm mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button
          type="button"
          onClick={handleDeleteAccount}
          className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition border border-red-500/20"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;