// frontend/src/pages/Auth/Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Wrench, Zap, SprayCan, Paintbrush, Hammer, Plug, Snowflake, Bug,
  Scissors, Truck, Sprout, Shirt, ChefHat, Shield, Laptop, Smartphone,
  Car, Camera, BookOpen, Dumbbell, HeartHandshake, Package,
  User, Eye, EyeOff, AlertTriangle, Check, ArrowRight, Rocket, ChevronLeft
} from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/zovo_logo.png';

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    securityQuestion: '',
    securityAnswer: '',
    role: 'customer',
    serviceCategories: []
  });
  const [googleData, setGoogleData] = useState(null);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, loginWithGoogle: authLoginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const SECURITY_QUESTIONS = [
    "What was the name of your first pet?",
    "What is your mother's maiden name?",
    "What was the name of your first school?",
    "What is your favorite food?",
    "What city were you born in?"
  ];

  const signupWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Register: Google Success', tokenResponse);
      try {
        setLoading(true);
        // Pass the selected role (or default 'customer')
        const result = await authLoginWithGoogle(tokenResponse.access_token, formData.role);

        if (result.success) {
          console.log('Register: Google Signup Success', result.user);

          if (result.isNewUser) {
            console.log('Register: New user detected, redirecting to complete profile');
            navigate('/complete-profile');
          } else {
            const redirects = {
              admin: '/admin',
              worker: '/worker',
              customer: '/customer/home'
            };
            navigate(redirects[result.user.role] || '/customer/home');
          }
        } else {
          setError(result.error);
        }
      } catch (err) {
        console.error('Register: Google Exception', err);
        setError('Google signup failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError('Google Signup Failed'),
  });

  // All service categories
  const SERVICE_CATEGORIES = [
    { value: 'plumbing', label: 'Plumbing', icon: <Wrench size={20} />, description: 'Pipes, taps, leaks' },
    { value: 'electrical', label: 'Electrical', icon: <Zap size={20} />, description: 'Wiring, switches, repairs' },
    { value: 'cleaning', label: 'Cleaning', icon: <SprayCan size={20} />, description: 'Home & office cleaning' },
    { value: 'painting', label: 'Painting', icon: <Paintbrush size={20} />, description: 'Interior & exterior' },
    { value: 'carpentry', label: 'Carpentry', icon: <Hammer size={20} />, description: 'Furniture, woodwork' },
    { value: 'appliance', label: 'Appliance Repair', icon: <Plug size={20} />, description: 'Washing machine, fridge' },
    { value: 'ac-service', label: 'AC Service', icon: <Snowflake size={20} />, description: 'Installation & repair' },
    { value: 'pest-control', label: 'Pest Control', icon: <Bug size={20} />, description: 'Insects, rodents' },
    { value: 'salon', label: 'Home Salon', icon: <Scissors size={20} />, description: 'Beauty services' },
    { value: 'men-grooming', label: "Men's Grooming", icon: <Scissors size={20} />, description: 'Haircut, shaving' },
    { value: 'movers', label: 'Packers & Movers', icon: <Truck size={20} />, description: 'Relocation services' },
    { value: 'gardening', label: 'Gardening', icon: <Sprout size={20} />, description: 'Lawn & plant care' },
    { value: 'laundry', label: 'Laundry', icon: <Shirt size={20} />, description: 'Wash, iron, dry clean' },
    { value: 'cooking', label: 'Cook Services', icon: <ChefHat size={20} />, description: 'Home chef, catering' },
    { value: 'security', label: 'Security', icon: <Shield size={20} />, description: 'CCTV, locks, alarms' },
    { value: 'computer', label: 'Computer Repair', icon: <Laptop size={20} />, description: 'PC, laptop services' },
    { value: 'mobile', label: 'Mobile Repair', icon: <Smartphone size={20} />, description: 'Phone repairs' },
    { value: 'car-wash', label: 'Car Wash', icon: <Car size={20} />, description: 'Vehicle cleaning' },
    { value: 'photography', label: 'Photography', icon: <Camera size={20} />, description: 'Events, portraits' },
    { value: 'tutoring', label: 'Home Tutoring', icon: <BookOpen size={20} />, description: 'Academic help' },
    { value: 'fitness', label: 'Fitness Trainer', icon: <Dumbbell size={20} />, description: 'Personal training' },
    { value: 'massage', label: 'Massage Therapy', icon: <HeartHandshake size={20} />, description: 'Relaxation, therapy' },
    { value: 'other', label: 'Other Services', icon: <Package size={20} />, description: 'Miscellaneous' }
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const toggleCategory = (category) => {
    setFormData(prev => ({
      ...prev,
      serviceCategories: prev.serviceCategories.includes(category)
        ? prev.serviceCategories.filter(c => c !== category)
        : [...prev.serviceCategories, category]
    }));
  };

  const validateStep1 = () => {
    if (!formData.name.trim()) {
      setError('Please enter your name');
      return false;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setError('Please enter a valid email');
      return false;
    }

    // Email domain validation
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'zovo.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();

    if (!allowedDomains.includes(emailDomain)) {
      setError('Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (!formData.securityQuestion) {
      setError('Please select a security question');
      return false;
    }
    if (!formData.securityAnswer.trim()) {
      setError('Please provide an answer to the security question');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (formData.role === 'worker' && formData.serviceCategories.length === 0) {
      setError('Please select at least one service category');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      if (formData.role === 'customer') {
        // Submit directly for customer
        handleSubmit({ preventDefault: () => { } });
      } else {
        setStep(2);
        setError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step === 2 && !validateStep2()) return;
    if (step === 1 && !validateStep1()) return; // Should not happen if handleNext is used correctly

    setLoading(true);
    setError('');

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role,
        serviceCategories: formData.role === 'worker' ? formData.serviceCategories : [],
        securityQuestion: formData.securityQuestion,
        securityAnswer: formData.securityAnswer,
        ...(googleData || {}) // Include googleId and avatar if present
      });

      if (result.success) {
        const redirects = {
          admin: '/admin',
          worker: '/worker',
          customer: '/customer/home'
        };
        navigate(redirects[result.user.role] || '/customer/home');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 pt-12 pb-24">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Progress Steps */}
      <div className="w-full flex items-center justify-center mb-8 relative z-10">
        <div className="flex items-center">
          <div className={`w - 10 h - 10 rounded - full flex items - center justify - center font - bold shadow - md transition - all ${step >= 1 ? 'bg-zovo-blue text-white scale-110' : 'bg-white text-gray-400 border border-gray-200'} `}>
            {step > 1 ? <Check size={20} /> : '1'}
          </div>
          <span className={`ml - 3 ${step >= 1 ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'} `}>Account</span>
        </div>
        <div className={`w - 16 h - 1 mx - 4 rounded - full transition - all duration - 500 ${step > 1 ? 'bg-zovo-blue' : 'bg-gray-200'} `}></div>
        <div className="flex items-center">
          <div className={`w - 10 h - 10 rounded - full flex items - center justify - center font - bold shadow - md transition - all ${step >= 2 ? 'bg-zovo-blue text-white scale-110' : 'bg-white text-gray-400 border border-gray-200'} `}>
            2
          </div>
          <span className={`ml - 3 ${step >= 2 ? 'text-gray-900 font-bold' : 'text-gray-400 font-medium'} `}>Role & Services</span>
        </div>
      </div>

      {/* Register Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl w-full max-w-md relative z-10 transition-all duration-300 hover:shadow-blue-500/10 hover:border-white/80">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="mb-2 text-center">
                <img src={logo} alt="Zovo" className="h-[550px] mx-auto -my-52 object-contain" />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'customer', serviceCategories: [] })}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center group ${formData.role === 'customer'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 scale-105'
                    : 'border-gray-200/50 hover:border-blue-300 bg-white/40 hover:bg-blue-50/50'
                    }`}
                >
                  <div className={`mb-3 p-3 rounded-full transition-all duration-300 ${formData.role === 'customer' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500'
                    }`}>
                    <User size={32} />
                  </div>
                  <h3 className={`font-bold text-lg ${formData.role === 'customer' ? 'text-blue-600' : 'text-gray-600'}`}>Customer</h3>
                  <div className={`absolute top-3 right-3 transition-opacity duration-300 ${formData.role === 'customer' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-blue-500 text-white rounded-full p-1">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'worker' })}
                  className={`relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center group ${formData.role === 'worker'
                    ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20 scale-105'
                    : 'border-gray-200/50 hover:border-purple-300 bg-white/40 hover:bg-purple-50/50'
                    }`}
                >
                  <div className={`mb-3 p-3 rounded-full transition-all duration-300 ${formData.role === 'worker' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-purple-100 group-hover:text-purple-500'
                    }`}>
                    <Wrench size={32} />
                  </div>
                  <h3 className={`font-bold text-lg ${formData.role === 'worker' ? 'text-purple-600' : 'text-gray-600'}`}>Provider</h3>
                  <div className={`absolute top-3 right-3 transition-opacity duration-300 ${formData.role === 'worker' ? 'opacity-100' : 'opacity-0'}`}>
                    <div className="bg-purple-500 text-white rounded-full p-1">
                      <Check size={12} strokeWidth={4} />
                    </div>
                  </div>
                </button>
              </div>

              {/* Google Signup Button */}
              <div className="mb-6 mt-6">
                <button
                  type="button"
                  onClick={() => signupWithGoogle()}
                  className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition"
                >
                  <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
                  Sign up as {formData.role === 'worker' ? 'Provider' : 'Customer'} with Google
                </button>
              </div>

              <div className="relative flex py-2 items-center mb-6">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase tracking-wider font-medium">Or continue with email</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="e.g. Alex Smith"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition disabled:bg-gray-50 disabled:text-gray-500 ${googleData ? 'cursor-not-allowed opacity-70' : ''}`}
                    placeholder="Email Address"
                    required
                    disabled={!!googleData}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-1">Minimum 6 characters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onCopy={(e) => e.preventDefault()}
                    onPaste={(e) => e.preventDefault()}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>

              {/* Security Question */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Question</label>
                <div className="relative">
                  <select
                    name="securityQuestion"
                    value={formData.securityQuestion}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition appearance-none"
                    required
                  >
                    <option value="" disabled>Select a question</option>
                    {SECURITY_QUESTIONS.map((q, index) => (
                      <option key={index} value={q} className="bg-white text-gray-900">{q}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Security Answer */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Security Answer</label>
                <div className="relative">
                  <input
                    type="text"
                    name="securityAnswer"
                    value={formData.securityAnswer}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                    placeholder="Enter your answer"
                    required
                  />
                </div>
                <p className="text-gray-500 text-xs mt-1">This will be used to recover your password.</p>
              </div>

              {/* Next/Submit Button */}
              <button
                type="button"
                onClick={handleNext}
                className="w-full py-3 px-4 bg-zovo-blue hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition duration-200"
              >
                {formData.role === 'customer' ? (
                  <span className="flex items-center gap-2">Create Account <Rocket size={18} /></span>
                ) : (
                  <span className="flex items-center gap-2">Continue <ArrowRight size={18} /></span>
                )}
              </button>
            </div>
          )}

          {/* Step 2: Service Categories (Worker only) */}
          {step === 2 && formData.role === 'worker' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-zovo-dark text-center mb-2">Complete Profile</h2>
              <p className="text-gray-500 text-center text-sm mb-6">Select the services you provide</p>

              {/* Service Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-80 overflow-y-auto p-1">
                {SERVICE_CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => toggleCategory(cat.value)}
                    className={`p - 3 rounded - xl border - 2 transition text - center ${formData.serviceCategories.includes(cat.value)
                      ? 'border-zovo-blue bg-blue-50 scale-105'
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                      } `}
                  >
                    <div className="text-2xl mb-1">{cat.icon}</div>
                    <p className="text-gray-900 text-sm font-medium">{cat.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{cat.description}</p>
                  </button>
                ))}
              </div>

              {formData.serviceCategories.length > 0 && (
                <div className="mt-4 p-3 bg-green-50 border border-green-100 rounded-lg">
                  <p className="text-green-600 text-sm">
                    <div className="flex items-center gap-2">
                      <Check size={20} />
                      <span>{formData.serviceCategories.length} service{formData.serviceCategories.length > 1 ? 's' : ''} selected</span>
                    </div>
                  </p>
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-zovo-blue focus:ring-zovo-blue"
                />
                <span className="text-gray-600 text-sm">
                  I agree to the{' '}
                  <a href="#" className="text-zovo-blue hover:underline">Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" className="text-zovo-blue hover:underline">Privacy Policy</a>
                </span>
              </label>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold rounded-xl transition"
                >
                  <div className="flex items-center gap-2">
                    <ChevronLeft size={16} /> Back
                  </div>
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-4 bg-zovo-blue hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 disabled:opacity-50 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      Create Account
                      <Rocket className="ml-2" size={20} />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        {/* Login Link */}
        <p className="mt-8 text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-zovo-blue hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 w-full text-center text-gray-600 text-sm">
        © 2024 Zovo. All rights reserved.
      </p>
    </div>
  );
};

export default Register;