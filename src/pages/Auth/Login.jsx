// frontend/src/pages/Auth/Login.jsx
import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff, AlertTriangle, ArrowRight } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/zovo_logo.png';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login, loginWithGoogle: authLoginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log('Login: Google Success detected', tokenResponse);
      try {
        setLoading(true);
        const result = await authLoginWithGoogle(tokenResponse.access_token);
        console.log('Login: authLoginWithGoogle result', result);

        if (result.success) {
          if (result.isNewUser) {
            // Redirect to complete profile
            console.log('Login: New user detected, redirecting to complete profile');
            navigate('/complete-profile');
          } else {
            console.log('Login: Navigating to', result.user.role);
            navigate(result.user.role === 'admin' ? '/admin' : (result.user.role === 'worker' ? '/worker' : '/customer/home'));
          }
        } else {
          console.error('Login: Auth logic failed', result.error);
          setError(result.error);
        }
      } catch (err) {
        console.error('Login: Exception', err);
        setError('Google login failed.');
      } finally {
        setLoading(false);
      }
    },
    onError: (err) => {
      console.error('Login: Google Error detected', err);
      setError('Google Login Failed');
    },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Email domain validation
    const allowedDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'icloud.com', 'zovo.com'];
    const emailDomain = formData.email.split('@')[1]?.toLowerCase();

    if (!allowedDomains.includes(emailDomain)) {
      setError('Please use a valid email provider (Gmail, Yahoo, Outlook, etc.)');
      setLoading(false);
      return;
    }

    try {
      const result = await login(formData.email, formData.password);
      console.log('Login result:', result);

      if (result.success) {
        // Redirect based on role
        const redirects = {
          admin: '/admin',
          worker: '/worker',
          customer: '/customer/home'
        };
        const userRole = result.user?.role || 'customer';
        const target = redirects[userRole];
        console.log('Redirecting to:', target, 'Role:', userRole);
        navigate(target || '/customer/home');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      // Show actual error in development or specific critical errors
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Login Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl w-full max-w-md relative z-10 transition-all duration-300 hover:shadow-blue-500/10 hover:border-white/80">
        <div className="mb-2 text-center">
          <img src={logo} alt="Zovo" className="h-[550px] mx-auto -my-52 object-contain" />
        </div>
        <h2 className="text-xl font-semibold text-zovo-dark text-center mb-6">Sign In</h2>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-4 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-zovo-blue focus:ring-1 focus:ring-zovo-blue transition"
                placeholder="Email Address"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                onCopy={(e) => e.preventDefault()}
                onPaste={(e) => e.preventDefault()}
                className="w-full pl-4 pr-12 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-zovo-blue focus:ring-1 focus:ring-zovo-blue transition"
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
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300 text-zovo-blue focus:ring-zovo-blue"
              />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot-password" className="text-sm text-zovo-blue hover:text-blue-700 font-medium">
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-zovo-blue hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <ArrowRight className="ml-2" size={20} />
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-gray-200"></div>
          <span className="px-4 text-gray-500 text-sm">or continue with</span>
          <div className="flex-1 border-t border-gray-200"></div>
        </div>

        {/* Social Login */}
        <div className="mb-6">
          <button
            type="button"
            onClick={() => {
              console.log('Login: Google button clicked');
              loginWithGoogle();
            }}
            className="w-full flex items-center justify-center py-3 px-4 bg-white border border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold rounded-xl transition"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5 mr-2" alt="Google" />
            Sign in with Google
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="mt-8 text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="text-zovo-blue hover:text-blue-700 font-medium">
            Sign up now
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

export default Login;