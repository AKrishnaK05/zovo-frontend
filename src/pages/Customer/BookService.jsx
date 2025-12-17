// frontend/src/pages/Customer/BookService.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../services/api';
import LocationPicker from '../../components/maps/LocationPicker';
import { useData } from '../../context/DataContext';
import {
  Wrench, Zap, SprayCan, Paintbrush, Hammer, Plug, Snowflake, Bug, Scissors, Truck,
  Package, Search, Check, AlertTriangle, X, MapPin, Calendar, Clock, ArrowLeft,
  ChevronRight, ClipboardList
} from 'lucide-react';

const BookService = () => {
  const { category: categorySlug } = useParams();
  const navigate = useNavigate();
  const { refreshJobs } = useData();

  // Fallback categories data
  const FALLBACK_CATEGORIES = [
    {
      slug: 'plumbing',
      name: 'Plumbing',
      icon: <Wrench size={32} />,
      basePrice: 499,
      minDuration: 60,
      subServices: [
        { name: 'Tap Repair', price: 199, duration: 30 },
        { name: 'Pipe Leakage', price: 399, duration: 60 },
        { name: 'Water Tank Cleaning', price: 999, duration: 120 }
      ]
    },
    {
      slug: 'electrical',
      name: 'Electrical',
      icon: <Zap size={32} />,
      basePrice: 599,
      minDuration: 60,
      subServices: [
        { name: 'Fan Installation', price: 299, duration: 45 },
        { name: 'Switch Replacement', price: 149, duration: 20 },
        { name: 'MCB Change', price: 499, duration: 60 }
      ]
    },
    {
      slug: 'cleaning',
      name: 'Cleaning',
      icon: <SprayCan size={32} />,
      basePrice: 399,
      minDuration: 120,
      subServices: [
        { name: 'Bathroom Cleaning', price: 499, duration: 60 },
        { name: 'Kitchen Deep Clean', price: 999, duration: 120 },
        { name: 'Full Home Clean', price: 2999, duration: 240 }
      ]
    },
    {
      slug: 'painting',
      name: 'Painting',
      icon: <Paintbrush size={32} />,
      basePrice: 1999,
      minDuration: 240,
      subServices: [
        { name: 'Single Room', price: 2500, duration: 240 },
        { name: 'Wall Touchup', price: 999, duration: 120 }
      ]
    },
    {
      slug: 'carpentry',
      name: 'Carpentry',
      icon: <Hammer size={32} />,
      basePrice: 699,
      minDuration: 60,
      subServices: [
        { name: 'Lock Repair', price: 299, duration: 30 },
        { name: 'Furniture Assembly', price: 599, duration: 90 }
      ]
    },
    {
      slug: 'appliance',
      name: 'Appliance Repair',
      icon: <Plug size={32} />,
      basePrice: 599,
      minDuration: 60,
      subServices: [
        { name: 'Washing Machine Check', price: 399, duration: 45 },
        { name: 'Refrigerator Check', price: 499, duration: 45 }
      ]
    },
    {
      slug: 'ac-service',
      name: 'AC Service',
      icon: <Snowflake size={32} />,
      basePrice: 799,
      minDuration: 60,
      subServices: [
        { name: 'AC Service (Split)', price: 599, duration: 60 },
        { name: 'AC Service (Window)', price: 499, duration: 60 },
        { name: 'Gas Filling', price: 2499, duration: 60 }
      ]
    },
    {
      slug: 'pest-control',
      name: 'Pest Control',
      icon: <Bug size={32} />,
      basePrice: 899,
      minDuration: 60,
      subServices: [
        { name: 'Cockroach Control', price: 599, duration: 60 },
        { name: 'Mosquito Control', price: 499, duration: 45 },
        { name: 'Termite Control', price: 1499, duration: 120 }
      ]
    },
    {
      slug: 'salon',
      name: 'Home Salon',
      icon: <Scissors size={32} />,
      basePrice: 499,
      minDuration: 45,
      subServices: [
        { name: 'Haircut', price: 299, duration: 30 },
        { name: 'Facial', price: 599, duration: 45 },
        { name: 'Manicure & Pedicure', price: 799, duration: 60 }
      ]
    },
    {
      slug: 'men-grooming',
      name: "Men's Grooming",
      icon: <Scissors size={32} />,
      basePrice: 399,
      minDuration: 30,
      subServices: [
        { name: 'Haircut', price: 199, duration: 30 },
        { name: 'Beard Trim', price: 99, duration: 15 },
        { name: 'Head Massage', price: 149, duration: 20 }
      ]
    },
    {
      slug: 'movers',
      name: 'Packers & Movers',
      icon: <Truck size={32} />,
      basePrice: 2999,
      minDuration: 180,
      subServices: [
        { name: '1 BHK Moving', price: 2999, duration: 180 },
        { name: '2 BHK Moving', price: 4999, duration: 240 },
        { name: '3 BHK Moving', price: 7999, duration: 360 }
      ]
    },
    {
      slug: 'other',
      name: 'Other',
      icon: <Package size={32} />,
      basePrice: 499,
      minDuration: 60,
      subServices: []
    }
  ];

  // Default time slots
  const DEFAULT_TIME_SLOTS = [
    { time: '09:00', displayTime: '09:00 AM', isAvailable: true, isPeakHour: true },
    { time: '10:00', displayTime: '10:00 AM', isAvailable: true, isPeakHour: false },
    { time: '11:00', displayTime: '11:00 AM', isAvailable: true, isPeakHour: false },
    { time: '12:00', displayTime: '12:00 PM', isAvailable: true, isPeakHour: false },
    { time: '13:00', displayTime: '01:00 PM', isAvailable: true, isPeakHour: false },
    { time: '14:00', displayTime: '02:00 PM', isAvailable: true, isPeakHour: false },
    { time: '15:00', displayTime: '03:00 PM', isAvailable: true, isPeakHour: false },
    { time: '16:00', displayTime: '04:00 PM', isAvailable: true, isPeakHour: false },
    { time: '17:00', displayTime: '05:00 PM', isAvailable: true, isPeakHour: false },
    { time: '18:00', displayTime: '06:00 PM', isAvailable: true, isPeakHour: true }
  ];

  // Step state
  const [currentStep, setCurrentStep] = useState(1);

  // Data states
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form states
  const [selectedSubServices, setSelectedSubServices] = useState([]);
  const [location, setLocation] = useState({
    address: '',
    city: '',
    coordinates: null
  });
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');

  // Calendar & Pricing states
  const [availableDates, setAvailableDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loadingPrice, setLoadingPrice] = useState(false);

  // Fetch category on mount
  useEffect(() => {
    fetchCategory();
    fetchAvailableDates();
  }, [categorySlug]);

  // Fetch time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setSelectedSlot('');
      fetchTimeSlots();
    } else {
      setTimeSlots([]);
    }
  }, [selectedDate, categorySlug]);

  // Calculate price when relevant data changes
  useEffect(() => {
    if (selectedDate && selectedSlot && category) {
      calculatePrice();
    }
  }, [selectedDate, selectedSlot, selectedSubServices, location.coordinates, category]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return location.address && location.address.length > 0;
      case 2:
        return selectedDate && selectedSlot;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const fetchCategory = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/pricing/categories/${categorySlug}`);
      if (response.data && response.data.data) {
        setCategory(response.data.data);
      } else {
        throw new Error('API returned empty');
      }
    } catch (error) {
      console.warn('Using fallback category for:', categorySlug);
      const fallback = FALLBACK_CATEGORIES.find(c => c.slug === categorySlug);
      if (fallback) {
        setCategory(fallback);
      } else {
        setCategory({
          slug: categorySlug,
          name: categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1).replace(/-/g, ' '),
          icon: <Wrench size={32} />,
          basePrice: 499,
          minDuration: 60,
          subServices: []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dayOfWeek = date.getDay();
      dates.push({
        date: date.toISOString().split('T')[0],
        dayName: date.toLocaleDateString('en-IN', { weekday: 'short' }),
        dayNumber: date.getDate(),
        month: date.toLocaleDateString('en-IN', { month: 'short' }),
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
        isAvailable: true
      });
    }
    return dates;
  };

  const fetchAvailableDates = async () => {
    try {
      const response = await api.get(`/availability/dates`, {
        params: { days: 30, category: categorySlug }
      });
      if (response.data?.data && response.data.data.length > 0) {
        setAvailableDates(response.data.data);
      } else {
        setAvailableDates(generateDates());
      }
    } catch (error) {
      console.warn('Using generated dates');
      setAvailableDates(generateDates());
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedDate) return;

    console.log('Fetching slots for:', { categorySlug, selectedDate });

    setLoadingSlots(true);
    setTimeSlots([]);

    try {
      const response = await api.get(`/availability/slots`, {
        params: { date: selectedDate, category: categorySlug }
      });

      console.log('Slots API response:', response.data);

      if (response.data?.data && response.data.data.length > 0) {
        setTimeSlots(response.data.data);
      } else {
        console.log('Empty API response, using default slots');
        setTimeSlots(DEFAULT_TIME_SLOTS);
      }
    } catch (error) {
      console.warn('Slots API error, using defaults:', error.message);
      setTimeSlots(DEFAULT_TIME_SLOTS);
    } finally {
      setLoadingSlots(false);
    }
  };

  const calculatePrice = () => {
    if (!category) return;

    setLoadingPrice(true);

    const base = category.basePrice || 499;
    const subServicesTotal = selectedSubServices.reduce(
      (acc, s) => acc + (s.price * (s.quantity || 1)),
      0
    );
    let currentTotal = base + subServicesTotal;
    const modifiers = [];

    // Weekend surge
    const selectedDateObj = new Date(selectedDate);
    const dayOfWeek = selectedDateObj.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      const surge = currentTotal * 0.1;
      modifiers.push({ name: 'Weekend Surge', amount: surge, type: 'weekend' });
      currentTotal += surge;
    }

    // Peak hour charge
    if (['09:00', '18:00'].includes(selectedSlot)) {
      modifiers.push({ name: 'Peak Hour', amount: 50, type: 'peak_hour' });
      currentTotal += 50;
    }

    const travelFee = 49;
    const tax = currentTotal * 0.18;
    const finalTotal = currentTotal + tax + travelFee;

    setPricing({
      breakdown: {
        basePrice: base,
        subServices: subServicesTotal,
        modifiers,
        travelFee,
        subtotal: currentTotal,
        tax,
        total: finalTotal
      }
    });

    setLoadingPrice(false);
  };

  const toggleSubService = (subService) => {
    setSelectedSubServices(prev => {
      const exists = prev.find(s => s.name === subService.name);
      if (exists) {
        return prev.filter(s => s.name !== subService.name);
      } else {
        return [...prev, { ...subService, quantity: 1 }];
      }
    });
  };

  const updateSubServiceQuantity = (name, quantity) => {
    setSelectedSubServices(prev =>
      prev.map(s => s.name === name ? { ...s, quantity: Math.max(1, quantity) } : s)
    );
  };

  const handleLocationSelect = (locationData) => {
    setLocation({
      address: locationData.address || '',
      city: locationData.city || '',
      coordinates: locationData.coordinates || null
    });
  };

  const handleSubmit = async () => {
    if (!location.address || !selectedDate || !selectedSlot) {
      setError('Please complete all required fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const jobData = {
        title: `${category.name} Service`,
        description: selectedSubServices.length > 0
          ? `Services: ${selectedSubServices.map(s => `${s.name} (x${s.quantity || 1})`).join(', ')}`
          : `${category.name} service request`,
        category: categorySlug,
        subServices: selectedSubServices.map(s => ({
          name: s.name,
          price: s.price,
          quantity: s.quantity || 1
        })),
        location: {
          address: location.address,
          city: location.city || '',
          lat: location.coordinates?.lat || location.coordinates?.[1] || 0,
          lng: location.coordinates?.lng || location.coordinates?.[0] || 0
        },
        scheduledDate: selectedDate,
        timeSlot: {
          time: selectedSlot
        },
        customerNotes: customerNotes || '',
        estimatedPrice: Math.round(pricing?.breakdown?.total || category.basePrice || 0)
      };

      console.log('Submitting job:', jobData);

      const response = await api.post('/jobs', jobData);
      console.log('Job created:', response.data);

      navigate('/customer/history');
    } catch (error) {
      console.error('Booking error:', error.response?.data || error);
      setError(
        error.response?.data?.error ||
        error.response?.data?.message ||
        'Failed to create booking. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading service...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!category) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4"><Search size={64} className="text-gray-600" /></div>
        <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
        <p className="text-gray-400 mb-4">The service you're looking for doesn't exist.</p>
        <Link to="/customer" className="text-purple-400 hover:text-purple-300 flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link to="/customer" className="text-gray-400 hover:text-white text-sm mb-4 inline-flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Services
        </Link>
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center text-4xl">
            {category.icon}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
            <p className="text-gray-400">Book your service in 3 easy steps</p>
          </div>
        </div>
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
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${currentStep >= step.num
                ? 'bg-purple-500 text-white'
                : 'bg-gray-800 text-gray-500'
                }`}>
                {currentStep > step.num ? <Check size={20} /> : step.num}
              </div>
              <span className={`ml-3 hidden sm:block transition-colors ${currentStep >= step.num ? 'text-white' : 'text-gray-500'
                }`}>
                {step.label}
              </span>
            </div>
            {index < 2 && (
              <div className={`flex-1 h-1 mx-4 rounded transition-colors ${currentStep > step.num ? 'bg-purple-500' : 'bg-gray-800'
                }`} />
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center">
          <AlertTriangle className="mr-2" size={20} />
          {error}
          <button
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-300"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Step Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Step 1: Service & Location */}
          {currentStep === 1 && (
            <>
              {/* Sub-services Selection */}
              {category.subServices && category.subServices.length > 0 && (
                <div className="panel-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Select Services (Optional)
                  </h3>
                  <div className="space-y-3">
                    {category.subServices.map((subService) => {
                      const selected = selectedSubServices.find(s => s.name === subService.name);
                      return (
                        <div
                          key={subService.name}
                          className={`p-4 rounded-lg border transition cursor-pointer ${selected
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-gray-700 hover:border-gray-600'
                            }`}
                          onClick={() => toggleSubService(subService)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selected ? 'bg-purple-500 border-purple-500' : 'border-gray-600'
                                }`}>
                                {selected && <Check size={14} className="text-white" />}
                              </div>
                              <div>
                                <p className="text-white font-medium">{subService.name}</p>
                                <p className="text-gray-500 text-sm">{subService.duration} mins</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              {selected && (
                                <div
                                  className="flex items-center space-x-2"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <button
                                    onClick={() => updateSubServiceQuantity(
                                      subService.name,
                                      (selected.quantity || 1) - 1
                                    )}
                                    className="w-8 h-8 rounded bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
                                    disabled={selected.quantity <= 1}
                                  >
                                    -
                                  </button>
                                  <span className="text-white w-8 text-center">
                                    {selected.quantity || 1}
                                  </span>
                                  <button
                                    onClick={() => updateSubServiceQuantity(
                                      subService.name,
                                      (selected.quantity || 1) + 1
                                    )}
                                    className="w-8 h-8 rounded bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                              <span className="text-purple-400 font-bold">₹{subService.price}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Location Selection */}
              <div className="panel-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <MapPin size={20} className="inline mr-2" /> Service Location
                </h3>
                <LocationPicker
                  onLocationSelect={handleLocationSelect}
                  showSearch={true}
                  height="300px"
                />
                {location.address && (
                  <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-green-400 text-sm flex items-center">
                      <Check size={16} className="mr-2" /> Location selected: {location.address}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Step 2: Date & Time */}
          {currentStep === 2 && (
            <>
              {/* Date Selection */}
              <div className="panel-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  <Calendar size={20} className="inline mr-2" /> Select Date
                </h3>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {availableDates.slice(0, 14).map((dateInfo) => {
                    const isSelected = selectedDate === dateInfo.date;
                    const isAvailable = dateInfo.isAvailable !== false;

                    return (
                      <button
                        key={dateInfo.date}
                        onClick={() => isAvailable && setSelectedDate(dateInfo.date)}
                        disabled={!isAvailable}
                        className={`p-3 rounded-lg text-center transition ${isSelected
                          ? 'bg-purple-500 text-white ring-2 ring-purple-400'
                          : isAvailable
                            ? 'bg-gray-800 text-white hover:bg-gray-700'
                            : 'bg-gray-900 text-gray-600 cursor-not-allowed'
                          } ${dateInfo.isWeekend && isAvailable ? 'border border-yellow-500/30' : ''}`}
                      >
                        <div className="text-xs text-gray-400">{dateInfo.dayName}</div>
                        <div className="text-lg font-bold">{dateInfo.dayNumber}</div>
                        <div className="text-xs">{dateInfo.month}</div>
                        {dateInfo.isWeekend && isAvailable && (
                          <div className="text-xs text-yellow-400 mt-1">+10%</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Time Slot Selection */}
              {selectedDate && (
                <div className="panel-card p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    <Clock size={20} className="inline mr-2" /> Select Time Slot
                  </h3>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
                      <span className="ml-3 text-gray-400">Loading available slots...</span>
                    </div>
                  ) : timeSlots.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400">No time slots available for this date.</p>
                      <button
                        onClick={fetchTimeSlots}
                        className="mt-2 text-purple-400 hover:text-purple-300"
                      >
                        Try again
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {timeSlots.map((slot) => {
                        const isSelected = selectedSlot === slot.time;
                        const isAvailable = slot.isAvailable !== false;

                        return (
                          <button
                            key={slot.time}
                            onClick={() => isAvailable && setSelectedSlot(slot.time)}
                            disabled={!isAvailable}
                            className={`p-4 rounded-lg text-center transition relative ${isSelected
                              ? 'bg-purple-500 text-white ring-2 ring-purple-400'
                              : isAvailable
                                ? 'bg-gray-800 text-white hover:bg-gray-700'
                                : 'bg-gray-900 text-gray-600 cursor-not-allowed line-through'
                              }`}
                          >
                            <div className="font-semibold">{slot.displayTime}</div>
                            {slot.isPeakHour && isAvailable && (
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

          {/* Step 3: Review & Confirm */}
          {currentStep === 3 && (
            <div className="panel-card p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                <ClipboardList size={20} className="inline mr-2" /> Booking Summary
              </h3>

              <div className="space-y-4">
                {/* Service Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/20 flex items-center justify-center text-2xl">
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-medium">{category.name}</h4>
                    {selectedSubServices.length > 0 ? (
                      <div className="mt-2 space-y-1">
                        {selectedSubServices.map((sub) => (
                          <p key={sub.name} className="text-gray-400 text-sm flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span> {sub.name} {sub.quantity > 1 ? `x${sub.quantity}` : ''} - ₹{sub.price * (sub.quantity || 1)}
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-400 text-sm mt-1">Base service</p>
                    )}
                  </div>
                </div>

                {/* Location Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Service Location</h4>
                    <p className="text-gray-400 text-sm">{location.address}</p>
                  </div>
                </div>

                {/* Date & Time Info */}
                <div className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg">
                  <div className="w-12 h-12 rounded-lg bg-green-500/20 flex items-center justify-center text-green-400">
                    <Calendar size={24} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Date & Time</h4>
                    <p className="text-gray-400 text-sm">
                      {new Date(selectedDate).toLocaleDateString('en-IN', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })} at {timeSlots.find(s => s.time === selectedSlot)?.displayTime || selectedSlot}
                    </p>
                  </div>
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Special Instructions (Optional)
                </label>
                <textarea
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                  placeholder="Any specific instructions for the service provider..."
                />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar - Price Summary */}
        <div className="lg:col-span-1">
          <div className="panel-card p-6 sticky top-6">
            <h3 className="text-lg font-semibold text-white mb-4">Price Summary</h3>

            {loadingPrice ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-purple-500"></div>
              </div>
            ) : pricing ? (
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Base Service</span>
                  <span>₹{pricing.breakdown.basePrice.toFixed(2)}</span>
                </div>

                {pricing.breakdown.subServices > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Additional Services</span>
                    <span>₹{pricing.breakdown.subServices.toFixed(2)}</span>
                  </div>
                )}

                {pricing.breakdown.modifiers.map((mod, index) => (
                  <div key={index} className="flex justify-between text-gray-400 text-sm">
                    <span>{mod.name}</span>
                    <span className="text-yellow-400">+₹{mod.amount.toFixed(2)}</span>
                  </div>
                ))}

                <div className="flex justify-between text-gray-300">
                  <span>Travel Fee</span>
                  <span>₹{pricing.breakdown.travelFee.toFixed(2)}</span>
                </div>

                <div className="flex justify-between text-gray-400 text-sm">
                  <span>Tax (18% GST)</span>
                  <span>₹{pricing.breakdown.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-gray-700 pt-3 mt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Total</span>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                      ₹{pricing.breakdown.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between text-gray-300">
                  <span>Base Service</span>
                  <span>₹{category.basePrice}</span>
                </div>
                {selectedSubServices.length > 0 && (
                  <div className="flex justify-between text-gray-300">
                    <span>Additional Services</span>
                    <span>
                      ₹{selectedSubServices.reduce((acc, s) => acc + (s.price * (s.quantity || 1)), 0)}
                    </span>
                  </div>
                )}
                <div className="border-t border-gray-700 pt-3">
                  <p className="text-gray-500 text-sm">
                    Select date & time to see final price
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-6 space-y-3">
              {currentStep < 3 ? (
                <button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={!canProceed()}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-semibold rounded-lg hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white mr-2"></div>
                      Booking...
                    </>
                  ) : (
                    `Confirm Booking - ₹${pricing?.breakdown.total.toFixed(0) || category.basePrice}`
                  )}
                </button>
              )}

              {currentStep > 1 && (
                <button
                  onClick={() => setCurrentStep(currentStep - 1)}
                  className="w-full py-3 px-4 bg-gray-800 text-white font-semibold rounded-lg hover:bg-gray-700 transition"
                >
                  Back
                </button>
              )}
            </div>

            {/* Help Text */}
            <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
              <p className="text-gray-400 text-xs text-center">
                🔒 Secure booking • Free cancellation up to 2 hours before service
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;