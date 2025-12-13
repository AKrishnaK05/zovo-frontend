// src/components/WorkerTopbar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function WorkerTopbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white/3 border-b border-white/5">
      <div className="text-sm text-slate-100">Worker Panel</div>
      <div className="flex items-center gap-4">
        <div className="text-sm hidden sm:block">{user?.name}</div>
        <button onClick={onLogout} className="px-3 py-1 rounded-md glass">Logout</button>
      </div>
    </header>
  )
}
