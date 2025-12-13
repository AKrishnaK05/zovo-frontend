// src/router/customerRoutes.jsx
import React from 'react'
import CustomerLayout from '../layouts/CustomerLayout'
import CustomerHome from '../pages/Customer/CustomerHome'
import CreateJob from '../pages/Customer/CreateJob'
import TrackJob from '../pages/Customer/TrackJob'
import History from '../pages/Customer/History'
import Recommendations from '../pages/Customer/Recommendations'
import PrivateRoute from './PrivateRoute'

// mount at /customer/*
const base = '/customer'

const routes = [
  {
    path: `${base}`,
    element: <CustomerLayout />,
    children: [
      { index: true, element: <PrivateRoute allowedRoles={['customer']}><CustomerHome /></PrivateRoute> },
      { path: 'home', element: <PrivateRoute allowedRoles={['customer']}><CustomerHome /></PrivateRoute> },
      { path: 'create-job', element: <PrivateRoute allowedRoles={['customer']}><CreateJob /></PrivateRoute> },
      { path: 'track/:jobId', element: <PrivateRoute allowedRoles={['customer']}><TrackJob /></PrivateRoute> },
      { path: 'history', element: <PrivateRoute allowedRoles={['customer']}><History /></PrivateRoute> },
      { path: 'recommendations', element: <PrivateRoute allowedRoles={['customer']}><Recommendations /></PrivateRoute> }
    ]
  }
]

export default routes
