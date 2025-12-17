// frontend/src/pages/Worker/WorkerProfile.jsx
import { useState, useEffect } from 'react';
import { Wrench, Zap, SprayCan, Paintbrush, Hammer, Plug, Package, CircleDot, AlertTriangle, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const WorkerProfile = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    serviceCategories: [],
    bio: '',
    hourlyRate: 0,
    isAvailable: true
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const CATEGORIES = [
    { value: 'plumbing', label: 'Plumbing', icon: <Wrench size={20} /> },
    { value: 'electrical', label: 'Electrical', icon: <Zap size={20} /> },
    { value: 'cleaning', label: 'Cleaning', icon: <SprayCan size={20} /> },
    { value: 'painting', label: 'Painting', icon: <Paintbrush size={20} /> },
    { value: 'carpentry', label: 'Carpentry', icon: <Hammer size={20} /> },
    { value: 'appliance', label: 'Appliance Repair', icon: <Plug size={20} /> },
    { value: 'other', label: 'Other', icon: <Package size={20} /> }
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        serviceCategories: user.serviceCategories || [],
        bio: user.bio || '',
        hourlyRate: user.hourlyRate || 0,
        isAvailable: user.isAvailable !== false
      });
    }
  }, [user]);

  const toggleCategory = (category) => {
    console.log('Toggling category:', category);
    setFormData(prev => {
      const currentCats = Array.isArray(prev.serviceCategories) ? prev.serviceCategories : [];
      const newCats = currentCats.includes(category)
        ? currentCats.filter(c => c !== category)
        : [...currentCats, category];
      console.log('New categories:', newCats);
      return {
        ...prev,
        serviceCategories: newCats
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.serviceCategories.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one service category' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      await api.put('/auth/update-profile', formData);
      setMessage({ type: 'success', text: 'Profile updated! Reloading...' });

      setTimeout(() => window.location.reload(), 1500);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.error || 'Failed to update profile'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Worker Profile</h1>
        <p className="text-gray-400 mt-2">Manage your profile and service categories</p>
      </div>

      {/* Profile Card */}
      <div className="panel-card p-6 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold">
            {user?.name?.charAt(0).toUpperCase() || 'W'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{user?.name}</h2>
            <p className="text-gray-400">{user?.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-sm ${formData.isAvailable
                ? 'bg-green-500/20 text-green-400'
                : 'bg-red-500/20 text-red-400'
                }`}>
                {formData.isAvailable ? (
                  <div className="flex items-center gap-2 text-green-400">
                    <CircleDot size={16} className="fill-current" />
                    <span>Available</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-red-400">
                    <CircleDot size={16} />
                    <span>Unavailable</span>
                  </div>
                )}
              </span>
              <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
                {formData.serviceCategories.length} Services
              </span>
            </div>
          </div>
        </div>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success'
          ? 'bg-green-500/10 border border-green-500/20 text-green-400'
          : 'bg-red-500/10 border border-red-500/20 text-red-400'
          }`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="panel-card p-6 space-y-6">
        {/* Basic Info */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                className="input bg-gray-800 opacity-50 cursor-not-allowed"
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="input"
                placeholder="+91 1234567890"
              />
            </div>
          </div>
        </div>

        {/* Service Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">Service Categories</h3>
          <p className="text-gray-400 text-sm mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle size={20} />
              <span>Select categories to see matching jobs in Available Jobs</span>
            </div>
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => toggleCategory(cat.value)}
                className={`p-4 rounded-lg border-2 transition ${formData.serviceCategories.includes(cat.value)
                  ? 'border-purple-500 bg-purple-500/20 text-white'
                  : 'border-gray-700 bg-gray-800/50 text-gray-400 hover:border-gray-600'
                  }`}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-sm font-medium">{cat.label}</div>
              </button>
            ))}
          </div>

          {formData.serviceCategories.length > 0 && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                <div className="flex items-center gap-2">
                  <Check size={20} />
                  <span>{formData.serviceCategories.length} selected: {formData.serviceCategories.join(', ')}</span>
                </div>
              </p>
            </div>
          )}
        </div>

        {/* Availability */}
        <div>
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isAvailable}
              onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
              className="w-5 h-5 rounded border-gray-700 bg-gray-800 text-purple-500 focus:ring-purple-500"
            />
            <span className="text-gray-300">I am currently available to accept jobs</span>
          </label>
        </div>

        <button type="submit" disabled={saving} className="w-full btn-accent">
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
};

export default WorkerProfile;