// frontend/src/routes/RequireAuth.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wrap route elements that require a logged-in user.
 * allowedRoles = [] (means any authenticated user)
 */
export default function RequireAuth({ children, allowedRoles = [] }) {
  const auth = useAuth();
  const location = useLocation();

  // show loading skeleton if auth status still initializing
  if (!auth || auth.loading) {
    return <div className="min-h-[200px] flex items-center justify-center">Loading...</div>;
  }

  if (!auth.isAuthenticated || !auth.user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(auth.user.role)) {
    // unauthorized for this role
    return <Navigate to="/login" replace />;
  }

  return children;
}
