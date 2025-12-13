// src/router/PrivateRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * PrivateRoute
 * Props:
 *  - element : React element to render when allowed
 *  - allowedRoles : array of allowed roles (optional)
 *
 * Behaviour:
 *  - If auth loading: render a placeholder
 *  - If not authenticated -> redirect to /login
 *  - If role not allowed -> redirect to role-specific home or root
 *  - Else render the element
 */
export default function PrivateRoute({ element, allowedRoles = [] }) {
  const { token, user, loading } = useAuth()

  // while checking session show a stable placeholder (prevents redirect loops)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-400">Checking session…</div>
      </div>
    )
  }

  // not authenticated
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // role check (if specified)
  if (allowedRoles.length && !allowedRoles.includes(user?.role)) {
    // choose a fallback — send to login or root. Prefer root so UI can decide.
    return <Navigate to="/" replace />
  }

  return element
}
