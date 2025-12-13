// frontend/src/pages/Admin/ServiceCategories.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const ServiceCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    icon: '🔧',
    basePrice: 0,
    hourlyRate: 0,
    minDuration: 60,
    includes: [],
    subServices: []
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const iconOptions = ['🔧', '⚡', '🧹', '🎨', '🪚', '🔌', '🏠', '🚿', '💡', '🛠️', '📦', '❄️', '🦟', '💇‍♀️', '💇‍♂️', '🚚'];

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/pricing/categories');
      setCategories(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      icon: '🔧',
      basePrice: 0,
      hourlyRate: 0,
      minDuration: 60,
      includes: [],
      subServices: []
    });
  }, []);

  const handleEdit = useCallback((category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      slug: category.slug || '',
      description: category.description || '',
      icon: category.icon || '🔧',
      basePrice: category.basePrice || 0,
      hourlyRate: category.hourlyRate || 0,
      minDuration: category.minDuration || 60,
      includes: category.includes || [],
      subServices: category.subServices || []
    });
    setShowModal(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingCategory(null);
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingCategory(null);
    resetForm();
  }, [resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const dataToSend = {
        ...formData,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      };

      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory._id}`, dataToSend);
        setMessage({ type: 'success', text: 'Category updated successfully!' });
      } else {
        await api.post('/admin/categories', dataToSend);
        setMessage({ type: 'success', text: 'Category created successfully!' });
      }

      fetchCategories();
      handleCloseModal();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save category' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await api.delete(`/admin/categories/${categoryId}`);
      setMessage({ type: 'success', text: 'Category deleted!' });
      fetchCategories();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete category' });
    }
  };

  const addSubService = () => {
    setFormData(prev => ({
      ...prev,
      subServices: [...prev.subServices, { name: '', price: 0, duration: 30 }]
    }));
  };

  const updateSubService = (index, field, value) => {
    setFormData(prev => {
      const updated = [...prev.subServices];
      updated[index] = {
        ...updated[index],
        [field]: field === 'price' || field === 'duration' ? parseFloat(value) || 0 : value
      };
      return { ...prev, subServices: updated };
    });
  };

  const removeSubService = (index) => {
    setFormData(prev => ({
      ...prev,
      subServices: prev.subServices.filter((_, i) => i !== index)
    }));
  };

  const addInclude = () => {
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, '']
    }));
  };

  const updateInclude = (index, value) => {
    setFormData(prev => {
      const updated = [...prev.includes];
      updated[index] = value;
      return { ...prev, includes: updated };
    });
  };

  const removeInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }));
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
          <h1 className="text-3xl font-bold text-white">Service Categories</h1>
          <p className="text-gray-400 mt-2">Manage service categories and pricing</p>
        </div>
        <button onClick={handleCreate} className="btn-accent">
          + Add Category
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

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category._id} className="panel-card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{category.icon}</span>
                <div>
                  <h3 className="text-xl font-bold text-white">{category.name}</h3>
                  <p className="text-gray-500 text-sm">{category.slug}</p>
                </div>
              </div>
            </div>

            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {category.description || 'No description'}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-2xl font-bold gradient-text">₹{category.basePrice}</p>
                <p className="text-gray-500 text-xs">Base Price</p>
              </div>
              <div className="p-3 bg-gray-800/50 rounded-lg text-center">
                <p className="text-2xl font-bold text-white">{category.minDuration}m</p>
                <p className="text-gray-500 text-xs">Min Duration</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-500 text-sm mb-2">Sub-services: {category.subServices?.length || 0}</p>
              <div className="flex flex-wrap gap-1">
                {category.subServices?.slice(0, 3).map((sub, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded">
                    {sub.name}
                  </span>
                ))}
                {category.subServices?.length > 3 && (
                  <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded">
                    +{category.subServices.length - 3} more
                  </span>
                )}
              </div>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={() => handleEdit(category)}
                className="flex-1 btn-secondary text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(category._id)}
                className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg text-sm transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="panel-card p-12 text-center">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Categories Yet</h3>
          <p className="text-gray-400 mb-6">Create your first service category to get started.</p>
          <button onClick={handleCreate} className="btn-accent">
            + Add Category
          </button>
        </div>
      )}

      {/* Modal - Rendered only once with portal-like behavior */}
      {showModal && (
        <div 
          className="fixed inset-0 z-[9999] overflow-y-auto"
          aria-labelledby="modal-title" 
          role="dialog" 
          aria-modal="true"
        >
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
            onClick={handleCloseModal}
            aria-hidden="true"
          />
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            {/* Modal Content */}
            <div 
              className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 pb-4 border-b border-gray-700">
                <h2 id="modal-title" className="text-2xl font-bold text-white">
                  {editingCategory ? 'Edit Category' : 'Create Category'}
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
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="e.g., Plumbing"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => handleInputChange('slug', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                      placeholder="auto-generated"
                    />
                  </div>
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Icon</label>
                  <div className="flex flex-wrap gap-2 p-3 bg-gray-800 rounded-lg border border-gray-600">
                    {iconOptions.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        onClick={() => handleInputChange('icon', icon)}
                        className={`p-2 rounded-lg text-2xl transition ${
                          formData.icon === icon
                            ? 'bg-purple-500 ring-2 ring-purple-400 scale-110'
                            : 'bg-gray-700 hover:bg-gray-600'
                        }`}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 resize-none"
                    placeholder="Brief description of this service"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Base Price (₹) *</label>
                    <input
                      type="number"
                      value={formData.basePrice}
                      onChange={(e) => handleInputChange('basePrice', parseFloat(e.target.value) || 0)}
                      required
                      min="0"
                      step="1"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Hourly Rate (₹)</label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="1"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Min Duration (min)</label>
                    <input
                      type="number"
                      value={formData.minDuration}
                      onChange={(e) => handleInputChange('minDuration', parseInt(e.target.value) || 60)}
                      min="15"
                      step="15"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Includes */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">Service Includes</label>
                    <button 
                      type="button" 
                      onClick={addInclude} 
                      className="text-purple-400 text-sm hover:text-purple-300 transition"
                    >
                      + Add Item
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.includes.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateInclude(index, e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          placeholder="e.g., Free inspection"
                        />
                        <button
                          type="button"
                          onClick={() => removeInclude(index)}
                          className="px-3 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {formData.includes.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No items added yet</p>
                    )}
                  </div>
                </div>

                {/* Sub-services */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-300">Sub-services</label>
                    <button 
                      type="button" 
                      onClick={addSubService} 
                      className="text-purple-400 text-sm hover:text-purple-300 transition"
                    >
                      + Add Sub-service
                    </button>
                  </div>
                  <div className="space-y-3">
                    {formData.subServices.map((sub, index) => (
                      <div key={index} className="flex flex-wrap gap-2 items-center bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => updateSubService(index, 'name', e.target.value)}
                          className="flex-1 min-w-[150px] px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                          placeholder="Service name"
                        />
                        <div className="flex items-center">
                          <span className="text-gray-500 mr-1">₹</span>
                          <input
                            type="number"
                            value={sub.price}
                            onChange={(e) => updateSubService(index, 'price', e.target.value)}
                            className="w-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="Price"
                            min="0"
                          />
                        </div>
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={sub.duration}
                            onChange={(e) => updateSubService(index, 'duration', e.target.value)}
                            className="w-20 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                            placeholder="Min"
                            min="15"
                          />
                          <span className="text-gray-500 ml-1">min</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSubService(index)}
                          className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    {formData.subServices.length === 0 && (
                      <p className="text-gray-500 text-sm italic">No sub-services added yet</p>
                    )}
                  </div>
                </div>

                {/* Actions */}
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
                    {saving ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
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

export default ServiceCategories;