// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from 'react'
import { fetchAdminAnalytics, fetchTransactions } from '../../services/api'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts'
import GlassCard from '../../components/GlassCard'
import GradientButton from '../../components/GradientButton'
import { motion } from 'framer-motion'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    fetchAdminAnalytics()
      .then((data) => setStats(data))
      .catch((err) => console.error('analytics error:', err))

    fetchTransactions()
      .then((data) => setTransactions(data))
      .catch((err) => console.error('transactions error:', err))
  }, [])

  if (!stats) {
    return (
      <motion.div className="p-6">
        <GlassCard>
          <h2 className="text-xl font-semibold">Loading admin dashboard...</h2>
        </GlassCard>
      </motion.div>
    )
  }

  const chartData = stats.recentJobs?.map((job, i) => ({
    name: `Job ${i + 1}`,
    value: i + 1
  })) || []

  return (
    <motion.div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard>
          <h3 className="text-lg font-semibold">Total Users</h3>
          <p className="text-3xl mt-2">{stats.totalUsers}</p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold">Total Jobs</h3>
          <p className="text-3xl mt-2">{stats.totalJobs}</p>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold">Revenue</h3>
          <p className="text-3xl mt-2">₹{stats.revenue}</p>
        </GlassCard>
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Job Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#00ffc6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
        <ul className="space-y-2">
          {transactions.length === 0 && <p className="text-gray-300">No transactions found.</p>}
          {transactions.map((txn) => (
            <li key={txn._id} className="p-3 rounded bg-white/5">
              <div className="flex justify-between">
                <span>₹{txn.amount}</span>
                <span className="text-sm text-gray-400">{txn.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </GlassCard>
    </motion.div>
  )
}
