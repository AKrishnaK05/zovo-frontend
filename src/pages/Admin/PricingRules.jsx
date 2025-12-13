// frontend/src/pages/Admin/PricingRules.jsx
import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

const PricingRules = () => {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const initialFormData = {
    name: '',
    description: '',
    ruleType: 'multiplier',
    value: 1.0,
    categories: [],
    conditions: {
      daysOfWeek: [],
      timeRange: { start: '', end: '' },
      demandThreshold: null
    },
    priority: 0,
    isActive: true
  };

  const [formData, setFormData] = useState(initialFormData);

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const categoryOptions = ['plumbing', 'electrical', 'cleaning', 'painting', 'carpentry', 'appliance', 'ac-service', 'pest-control', 'salon', 'other'];

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await api.get('/admin/pricing-rules');
      setRules(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch rules:', error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const handleEdit = useCallback((rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name || '',
      description: rule.description || '',
      ruleType: rule.ruleType || 'multiplier',
      value: rule.value || 1.0,
      categories: rule.categories || [],
      conditions: {
        daysOfWeek: rule.conditions?.daysOfWeek || [],
        timeRange: rule.conditions?.timeRange || { start: '', end: '' },
        demandThreshold: rule.conditions?.demandThreshold || null
      },
      priority: rule.priority || 0,
      isActive: rule.isActive !== false
    });
    setShowModal(true);
  }, []);

  const handleCreate = useCallback(() => {
    setEditingRule(null);
    resetForm();
    setShowModal(true);
  }, [resetForm]);

  const handleCloseModal = useCallback(() => {
    setShowModal(false);
    setEditingRule(null);
    resetForm();
  }, [resetForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: '', text: '' });

    try {
      if (editingRule) {
        await api.put(`/admin/pricing-rules/${editingRule._id}`, formData);
        setMessage({ type: 'success', text: 'Rule updated successfully!' });
      } else {
        await api.post('/admin/pricing-rules', formData);
        setMessage({ type: 'success', text: 'Rule created successfully!' });
      }

      fetchRules();
      handleCloseModal();
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to save rule' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (ruleId) => {
    if (!window.confirm('Are you sure you want to delete this pricing rule?')) return;

    try {
      await api.delete(`/admin/pricing-rules/${ruleId}`);
      setMessage({ type: 'success', text: 'Rule deleted!' });
      fetchRules();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete rule' });
    }
  };

  const toggleRuleActive = async (rule) => {
    try {
      await api.put(`/admin/pricing-rules/${rule._id}`, {
        ...rule,
        isActive: !rule.isActive
      });
      fetchRules();
    } catch (error) {
      console.error('Failed to toggle rule:', error);
    }
  };

  const toggleDay = (day) => {
    setFormData(prev => {
      const days = prev.conditions.daysOfWeek.includes(day)
        ? prev.conditions.daysOfWeek.filter(d => d !== day)
        : [...prev.conditions.daysOfWeek, day];
      return {
        ...prev,
        conditions: { ...prev.conditions, daysOfWeek: days }
      };
    });
  };

  const toggleCategory = (cat) => {
    setFormData(prev => {
      const cats = prev.categories.includes(cat)
        ? prev.categories.filter(c => c !== cat)
        : [...prev.categories, cat];
      return { ...prev, categories: cats };
    });
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getRuleTypeLabel = (type) => {
    switch (type) {
      case 'multiplier': return 'Multiply by';
      case 'fixed_add': return 'Add fixed amount';
      case 'percentage_add': return 'Add percentage';
      default: return type;
    }
  };

  const formatRuleValue = (rule) => {
    switch (rule.ruleType) {
      case 'multiplier': 
        const change = ((rule.value - 1) * 100).toFixed(0);
        return `×${rule.value} (${change >= 0 ? '+' : ''}${change}%)`;
      case 'fixed_add': return `+₹${rule.value}`;
      case 'percentage_add': return `+${rule.value}%`;
      default: return rule.value;
    }
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
          <h1 className="text-3xl font-bold text-white">Pricing Rules</h1>
          <p className="text-gray-400 mt-2">Dynamic pricing rules for different conditions</p>
        </div>
        <button onClick={handleCreate} className="btn-accent">
          + Add Rule
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

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule._id} className={`panel-card p-6 ${!rule.isActive ? 'opacity-50' : ''}`}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-xl font-semibold text-white">{rule.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    rule.isActive
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-gray-500/20 text-gray-400'
                  }`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-xs">
                    Priority: {rule.priority}
                  </span>
                </div>

                <p className="text-gray-400 text-sm mb-4">{rule.description || 'No description'}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Type</p>
                    <p className="text-white">{getRuleTypeLabel(rule.ruleType)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Value</p>
                    <p className="text-white font-mono">{formatRuleValue(rule)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Days</p>
                    <p className="text-white">
                      {rule.conditions?.daysOfWeek?.length > 0
                        ? rule.conditions.daysOfWeek.map(d => dayNames[d].slice(0, 3)).join(', ')
                        : 'All days'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time Range</p>
                    <p className="text-white">
                      {rule.conditions?.timeRange?.start
                        ? `${rule.conditions.timeRange.start} - ${rule.conditions.timeRange.end}`
                        : 'All day'}
                    </p>
                  </div>
                </div>

                {rule.categories?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {rule.categories.map((cat, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded capitalize">
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => toggleRuleActive(rule)}
                  className={`p-2 rounded-lg transition ${
                    rule.isActive ? 'bg-green-500/10 text-green-400' : 'bg-gray-700 text-gray-400'
                  }`}
                  title={rule.isActive ? 'Deactivate' : 'Activate'}
                >
                  {rule.isActive ? '✓' : '○'}
                </button>
                <button
                  onClick={() => handleEdit(rule)}
                  className="p-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg transition"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(rule._id)}
                  className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-lg transition"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {rules.length === 0 && (
        <div className="panel-card p-12 text-center">
          <div className="text-6xl mb-4">💰</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Pricing Rules</h3>
          <p className="text-gray-400 mb-6">Create pricing rules to adjust prices based on conditions.</p>
          <button onClick={handleCreate} className="btn-accent">
            + Add Rule
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
              className="relative bg-gray-900 border border-gray-700 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6 sticky top-0 bg-gray-900 pb-4 border-b border-gray-700">
                <h2 id="modal-title" className="text-2xl font-bold text-white">
                  {editingRule ? 'Edit Pricing Rule' : 'Create Pricing Rule'}
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
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rule Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Weekend Surge Pricing"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                    placeholder="Brief description of this rule"
                  />
                </div>

                {/* Rule Type & Value */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Rule Type *</label>
                    <select
                      value={formData.ruleType}
                      onChange={(e) => handleInputChange('ruleType', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    >
                      <option value="multiplier">Multiply (e.g., 1.2 = 20% increase)</option>
                      <option value="fixed_add">Add Fixed Amount (₹)</option>
                      <option value="percentage_add">Add Percentage (%)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Value *</label>
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) => handleInputChange('value', parseFloat(e.target.value) || 0)}
                      required
                      step="0.01"
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                      placeholder={formData.ruleType === 'multiplier' ? '1.2' : '10'}
                    />
                    <p className="text-gray-500 text-xs mt-1">
                      {formData.ruleType === 'multiplier' && 'Use 1.2 for 20% increase, 0.9 for 10% discount'}
                      {formData.ruleType === 'fixed_add' && 'Amount in rupees to add'}
                      {formData.ruleType === 'percentage_add' && 'Percentage to add (e.g., 15 for 15%)'}
                    </p>
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Priority</label>
                  <input
                    type="number"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 0)}
                    className="w-32 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    placeholder="0"
                  />
                  <p className="text-gray-500 text-xs mt-1">Higher priority rules are applied first</p>
                </div>

                {/* Days of Week */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Apply on Days</label>
                  <div className="flex flex-wrap gap-2">
                    {dayNames.map((day, index) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => toggleDay(index)}
                        className={`px-3 py-2 rounded-lg text-sm transition ${
                          formData.conditions.daysOfWeek.includes(index)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {day.slice(0, 3)}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Leave empty to apply all days</p>
                </div>

                {/* Time Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Time Range (Peak Hours)</label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="time"
                      value={formData.conditions.timeRange.start}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conditions: {
                          ...prev.conditions,
                          timeRange: { ...prev.conditions.timeRange, start: e.target.value }
                        }
                      }))}
                      className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                      type="time"
                      value={formData.conditions.timeRange.end}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        conditions: {
                          ...prev.conditions,
                          timeRange: { ...prev.conditions.timeRange, end: e.target.value }
                        }
                      }))}
                      className="px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Apply to Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-2 rounded-lg text-sm capitalize transition ${
                          formData.categories.includes(cat)
                            ? 'bg-purple-500 text-white'
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                        }`}
                      >
                        {cat.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                  <p className="text-gray-500 text-xs mt-1">Leave empty to apply to all categories</p>
                </div>

                {/* Active Toggle */}
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
                  <span className="text-gray-300">Rule is {formData.isActive ? 'active' : 'inactive'}</span>
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
                    {saving ? 'Saving...' : (editingRule ? 'Update Rule' : 'Create Rule')}
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

export default PricingRules;