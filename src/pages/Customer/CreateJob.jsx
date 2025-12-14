// frontend/src/pages/Customer/CreateJob.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useJobs } from '../../context/JobContext';
import api from '../../services/api';

const CreateJob = () => {
  const navigate = useNavigate();
  const { createJob } = useJobs();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'plumbing',
    address: '',
    city: '',
    coordinates: null,
    scheduledDate: '',
    timeSlot: '',
    estimatedPrice: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const searchTimeout = useRef(null);

  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [pricing, setPricing] = useState(null);
  const [loadingPrice, setLoadingPrice] = useState(false);

  const categories = [
    { value: 'plumbing', label: 'Plumbing', icon: '🔧', basePrice: 499 },
    { value: 'electrical', label: 'Electrical', icon: '⚡', basePrice: 599 },
    { value: 'cleaning', label: 'Cleaning', icon: '🧹', basePrice: 399 },
    { value: 'painting', label: 'Painting', icon: '🎨', basePrice: 199 },
    { value: 'carpentry', label: 'Carpentry', icon: '🪚', basePrice: 698 },
    { value: 'appliance', label: 'Appliance', icon: '🔌', basePrice: 599 },
    { value: 'other', label: 'Other', icon: '📦', basePrice: 490 }
  ];

  const defaultTimeSlots = [
    { time: '08:00', display: '8:00 AM', isPeak: true },
    { time: '09:00', display: '9:00 AM', isPeak: true },
    { time: '10:00', display: '10:00 AM', isPeak: false },
    { time: '11:00', display: '11:00 AM', isPeak: false },
    { time: '12:00', display: '12:00 PM', isPeak: false },
    { time: '13:00', display: '1:00 PM', isPeak: false },
    { time: '14:00', display: '2:00 PM', isPeak: false },
    { time: '15:00', display: '3:00 PM', isPeak: false },
    { time: '16:00', display: '4:00 PM', isPeak: false },
    { time: '17:00', display: '5:00 PM', isPeak: true },
    { time: '18:00', display: '6:00 PM', isPeak: true }
  ];

  useEffect(() => {
    fetchAvailableDates();
  }, [formData.category]);

  useEffect(() => {
    if (formData.scheduledDate) {
      fetchTimeSlots();
    }
  }, [formData.scheduledDate]);

  useEffect(() => {
    if (formData.scheduledDate && formData.timeSlot) {
      calculatePrice();
    }
  }, [formData.scheduledDate, formData.timeSlot, formData.category, formData.coordinates]);

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      dates.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isAvailable: true
      });
    }
    return dates;
  };

  const fetchAvailableDates = async () => {
    setLoadingDates(true);
    try {
      // Fixed: Use proper template literal
      const response = await api.get(`/availability/dates?days=30&category=${formData.category}`);
      if (response.data.data) {
        setAvailableDates(response.data.data);
      } else {
        setAvailableDates(generateDates());
      }
    } catch (error) {
      console.log('Using default dates');
      setAvailableDates(generateDates());
    } finally {
      setLoadingDates(false);
    }
  };

  const fetchTimeSlots = async () => {
    setLoadingSlots(true);
    try {
      const response = await api.get(`/availability/${formData.scheduledDate}?category=${formData.category}`);
      if (response.data.data?.slots) {
        setTimeSlots(response.data.data.slots);
      } else {
        const selectedDate = new Date(formData.scheduledDate);
        const now = new Date();
        const isToday = selectedDate.toDateString() === now.toDateString();
        setTimeSlots(defaultTimeSlots.map(slot => ({
          ...slot,
          isAvailable: !isToday || parseInt(slot.time) > now.getHours()
        })));
      }
    } catch (error) {
      console.log('Using default time slots');
      setTimeSlots(defaultTimeSlots.map(slot => ({ ...slot, isAvailable: true })));
    } finally {
      setLoadingSlots(false);
    }
  };

  const calculatePrice = async () => {
    setLoadingPrice(true);

    // Calculate locally (since backend pricing route may not exist)
    const baseCategory = categories.find(c => c.value === formData.category);
    const basePrice = baseCategory?.basePrice || 499;

    const selectedDate = new Date(formData.scheduledDate);
    const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
    const isPeakHour = ['08:00', '09:00', '17:00', '18:00'].includes(formData.timeSlot);

    let total = basePrice;
    const modifiers = [];

    if (isWeekend) {
      const weekendSurge = basePrice * 0.2;
      modifiers.push({ name: 'Weekend Surge', amount: weekendSurge });
      total += weekendSurge;
    }

    if (isPeakHour) {
      modifiers.push({ name: 'Peak Hour', amount: 50 });
      total += 50;
    }

    const tax = total * 0.18; // 18% GST
    total += tax;

    setPricing({
      breakdown: {
        basePrice,
        modifiers,
        tax: Math.round(tax * 100) / 100,
        total: Math.round(total * 100) / 100
      }
    });

    setLoadingPrice(false);
  };

  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&countrycodes=in`
      );
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => searchAddress(query), 500);
  };

  const selectSearchResult = (result) => {
    const address = result.display_name;
    const parts = address.split(', ');
    const city = parts.length > 2 ? parts[parts.length - 3] : '';

    setFormData({
      ...formData,
      address: address,
      city: city,
      coordinates: [parseFloat(result.lon), parseFloat(result.lat)]
    });
    setSearchQuery(address);
    setSearchResults([]);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await response.json();
          if (data.display_name) {
            const parts = data.display_name.split(', ');
            const city = parts.length > 2 ? parts[parts.length - 3] : '';
            setFormData({
              ...formData,
              address: data.display_name,
              city: city,
              coordinates: [lng, lat]
            });
            setSearchQuery(data.display_name);
          }
        } catch (error) {
          console.error('Reverse geocode error:', error);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Unable to get your location. Please search manually.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.address) {
      setError('Please select a location');
      setIsLoading(false);
      return;
    }
    if (!formData.scheduledDate) {
      setError('Please select a date');
      setIsLoading(false);
      return;
    }
    if (!formData.timeSlot) {
      setError('Please select a time slot');
      setIsLoading(false);
      return;
    }

    const selectedCategory = categories.find(c => c.value === formData.category);

    const jobData = {
      title: formData.title || `${selectedCategory?.label} Service`,
      description: formData.description || `${selectedCategory?.label} service request`,
      category: formData.category,
      location: {
        address: formData.address,
        city: formData.city
      },
      scheduledDate: formData.scheduledDate,
      // Fixed: Send timeSlot as object with time property
      timeSlot: {
        time: formData.timeSlot
      },
      estimatedPrice: pricing?.breakdown?.total || selectedCategory?.basePrice || 0
    };

    // Add coordinates if available
    if (formData.coordinates) {
      jobData.location.coordinates = {
        lat: formData.coordinates[1],
        lng: formData.coordinates[0]
      };
    }

    const result = await createJob(jobData);

    if (result.success) {
      navigate('/customer/history');
    } else {
      setError(result.message || 'Failed to create job');
    }

    setIsLoading(false);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1: return formData.category && formData.address;
      case 2: return formData.scheduledDate && formData.timeSlot;
      case 3: return true;
      default: return false;
    }
  };

  const formatTimeSlot = (time) => {
    if (!time) return '';
    const [hours] = time.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hour12 = hours % 12 || 12;
    return `${hour12}:00 ${ampm}`;
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Book a Service</h1>
        <p className="text-gray-400 mt-2">Complete the steps below to request a service</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {[
          { num: 1, label: 'Service & Location' },
          { num: 2, label: 'Date & Time' },
          { num: 3, label: 'Review & Confirm' }
        ].map((step, index) => (
          <div key={step.num} className="flex items-center flex-1">
            <div className="flex items-center">
              <button
                onClick={() => step.num < currentStep && setCurrentStep(step.num)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition ${currentStep >= step.num
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-800 text-gray-500'
                  } ${step.num < currentStep ? 'cursor-pointer hover:bg-purple-600' : ''}`}
              >
                {currentStep > step.num ? '✓' : step.num}
              </button>
              <span className={`ml-3 hidden sm:block ${currentStep >= step.num ? 'text-white' : 'text-gray-500'
                }`}>
                {step.label}
              </span>
            </div>
            {index < 2 && (
              <div className={`flex-1 h-1 mx-4 rounded ${currentStep > step.num ? 'bg-purple-500' : 'bg-gray-800'
                }`}></div>
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* STEP 1: Service & Location */}
          {currentStep === 1 && (
            <>
              {/* Category Selection */}
              <div className="panel-card p-6">
                <label className="block text-lg font-semibold text-white mb-4">
                  Select Service Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {categories.map((cat) => (
                    <label
                      key={cat.value}
                      className={`relative cursor-pointer rounded-lg border p-4 transition text-center hover:bg-white/5 ${formData.category === cat.value
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-700'
                        }`}
                    >
                      <input
                        type="radio"
                        name="category"
                        value={cat.value}
                        checked={formData.category === cat.value}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <span className="text-3xl">{cat.icon}</span>
                      <p className="text-sm font-medium text-gray-300 mt-2">{cat.label}</p>
                      <p className="text-xs text-purple-400 mt-1">From ₹{cat.basePrice}</p>
                    </label>
                  ))}
                </div>
              </div>

              {/* Location Selection */}
              <div className="panel-card p-6">
                <label className="block text-lg font-semibold text-white mb-4">
                  📍 Service Location *
                </label>

                <div className="relative mb-4">
                  <div className="flex space-x-2">
                    <div className="relative flex-1">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</div>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search for your address..."
                        className="input pl-10 pr-10"
                      />
                      {isSearching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <div className="animate-spin h-5 w-5 border-2 border-purple-500 border-t-transparent rounded-full"></div>
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={getCurrentLocation}
                      disabled={isLocating}
                      className="btn-secondary px-4"
                      title="Use current location"
                    >
                      {isLocating ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : '📍'}
                    </button>
                  </div>

                  {searchResults.length > 0 && (
                    <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => selectSearchResult(result)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-700 transition border-b border-gray-700 last:border-0"
                        >
                          <p className="text-white text-sm truncate">{result.display_name}</p>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {formData.address ? (
                  <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <span className="text-green-400 text-xl">✓</span>
                      <div className="flex-1">
                        <p className="text-green-400 text-sm font-medium">Location Selected</p>
                        <p className="text-gray-300 text-sm mt-1">{formData.address}</p>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, address: '', city: '', coordinates: null });
                            setSearchQuery('');
                          }}
                          className="text-purple-400 text-sm mt-2 hover:text-purple-300"
                        >
                          Change location
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 bg-gray-800/50 rounded-lg text-center">
                    <div className="text-5xl mb-4 opacity-50">🗺️</div>
                    <p className="text-gray-400">Search above or use current location</p>
                  </div>
                )}
              </div>

              {/* Job Details */}
              <div className="panel-card p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Additional Details (Optional)</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Job Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      className="input"
                      placeholder="e.g., Fix leaking kitchen faucet"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="input resize-none"
                      placeholder="Describe the issue or service you need..."
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* STEP 2: Date & Time */}
          {currentStep === 2 && (
            <>
              <div className="panel-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">📅 Select Date</h3>

                {loadingDates ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {(availableDates.length > 0 ? availableDates : generateDates()).slice(0, 14).map((dateInfo) => {
                      const isSelected = formData.scheduledDate === dateInfo.date;
                      const isAvailable = dateInfo.isAvailable !== false;

                      return (
                        <button
                          key={dateInfo.date}
                          type="button"
                          onClick={() => isAvailable && setFormData({ ...formData, scheduledDate: dateInfo.date, timeSlot: '' })}
                          disabled={!isAvailable}
                          className={`p-3 rounded-lg text-center transition ${isSelected
                              ? 'bg-purple-500 text-white ring-2 ring-purple-400'
                              : isAvailable
                                ? 'bg-gray-800 text-white hover:bg-gray-700'
                                : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                            } ${dateInfo.isWeekend && isAvailable ? 'border border-yellow-500/30' : ''}`}
                        >
                          <div className="text-xs opacity-70">{dateInfo.dayName}</div>
                          <div className="text-lg font-bold">{dateInfo.dayNumber}</div>
                          <div className="text-xs opacity-70">{dateInfo.month}</div>
                          {dateInfo.isWeekend && isAvailable && (
                            <div className="text-xs text-yellow-400 mt-1">+20%</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {formData.scheduledDate && (
                <div className="panel-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">🕐 Select Time Slot</h3>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {(timeSlots.length > 0 ? timeSlots : defaultTimeSlots.map(s => ({ ...s, isAvailable: true }))).map((slot) => {
                        const isSelected = formData.timeSlot === slot.time;
                        const isAvailable = slot.isAvailable !== false;

                        return (
                          <button
                            key={slot.time}
                            type="button"
                            onClick={() => isAvailable && setFormData({ ...formData, timeSlot: slot.time })}
                            disabled={!isAvailable}
                            className={`p-4 rounded-lg text-center transition ${isSelected
                                ? 'bg-cyan-500 text-white ring-2 ring-cyan-400'
                                : isAvailable
                                  ? 'bg-gray-800 text-white hover:bg-gray-700'
                                  : 'bg-gray-900 text-gray-600 cursor-not-allowed line-through'
                              }`}
                          >
                            <div className="font-semibold">{slot.display || formatTimeSlot(slot.time)}</div>
                            {slot.isPeak && isAvailable && (
                              <div className="text-xs text-yellow-400 mt-1">Peak</div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {/* STEP 3: Review */}
          {currentStep === 3 && (
            <div className="panel-card p-6">
              <h3 className="text-lg font-semibold text-white mb-6">📋 Booking Summary</h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-3xl">{categories.find(c => c.value === formData.category)?.icon}</span>
                  <div>
                    <h4 className="text-white font-medium">{categories.find(c => c.value === formData.category)?.label} Service</h4>
                    {formData.title && <p className="text-gray-400 text-sm">{formData.title}</p>}
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-3xl">📍</span>
                  <div>
                    <h4 className="text-white font-medium">Location</h4>
                    <p className="text-gray-400 text-sm">{formData.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <span className="text-3xl">📅</span>
                  <div>
                    <h4 className="text-white font-medium">Date & Time</h4>
                    <p className="text-gray-400 text-sm">
                      {new Date(formData.scheduledDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {formatTimeSlot(formData.timeSlot)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Price */}
        <div className="lg:col-span-1">
          <div className="panel-card p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Price Summary</h3>

            {pricing ? (
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Base Service</span>
                  <span>₹{pricing.breakdown?.basePrice}</span>
                </div>

                {pricing.breakdown?.modifiers?.map((mod, index) => (
                  <div key={index} className="flex justify-between text-gray-400 text-sm">
                    <span>{mod.name}</span>
                    <span className="text-yellow-400">+₹{mod.amount?.toFixed(0)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-gray-400 text-sm">
                  <span>GST (18%)</span>
                  <span>₹{pricing.breakdown?.tax?.toFixed(0)}</span>
                </div>

                <div className="border-t border-gray-700 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="gradient-text">₹{pricing.breakdown?.total?.toFixed(0)}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Base Service</span>
                  <span>₹{categories.find(c => c.value === formData.category)?.basePrice}</span>
                </div>
                <p className="text-gray-500 text-sm">Select date & time for final price</p>
              </div>
            )}

            <div className="mt-6 space-y-3">
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceedToNext()}
                  className="w-full btn-accent disabled:opacity-50"
                >
                  Continue
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full btn-accent flex items-center justify-center"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    `Confirm Booking - ₹${pricing?.breakdown?.total?.toFixed(0) || categories.find(c => c.value === formData.category)?.basePrice}`
                  )}
                </button>
              )}

              {currentStep > 1 && (
                <button type="button" onClick={() => setCurrentStep(currentStep - 1)} className="w-full btn-secondary">
                  Back
                </button>
              )}

              <button type="button" onClick={() => navigate('/customer')} className="w-full text-gray-400 hover:text-white text-sm py-2">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;