// src/router/adminRoutes.jsx
import React from 'react'
import AdminLayout from '../layouts/AdminLayout'
import AdminDashboard from '../pages/Admin/AdminDashboard'
import AdminUsers from '../pages/Admin/AdminUsers'
import AdminJobs from '../pages/Admin/AdminJobs'
import AdminTransactions from '../pages/Admin/AdminTransactions'
import PrivateRoute from './PrivateRoute'

const base = '/admin'

const routes = [
  {
    path: `${base}`,
    element: <AdminLayout />,
    children: [
      { index: true, element: <PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute> },
      { path: 'dashboard', element: <PrivateRoute allowedRoles={['admin']}><AdminDashboard /></PrivateRoute> },
      { path: 'users', element: <PrivateRoute allowedRoles={['admin']}><AdminUsers /></PrivateRoute> },
      { path: 'jobs', element: <PrivateRoute allowedRoles={['admin']}><AdminJobs /></PrivateRoute> },
      { path: 'transactions', element: <PrivateRoute allowedRoles={['admin']}><AdminTransactions /></PrivateRoute> }
    ]
  }
]

export default routes
