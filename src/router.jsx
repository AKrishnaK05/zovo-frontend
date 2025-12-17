// frontend/src/router/router.jsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ==================== PAGES ====================
// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import CompleteProfile from '../pages/Auth/CompleteProfile';

// Layouts
import CustomerLayout from '../layouts/CustomerLayout';
import WorkerLayout from '../layouts/WorkerLayout';
import AdminLayout from '../layouts/AdminLayout';

// Customer Pages
import CustomerHome from '../pages/Customer/CustomerHome';
import BookService from '../pages/Customer/BookService';
import JobHistory from '../pages/Customer/JobHistory';  // ADDED

// Worker Pages
import WorkerHome from '../pages/Worker/WorkerHome';
import AvailableJobs from '../pages/Worker/AvailableJobs';
import MyJobs from '../pages/Worker/MyJobs';
// WorkerProfile imported at top

// Admin Pages
import Dashboard from '../pages/Admin/Dashboard';
import Users from '../pages/Admin/Users';
import Jobs from '../pages/Admin/Jobs';
import ServiceCategories from '../pages/Admin/ServiceCategories';
import PricingRules from '../pages/Admin/PricingRules';
import ServiceAreas from '../pages/Admin/ServiceAreas';
import Reviews from '../pages/Admin/Reviews';

// ==================== PLACEHOLDER COMPONENTS ====================
// REMOVED CustomerHistory placeholder - now using actual import

const WorkerEarnings = () => (
  <div>
    <h1 className="text-3xl font-bold text-white mb-4">Earnings</h1>
    <div className="panel-card p-8 text-center">
      <p className="text-gray-400">Earnings page coming soon...</p>
    </div>
  </div>
);

import WorkerProfile from '../pages/Worker/WorkerProfile';

// ==================== AUTH GUARDS ====================
function RequireAuth({ children, allowedRoles = [] }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#071523] to-[#00121a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    const redirects = {
      admin: '/admin',
      customer: '/customer/home',
      worker: '/worker'
    };
    return <Navigate to={redirects[user?.role] || '/login'} replace />;
  }

  return children;
}

function PublicRoute({ children }) {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#071523] to-[#00121a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    const redirects = {
      admin: '/admin',
      customer: '/customer/home',
      worker: '/worker'
    };
    return <Navigate to={redirects[user.role] || '/customer/home'} replace />;
  }

  return children;
}

// ==================== ROUTES ====================
const router = createBrowserRouter([
  // Root redirect
  {
    path: '/',
    element: (
      <PublicRoute>
        <Navigate to="/login" replace />
      </PublicRoute>
    ),
  },

  // Public routes
  {
    path: '/login',
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: '/register',
    element: (
      <PublicRoute>
        <Register />
      </PublicRoute>
    ),
  },

  {
    path: '/test-public',
    element: <div className="min-h-screen bg-white text-black p-20 text-6xl font-bold">PUBLIC ROUTE WORKS</div>,
  },

  // Protected Auth Pages
  {
    path: '/complete-profile',
    element: (
      <RequireAuth>
        <CompleteProfile />
      </RequireAuth>
    ),
  },

  // ==================== CUSTOMER ROUTES ====================
  {
    path: '/customer',
    element: (
      <RequireAuth allowedRoles={['customer']}>
        <CustomerLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/customer/home" replace /> },
      { path: 'home', element: <CustomerHome /> },
      { path: 'book/:category', element: <BookService /> },
      { path: 'history', element: <JobHistory /> },  // CHANGED FROM CustomerHistory
    ],
  },

  // ==================== WORKER ROUTES ====================
  {
    path: '/worker',
    element: (
      <RequireAuth allowedRoles={['worker']}>
        <WorkerLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <WorkerHome /> },
      { path: 'available-jobs', element: <AvailableJobs /> },
      { path: 'my-jobs', element: <MyJobs /> },
      { path: 'earnings', element: <WorkerEarnings /> },
      { path: 'profile', element: <WorkerProfile /> },
    ],
  },

  // ==================== ADMIN ROUTES ====================
  {
    path: '/admin',
    element: (
      <RequireAuth allowedRoles={['admin']}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'users', element: <Users /> },
      { path: 'jobs', element: <Jobs /> },
      { path: 'categories', element: <ServiceCategories /> },
      { path: 'pricing-rules', element: <PricingRules /> },
      { path: 'service-areas', element: <ServiceAreas /> },
      { path: 'reviews', element: <Reviews /> },
    ],
  },

  // ==================== 404 ====================
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#071523] to-[#00121a]">
        <div className="text-center">
          <div className="text-6xl mb-4">404</div>
          <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
          <p className="text-gray-400 mb-6">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn-accent inline-block">Go Home</a>
        </div>
      </div>
    ),
  },
]);

export default router;