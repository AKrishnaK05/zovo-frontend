import { useState, useEffect } from 'react';
import { Wrench, Zap, SprayCan, Paintbrush, Hammer, Plug, Package, Lightbulb, Check, Loader2 } from 'lucide-react';
import api from '../../services/api';

const WorkerServices = () => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const categories = [
    { value: 'plumbing', label: 'Plumbing', icon: <Wrench size={36} />, description: 'Pipe repairs, installations, leak fixes' },
    { value: 'electrical', label: 'Electrical', icon: <Zap size={36} />, description: 'Wiring, outlets, electrical repairs' },
    { value: 'cleaning', label: 'Cleaning', icon: <SprayCan size={36} />, description: 'Home and office cleaning services' },
    { value: 'painting', label: 'Painting', icon: <Paintbrush size={36} />, description: 'Interior and exterior painting' },
    { value: 'carpentry', label: 'Carpentry', icon: <Hammer size={36} />, description: 'Wood work, furniture, repairs' },
    { value: 'appliance', label: 'Appliance Repair', icon: <Plug size={36} />, description: 'Home appliance repairs' },
    { value: 'other', label: 'Other Services', icon: <Package size={36} />, description: 'Other handyman services' }
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/worker/profile');
      setSelectedCategories(response.data.data.serviceCategories || []);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setSuccess('');
    setError('');
  };

  const handleSave = async () => {
    if (selectedCategories.length === 0) {
      setError('Please select at least one service category');
      return;
    }

    setSaving(true);
    setError('');

    try {
      await api.put('/worker/services', { serviceCategories: selectedCategories });
      setSuccess('Service categories updated! You will now see matching jobs.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update categories');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">My Services</h1>
        <p className="text-gray-400 mt-2">
          Select the services you provide. You will only see jobs matching your categories.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg">
          {success}
        </div>
      )}

      {/* Info Box */}
      <div className="panel-card p-6 mb-6 border border-cyan-500/30 bg-cyan-500/5">
        <div className="flex items-start space-x-3">
          <span className="text-2xl text-yellow-400">
            <Lightbulb size={24} />
          </span>
          <div>
            <h3 className="text-white font-medium mb-1">How it works</h3>
            <p className="text-gray-400 text-sm">
              When a customer books a plumbing service, only workers who selected "Plumbing" will see that job.
            </p>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {categories.map((cat) => (
          <div
            key={cat.value}
            onClick={() => toggleCategory(cat.value)}
            className={`panel-card p-6 cursor-pointer transition-all ${selectedCategories.includes(cat.value)
                ? 'border-2 border-purple-500 bg-purple-500/10'
                : 'hover:bg-white/5'
              }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`text-4xl p-3 rounded-lg ${selectedCategories.includes(cat.value)
                  ? 'bg-purple-500/20'
                  : 'bg-gray-800'
                }`}>
                {cat.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{cat.label}</h3>
                  {selectedCategories.includes(cat.value) && (
                    <span className="text-purple-400">
                      <Check size={20} />
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-1">{cat.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Count */}
      <div className="panel-card p-4 mb-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className="text-gray-400">
            Selected: <span className="text-white font-bold">{selectedCategories.length}</span>
          </span>
          <div className="flex flex-wrap gap-2">
            {selectedCategories.map(cat => (
              <span key={cat} className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm capitalize">
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="btn-accent w-full flex items-center justify-center"
      >
        {saving ? (
          <>
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5" />
            Saving...
          </>
        ) : (
          'Save Service Categories'
        )}
      </button>
    </div>
  );
};

export default WorkerServices;