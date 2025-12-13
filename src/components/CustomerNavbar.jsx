import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logo from '../assets/zovo_logo.png'

export default function CustomerNavbar() {
  const { user, token, logout } = useAuth()
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/70 backdrop-blur-xl shadow-lg py-2' : 'bg-transparent py-4'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0 flex items-center z-10 relative">
            <img src={logo} alt="Zovo" className="h-32 scale-[1.3] -my-8 object-contain transition-transform group-hover:scale-[1.4]" />
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 z-10 relative">
            <Link to="/customer/create-job" className="text-gray-900 hover:text-zovo-blue font-medium transition duration-200">Services</Link>
            <Link to="/how-it-works" className="text-gray-900 hover:text-zovo-blue font-medium transition duration-200">How it Works</Link>
            <Link to="/become-worker" className="text-gray-900 hover:text-zovo-blue font-medium transition duration-200">Become a Provider</Link>
            {token ? (
              <button
                onClick={logout}
                className="px-6 py-2.5 rounded-xl bg-red-50 text-red-600 font-semibold hover:bg-red-100 transition border border-red-100"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/login"
                className="px-6 py-2.5 rounded-xl bg-zovo-blue text-white font-semibold hover:bg-blue-600 transition shadow-lg shadow-blue-500/20"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center z-10 relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-900 hover:text-zovo-blue focus:outline-none transition"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100 absolute w-full shadow-xl">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/customer/create-job" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-blue-50 hover:text-zovo-blue transition">Services</Link>
            <Link to="/how-it-works" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-blue-50 hover:text-zovo-blue transition">How it Works</Link>
            <Link to="/become-worker" className="block px-3 py-3 rounded-xl text-base font-medium text-gray-900 hover:bg-blue-50 hover:text-zovo-blue transition">Become a Provider</Link>
            {token ? (
              <button onClick={logout} className="block w-full text-left px-3 py-3 rounded-xl text-base font-medium text-red-500 hover:bg-red-50 transition">Sign Out</button>
            ) : (
              <Link to="/login" className="block px-3 py-3 rounded-xl text-base font-medium text-zovo-blue font-bold hover:bg-blue-50 transition">Sign In</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
