// src/router/PublicRoute.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Use for /login, /register — if logged in, redirect to their portal.
 */
export default function PublicRoute({ children }) {
  const { token, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-300">Checking session…</div>
      </div>
    )
  }

  if (token && user) {
    if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />
    if (user.role === 'worker') return <Navigate to="/worker/dashboard" replace />
    return <Navigate to="/customer/home" replace />
  }

  return children
}
