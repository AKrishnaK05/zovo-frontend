// src/router/workerRoutes.jsx
import React from 'react'
import WorkerLayout from '../layouts/WorkerLayout'
import WorkerDashboard from '../pages/Worker/WorkerDashboard'
import WorkerJob from '../pages/Worker/WorkerJob'
import WorkerTracking from '../pages/Worker/WorkerTracking'
import PrivateRoute from './PrivateRoute'

const base = '/worker'

const routes = [
  {
    path: `${base}`,
    element: <WorkerLayout />,
    children: [
      { index: true, element: <PrivateRoute allowedRoles={['worker']}><WorkerDashboard /></PrivateRoute> },
      { path: 'dashboard', element: <PrivateRoute allowedRoles={['worker']}><WorkerDashboard /></PrivateRoute> },
      { path: 'job/:id', element: <PrivateRoute allowedRoles={['worker']}><WorkerJob /></PrivateRoute> },
      { path: 'live-tracking', element: <PrivateRoute allowedRoles={['worker']}><WorkerTracking /></PrivateRoute> }
    ]
  }
]

export default routes
