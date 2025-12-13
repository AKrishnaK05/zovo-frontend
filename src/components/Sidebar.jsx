// frontend/src/components/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';

export default function Sidebar() {
  return (
    <aside className="hidden md:block app-sidebar">
      <div className="panel-card mb-6">
        <div className="mb-4">
          <div className="text-sm text-gray-400">Welcome</div>
          <div className="text-lg font-semibold mt-1">Customer</div>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/customer/home" className={({isActive}) => `px-3 py-2 rounded ${isActive ? 'bg-gradient-to-r from-violet-500 to-cyan-400 text-black' : ''}`}>Home</NavLink>
          <NavLink to="/customer/create-job" className="px-3 py-2 rounded hover:bg-white/2">Create Job</NavLink>
          <NavLink to="/customer/history" className="px-3 py-2 rounded hover:bg-white/2">History</NavLink>
          <NavLink to="/customer/recommendations" className="px-3 py-2 rounded hover:bg-white/2">Recommendations</NavLink>
        </nav>
      </div>
    </aside>
  );
}
