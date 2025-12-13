// frontend/src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { user, logout } = useAuth();
  return (
    <header className="w-full py-3 px-6 border-b border-white/5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="brand text-lg font-extrabold">Helpr</Link>
          <nav className="hidden md:flex items-center gap-4 text-sm text-gray-300">
            <Link to="/customer/home" className="hover:text-white">Customer</Link>
            <Link to="/worker" className="hover:text-white">Worker</Link>
            <Link to="/admin" className="hover:text-white">Admin</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-200">Hi, {user.name}</span>
              <button onClick={logout} className="px-3 py-1 border border-white/10 rounded text-sm">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1 border border-white/10 rounded text-sm">Login</Link>
              <Link to="/register" className="btn-accent text-sm">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
