import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/zovo_logo.png';
import { LogOut, Home, Calendar, User } from 'lucide-react';

const CustomerLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if not logged in
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [

    { path: '/customer/home', label: 'Home', icon: Home },
    { path: '/customer/history', label: 'My Bookings', icon: Calendar },
    { path: '/customer/profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex h-screen bg-[#1A1A1A] overflow-hidden font-sans text-[#E0E0E0]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-xl relative z-20 transition-all duration-300">
        <div className="flex justify-center items-center h-20 relative z-0 mt-4 mb-2">
          <img src={logo} alt="Zovo" className="w-full scale-[1.5] object-contain drop-shadow-md" />
        </div>

        <nav className="flex-1 px-4 space-y-3 py-6 relative z-10 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3.5 rounded-2xl transition-all duration-300 group ${active
                  ? 'bg-[#007AFF] text-white shadow-lg shadow-blue-500/30 scale-[1.02] font-semibold'
                  : 'text-[#1D1D1F] hover:bg-gray-100/80 hover:text-black hover:shadow-sm'
                  }`}
              >
                <Icon className={`w-6 h-6 mr-3 transition-transform duration-300 ${active ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                <span className="tracking-wide">{item.label}</span>
                {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-ping" />}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Summary */}
        <div className="p-4 m-4 bg-gray-50 rounded-2xl border border-gray-100 shadow-inner relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#007AFF] flex items-center justify-center text-white font-bold shadow-lg">
              {user?.name?.[0] || 'C'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-[#1D1D1F] truncate">{user?.name || 'Customer'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'customer@zovo.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 w-full flex items-center justify-center px-5 py-2.5 bg-gray-200/50 hover:bg-red-50 text-gray-600 hover:text-red-600 rounded-xl transition-all duration-300 font-medium border border-transparent hover:border-red-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
        {/* Header */}
        <header className="h-20 bg-[#1A1A1A]/90 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-10">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {user?.name || 'Customer'}
            </h1>
            <p className="text-sm text-gray-400">Find the perfect service for you.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm font-medium text-gray-300 bg-white/5 px-4 py-2 rounded-xl border border-white/10 shadow-sm">
              Credits: <span className="text-[#007AFF] font-bold">{user?.credits || 0}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8 animate-fade-in-up">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerLayout;