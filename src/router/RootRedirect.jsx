// src/router/RootRedirect.jsx
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * RootRedirect - component to mount at path "/"
 * It waits for initial auth check (initialChecked) and then:
 *  - if not authenticated -> go to /login
 *  - if authenticated -> redirect by role to appropriate landing page
 *
 * Place this at your router root route as the index element.
 */
export default function RootRedirect() {
  const { token, user, loading, initialChecked } = useAuth()

  // while we haven't done the initial check show placeholder
  if (loading && !initialChecked) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-sm text-gray-400">Loading…</div>
      </div>
    )
  }

  // initial check finished
  if (!token) {
    return <Navigate to="/login" replace />
  }

  // route by role
  const role = user?.role
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (role === 'worker') return <Navigate to="/worker/dashboard" replace />
  // default to customer
  return <Navigate to="/customer/home" replace />
}
