// src/components/AdminSidebar.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function AdminSidebar(){
  return (
    <aside className="w-72 hidden md:block">
      <div className="glass p-4 rounded-md space-y-3">
        <h4 className="font-semibold">Admin</h4>
        <nav className="text-sm text-slate-300 space-y-2">
          <Link to="/admin/dashboard" className="block">Dashboard</Link>
          <Link to="/admin/users" className="block">Users</Link>
          <Link to="/admin/jobs" className="block">Jobs</Link>
          <Link to="/admin/transactions" className="block">Transactions</Link>
        </nav>
      </div>
    </aside>
  )
}
