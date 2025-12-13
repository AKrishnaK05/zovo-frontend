import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const CompleteProfile = () => {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        role: user?.role || 'customer',
        phone: '',
        securityQuestion: '',
        securityAnswer: '',
        serviceCategories: [] // Only for workers
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const SECURITY_QUESTIONS = [
        "What was the name of your first pet?",
        "What is your mother's maiden name?",
        "What was the name of your first school?",
        "What is your favorite food?",
        "What city were you born in?"
    ];

    // Service categories (reused from Register)
    const SERVICE_CATEGORIES = [
        { value: 'plumbing', label: 'Plumbing', icon: '🔧' },
        { value: 'electrical', label: 'Electrical', icon: '⚡' },
        { value: 'cleaning', label: 'Cleaning', icon: '🧹' },
        { value: 'painting', label: 'Painting', icon: '🎨' },
        { value: 'carpentry', label: 'Carpentry', icon: '🪚' },
        { value: 'appliance', label: 'Appliance Repair', icon: '🔌' },
        { value: 'ac-service', label: 'AC Service', icon: '❄️' },
        { value: 'pest-control', label: 'Pest Control', icon: '🦟' },
        { value: 'salon', label: 'Home Salon', icon: '💇‍♀️' },
        { value: 'men-grooming', label: "Men's Grooming", icon: '💇‍♂️' },
        { value: 'movers', label: 'Packers & Movers', icon: '🚚' },
        { value: 'gardening', label: 'Gardening', icon: '🌱' },
        { value: 'laundry', label: 'Laundry', icon: '👔' },
        { value: 'cooking', label: 'Cook Services', icon: '👨‍🍳' },
        { value: 'security', label: 'Security', icon: '🔐' },
        { value: 'computer', label: 'Computer Repair', icon: '💻' },
        { value: 'mobile', label: 'Mobile Repair', icon: '📱' },
        { value: 'car-wash', label: 'Car Wash', icon: '🚗' },
        { value: 'photography', label: 'Photography', icon: '📸' },
        { value: 'tutoring', label: 'Home Tutoring', icon: '📚' },
        { value: 'fitness', label: 'Fitness Trainer', icon: '💪' },
        { value: 'massage', label: 'Massage Therapy', icon: '💆' },
        { value: 'other', label: 'Other Services', icon: '📦' }
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.role === 'worker' && formData.serviceCategories.length === 0) {
            setError('Please select at least one service category');
            return;
        }

        if (!formData.securityQuestion) {
            setError('Please select a security question');
            return;
        }
        if (!formData.securityAnswer.trim()) {
            setError('Please provide an answer to the security question');
            return;
        }

        setLoading(true);

        try {
            const response = await api.put('/auth/update-profile', {
                phone: formData.phone,
                serviceCategories: formData.role === 'worker' ? formData.serviceCategories : [],
                role: formData.role,
                securityQuestion: formData.securityQuestion,
                securityAnswer: formData.securityAnswer
            });

            if (response.data.success) {
                updateUser(response.data.data);
                const redirects = {
                    admin: '/admin',
                    worker: '/worker',
                    customer: '/customer/home'
                };
                navigate(redirects[formData.role] || '/customer/home');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const toggleCategory = (category) => {
        setFormData(prev => ({
            ...prev,
            serviceCategories: prev.serviceCategories.includes(category)
                ? prev.serviceCategories.filter(c => c !== category)
                : [...prev.serviceCategories, category]
        }));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
            <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10">
                <h2 className="text-2xl font-bold text-zovo-dark mb-2 text-center">Complete Your Profile</h2>
                <p className="text-gray-500 text-center mb-6">Just a few more details to get you started.</p>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                        <div className="grid grid-cols-2 gap-4">
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'customer' })}
                                className={`p-3 rounded-xl border-2 transition text-center ${formData.role === 'customer'
                                    ? 'border-zovo-blue bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-xl mb-1">👤</div>
                                <div className="text-gray-900 text-sm font-semibold">Customer</div>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({ ...formData, role: 'worker' })}
                                className={`p-3 rounded-xl border-2 transition text-center ${formData.role === 'worker'
                                    ? 'border-zovo-blue bg-blue-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <div className="text-xl mb-1">🔧</div>
                                <div className="text-gray-900 text-sm font-semibold">Provider</div>
                            </button>
                        </div>
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-zovo-blue focus:ring-1 focus:ring-zovo-blue transition"
                            placeholder="Enter your phone number"
                            required
                        />
                    </div>

                    {/* Security Question */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Security Question</label>
                        <div className="relative">
                            <select
                                value={formData.securityQuestion}
                                onChange={(e) => setFormData({ ...formData, securityQuestion: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-zovo-blue focus:ring-1 focus:ring-zovo-blue transition appearance-none"
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
                                value={formData.securityAnswer}
                                onChange={(e) => setFormData({ ...formData, securityAnswer: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:border-zovo-blue focus:ring-1 focus:ring-zovo-blue transition"
                                placeholder="Enter your answer"
                                required
                            />
                        </div>
                        <p className="text-gray-500 text-xs mt-1">This will be used to recover your password.</p>
                    </div>

                    {/* Service Categories (Worker Only) */}
                    {formData.role === 'worker' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Services You Provide</label>
                            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 bg-gray-50 rounded-xl border border-gray-200">
                                {SERVICE_CATEGORIES.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => toggleCategory(cat.value)}
                                        className={`p-2 rounded-lg text-xs font-medium transition text-left flex items-center ${formData.serviceCategories.includes(cat.value)
                                            ? 'bg-blue-100 text-zovo-blue border-l-2 border-zovo-blue'
                                            : 'text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <span className="mr-2">{cat.icon}</span>
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-zovo-blue hover:bg-blue-600 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25 transition duration-200 disabled:opacity-50"
                    >
                        {loading ? 'Saving...' : 'Continue →'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CompleteProfile;
