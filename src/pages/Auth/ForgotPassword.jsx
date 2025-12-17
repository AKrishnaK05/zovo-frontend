import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Check, AlertTriangle, Lock, ArrowRight, ChevronLeft } from 'lucide-react';
import logo from '../../assets/zovo_logo.png';
import api from '../../services/api';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    email: '',
    securityQuestion: '',
    securityAnswer: '',
    newPassword: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/forgot-password/init', { email: formData.email });
      if (response.data.success) {
        setFormData(prev => ({ ...prev, securityQuestion: response.data.securityQuestion }));
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to find account');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/forgot-password/verify', {
        email: formData.email,
        securityAnswer: formData.securityAnswer,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setSuccess('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      {/* Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-8 shadow-2xl w-full max-w-md relative z-10 transition-all duration-300 hover:shadow-blue-500/10">
        <div className="mb-2 text-center">
          <Link to="/login" className="flex flex-col items-center mb-0">
            <img src={logo} alt="Zovo" className="h-[550px] -my-52 object-contain" />
          </Link>
          <h2 className="text-2xl font-bold text-zovo-dark mb-2">Reset Password</h2>
          <p className="text-gray-600 text-sm">
            {step === 1 ? 'Enter your email to retrieve your security question' : 'Answer your security question to reset password'}
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-100 rounded-lg flex items-start">
            <Check className="text-green-500 mr-2 mt-0.5" size={20} />
            <span className="text-green-600 text-sm">{success}</span>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg flex items-center">
            <AlertTriangle className="text-red-500 mr-2" size={20} />
            <span className="text-red-600 text-sm">{error}</span>
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-zovo-blue focus:ring-1 focus:ring-zovo-blue transition"
                  placeholder="Email Address"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-zovo-blue hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Checking...
                </>
              ) : (
                <span className="flex items-center justify-center gap-2">Continue <ArrowRight size={18} /></span>
              )}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetSubmit} className="space-y-6">
            {/* Security Question Display */}
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl mb-4">
              <p className="text-xs text-purple-400 font-bold uppercase tracking-wider mb-1">Security Question</p>
              <p className="text-white font-medium">{formData.securityQuestion}</p>
            </div>

            {/* Answer Input */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Your Answer</label>
              <div className="relative">
                <input
                  type="text"
                  name="securityAnswer"
                  value={formData.securityAnswer}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  placeholder="Enter your answer"
                  required
                />
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  onCopy={(e) => e.preventDefault()}
                  onPaste={(e) => e.preventDefault()}
                  className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition"
                  placeholder="Enter your new password"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold rounded-xl transition"
              >
                <span className="flex items-center gap-2"><ChevronLeft size={16} /> Back</span>
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold rounded-xl shadow-lg shadow-purple-500/25 transition duration-200 disabled:opacity-50 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Resetting...
                  </>
                ) : (
                  'Reset Password'
                )}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link
            to="/login"
            className="text-gray-500 hover:text-gray-700 transition flex items-center justify-center text-sm font-medium"
          >
            Cancel & Return to Login
          </Link>
        </div>
      </div>

      {/* Footer */}
      <p className="absolute bottom-6 w-full text-center text-gray-600 text-sm">
        © 2024 Zovo. All rights reserved.
      </p>
    </div>
  );
};

export default ForgotPassword;
