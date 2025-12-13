// src/router/index.jsx
import React from 'react'
import { createBrowserRouter, Route, createRoutesFromElements, RouterProvider, Outlet, Navigate } from 'react-router-dom'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute' // optional if you have
// Layouts
import CustomerLayout from '../layouts/CustomerLayout'
import WorkerLayout from '../layouts/WorkerLayout'
import AdminLayout from '../layouts/AdminLayout'
// Pages (ensure these paths exist)
import Login from '../pages/Auth/Login'
import Register from '../pages/Auth/Register'
import ForgotPassword from '../pages/Auth/ForgotPassword'
// Customer pages
import CustomerHome from '../pages/Customer/CustomerHome'
import CreateJob from '../pages/Customer/CreateJob'
import TrackJob from '../pages/Customer/TrackJob'
import History from '../pages/Customer/History'
import Recommendations from '../pages/Customer/Recommendations'
// Worker pages
import WorkerDashboard from '../pages/Worker/WorkerDashboard'
import WorkerJob from '../pages/Worker/WorkerJob'
import WorkerTracking from '../pages/Worker/WorkerTracking'
// Admin pages
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminUsers from '../pages/Admin/AdminUsers'
import AdminJobs from '../pages/Admin/AdminJobs'
import AdminTransactions from '../pages/Admin/AdminTransactions'

// Root layout wrapper: if you want to show something at root (e.g. landing), create component
const Root = () => <Outlet />

const routes = createRoutesFromElements(
  <Route path="/" element={<Root />}>
    {/* default redirect */}
    <Route index element={<Navigate to="/customer/home" replace />} />

    {/* Public auth */}
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="forgot-password" element={<ForgotPassword />} />

    {/* Customer (protected) */}
    <Route
      path="customer/*"
      element={
        <PrivateRoute allowedRoles={['customer']}>
          <CustomerLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<Navigate to="home" replace />} />
      <Route path="home" element={<CustomerHome />} />
      <Route path="create-job" element={<CreateJob />} />
      <Route path="track/:jobId" element={<TrackJob />} />
      <Route path="history" element={<History />} />
      <Route path="recommendations" element={<Recommendations />} />
    </Route>

    {/* Worker (protected) */}
    <Route
      path="worker/*"
      element={
        <PrivateRoute allowedRoles={['worker']}>
          <WorkerLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<WorkerDashboard />} />
      <Route path="dashboard" element={<WorkerDashboard />} />
      <Route path="job/:id" element={<WorkerJob />} />
      <Route path="live-tracking" element={<WorkerTracking />} />
    </Route>

    {/* Admin (protected) */}
    <Route
      path="admin/*"
      element={
        <PrivateRoute allowedRoles={['admin']}>
          <AdminLayout />
        </PrivateRoute>
      }
    >
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="jobs" element={<AdminJobs />} />
      <Route path="transactions" element={<AdminTransactions />} />
    </Route>

    {/* catch-all */}
    <Route path="*" element={<div className="p-8 text-center text-slate-300">404 — Page not found</div>} />
  </Route>
)

const router = createBrowserRouter(routes)

export default function Router() {
  return <RouterProvider router={router} />
}
