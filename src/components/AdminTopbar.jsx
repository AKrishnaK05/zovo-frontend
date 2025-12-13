// src/components/AdminTopbar.jsx
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function AdminTopbar(){
  const { logout } = useAuth()
  const navigate = useNavigate()
  const onLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-white/3 border-b">
      <div className="text-sm font-semibold">Admin Control</div>
      <div>
        <button onClick={onLogout} className="px-3 py-1 rounded-md glass">Logout</button>
      </div>
    </div>
  )
}
