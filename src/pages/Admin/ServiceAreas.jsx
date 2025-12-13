// frontend/src/pages/Admin/ServiceAreas.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const ServiceAreas = () => {
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingArea, setEditingArea] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const initialFormData = {
    name: '',
    city: '',
    center: { lat: 12.9716, lng: 77.5946 }, // Bangalore default
    radius: 10,
    availableCategories: [],
    priceModifier: 1.0,
    travelFee: 0,
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormData);

  const categoryOptions = ['plumbing', 'electrical', 'cleaning', 'painting', 'carpentry', 'appliance', 'ac-service', 'pest-control', 'salon', 'other'];

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    try {
      const response = await api.get('/admin/service-areas');
      setAreas(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch areas:', error);
      // Try alternate endpoint
      try {
        const response = await api.get('/areas');
        setAreas(response.data.data || []);
      } catch (e) {
        console.error('Both endpoints failed');
      }
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const handleEdit = useCallback((area) => {
    setEditingArea(area);
    setFormData({
      name: area.name || '',
      city: area.city || '',
      center: {
        lat: area.center?.coordinates?.[1] || area.center?.lat || 12.9716,
        lng: area.center?.coordinates?.[0] || area.center?.lng || 77.5946
      },
      radius: area.radius || 10,
      availableCategories: area.availableCategories || [],
      priceModifier: area.priceModifier || 1.0,
      travelFee: area.travelFee || 0,
      isActive: area.isActive !== false
    });
    setShowModal(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingArea(null);
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingArea(null);
    resetForm();
  }, [resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        ...formData,
        center: {
          type: 'Point',
          coordinates: [formData.center.lng, formData.center.lat]
        },
        boundary: {
          type: 'Polygon',
          coordinates: [[
            [formData.center.lng - 0.1, formData.center.lat - 0.1],
            [formData.center.lng + 0.1, formData.center.lat - 0.1],
            [formData.center.lng + 0.1, formData.center.lat + 0.1],
            [formData.center.lng - 0.1, formData.center.lat + 0.1],
            [formData.center.lng - 0.1, formData.center.lat - 0.1]
          ]]
        }
      };

      if (editingArea) {
        await api.put(`/admin/service-areas/${editingArea._id}`, dataToSend);
        setMessage({ type: 'success', text: 'Area updated successfully!' });
      } else {
        await api.post('/admin/service-areas', dataToSend);
        setMessage({ type: 'success', text: 'Area created successfully!' });
      }

      fetchAreas();
      handleCloseModal();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save area' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (areaId) => {
    if (!window.confirm('Are you sure you want to delete this service area?')) return;

    try {
      await api.delete(`/admin/service-areas/${areaId}`);
      setMessage({ type: 'success', text: 'Area deleted!' });
      fetchAreas();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete area' });
    }
  };

  const toggleCategory = (cat) => {
    setFormData(prev => {
      const cats = prev.availableCategories.includes(cat)
        ? prev.availableCategories.filter(c => c !== cat)
        : [...prev.availableCategories, cat];
      return { ...prev, availableCategories: cats };
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Service Areas</h1>
          <p className="text-gray-400 mt-2">Manage serviceable zones and area-based pricing</p>
        </div>
        <button onClick={handleCreate} className="btn-accent">
          + Add Area
        </button>
      </div>

      {/* Message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg flex items-center justify-between ${
          message.type === 'success'
            ? 'bg-green-500/10 border border-green-500/20 text-green-400'
            : 'bg-red-500/10 border border-red-500/20 text-red-400'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="ml-4 hover:opacity-70">✕</button>
        </div>
      )}

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {areas.map((area) => (
          <div key={area._id} className={`panel-card p-6 ${!area.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold text-white">{area.name}</h3>
                <p className="text-gray-400">{area.city}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                area.isActive ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
              }`}>
                {area.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2 bg-gray-800/50 rounded">
                <p className="text-lg font-bold text-white">{area.radius} km</p>
                <p className="text-gray-500 text-xs">Radius</p>
              </div>
              <div className="p-2 bg-gray-800/50 rounded">
                <p className="text-lg font-bold text-white">
                  {area.priceModifier === 1 ? 'Std' : `${((area.priceModifier - 1) * 100).toFixed(0)}%`}
                </p>
                <p className="text-gray-500 text-xs">Price Adj</p>
              </div>
              <div className="p-2 bg-gray-800/50 rounded">
                <p className="text-lg font-bold text-white">₹{area.travelFee}</p>
                <p className="text-gray-500 text-xs">Travel</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-xs mb-2">Available Services</p>
              <div className="flex flex-wrap gap-1">
                {area.availableCategories?.slice(0, 4).map((cat, i) => (
                  <span key={i} className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded capitalize">
                    {cat.replace('-', ' ')}
                  </span>
                ))}
                {area.availableCategories?.length > 4 && (
                  <span className="px-2 py-0.5 bg-gray-700 text-gray-400 text-xs rounded">
                    +{area.availableCategories.length - 4}
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button onClick={() => handleEdit(area)} className="flex-1 btn-secondary text-sm">
                Edit
              </button>
              <button
                onClick={() => handleDelete(area._id)}
                className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {areas.length === 0 && (
        <div className="panel-card p-12 text-center">
          <div className="text-6xl mb-4">🗺️</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Service Areas</h3>
          <p className="text-gray-400 mb-6">Define your serviceable areas to start accepting bookings.</p>
          <button onClick={handleCreate} className="btn-accent">
            + Add Area
          </button>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto"
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal Content */}
            <div 
              className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 pb-4 border-b border-gray-700">
                <h2 id="modal-title" className="text-2xl font-bold text-white">
                  {editingArea ? 'Edit Service Area' : 'Create Service Area'}
                </h2>
                <button 
                  onClick={handleCloseModal} 
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition"
                  type="button"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Area Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Downtown"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Bangalore"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Center Latitude</label>
                    <input
                      type="number"
                      value={formData.center.lat}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        center: { ...prev.center, lat: parseFloat(e.target.value) || 0 }
                      }))}
                      step="0.0001"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Center Longitude</label>
                    <input
                      type="number"
                      value={formData.center.lng}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        center: { ...prev.center, lng: parseFloat(e.target.value) || 0 }
                      }))}
                      step="0.0001"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Radius (km)</label>
                    <input
                      type="number"
                      value={formData.radius}
                      onChange={(e) => handleInputChange('radius', parseFloat(e.target.value) || 1)}
                      min="1"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price Modifier</label>
                    <input
                      type="number"
                      value={formData.priceModifier}
                      onChange={(e) => handleInputChange('priceModifier', parseFloat(e.target.value) || 1)}
                      step="0.05"
                      min="0.5"
                      max="2"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Travel Fee (₹)</label>
                    <input
                      type="number"
                      value={formData.travelFee}
                      onChange={(e) => handleInputChange('travelFee', parseFloat(e.target.value) || 0)}
                      min="0"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Available Services</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-800 rounded-lg border border-gray-600">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-2 rounded-lg text-sm capitalize transition ${
                          formData.availableCategories.includes(cat)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                        }`}
                      >
                        {cat.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => handleInputChange('isActive', !formData.isActive)}
                    className={`w-12 h-6 rounded-full transition relative ${
                      formData.isActive ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white absolute top-0.5 transition-transform ${
                      formData.isActive ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-gray-300">Area is {formData.isActive ? 'active' : 'inactive'}</span>
                </div>

                <div className="flex space-x-4 pt-4 border-t border-gray-700">
                  <button 
                    type="button" 
                    onClick={handleCloseModal} 
                    className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={saving} 
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:opacity-90 transition font-medium disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : (editingArea ? 'Update Area' : 'Create Area')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAreas;