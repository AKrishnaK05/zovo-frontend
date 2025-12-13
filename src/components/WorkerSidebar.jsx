// src/components/WorkerSidebar.jsx
import React from 'react'
import { Link } from 'react-router-dom'

export default function WorkerSidebar(){
  return (
    <aside className="w-64 hidden md:block">
      <div className="glass p-4 rounded-md space-y-3">
        <h4 className="font-semibold">Worker Panel</h4>
        <nav className="text-sm text-slate-300 space-y-2">
          <Link to="/worker/dashboard" className="block">Dashboard</Link>
          <Link to="/worker/live-tracking" className="block">Live tracking</Link>
        </nav>
      </div>
    </aside>
  )
}
