// src/pages/Customer/TrackJob.jsx
import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { fetchJob } from '../../services/api'    // <-- correct named import (relative path)
import MapMock from '../../components/MapMock'
import GlassCard from '../../components/GlassCard'
import GradientButton from '../../components/GradientButton'

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
}

const pageTransition = {
  type: 'spring',
  stiffness: 200,
  damping: 20
}

export default function TrackJob() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!jobId) {
      setError('No job id provided')
      setLoading(false)
      return
    }

    let mounted = true
    setLoading(true)
    fetchJob(jobId)
      .then((data) => {
        if (!mounted) return
        // if server returns wrapper like { job: ... } adapt accordingly
        setJob(data && data._id ? data : data.job || data)
      })
      .catch((err) => {
        console.error('fetchJob error', err)
        if (mounted) setError(err?.response?.data?.error || err.message || 'Failed to load job')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })

    return () => {
      mounted = false
    }
  }, [jobId])

  if (loading) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="p-6">
        <GlassCard>
          <h3 className="text-lg font-semibold">Loading job...</h3>
          <p className="mt-2 text-sm text-gray-300">Please wait while we load tracking info.</p>
        </GlassCard>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="p-6">
        <GlassCard>
          <h3 className="text-lg font-semibold text-rose-400">Error</h3>
          <p className="mt-2 text-sm text-gray-300">{error}</p>
          <div className="mt-4">
            <GradientButton onClick={() => navigate(-1)}>Go back</GradientButton>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  if (!job) {
    return (
      <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="p-6">
        <GlassCard>
          <h3 className="text-lg font-semibold">Job not found</h3>
          <p className="mt-2 text-sm text-gray-300">The requested job does not exist.</p>
          <div className="mt-4">
            <GradientButton onClick={() => navigate(-1)}>Go back</GradientButton>
          </div>
        </GlassCard>
      </motion.div>
    )
  }

  return (
    <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition} className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <GlassCard>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">{job.title || job.name || 'Service Job'}</h2>
                <p className="text-sm text-gray-300 mt-1">{job.category || job.type || 'General'}</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-400">Status</div>
                <div className="mt-1 font-semibold">{(job.status || 'pending').replace('_', ' ')}</div>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-300">{job.description || 'No description provided.'}</p>
            </div>
          </GlassCard>

          <GlassCard>
            <h3 className="text-lg font-semibold mb-2">Live tracking</h3>
            <div className="h-72 w-full rounded-md overflow-hidden">
              <MapMock job={job} />
            </div>
          </GlassCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <h4 className="font-semibold">Customer</h4>
              <p className="text-sm text-gray-300">{job.customerName || (job.createdBy && job.createdBy.name) || '—'}</p>
              <p className="text-sm text-gray-400 mt-2">{job.createdAt ? new Date(job.createdAt).toLocaleString() : ''}</p>
            </GlassCard>

            <GlassCard>
              <h4 className="font-semibold">Worker</h4>
              <p className="text-sm text-gray-300">{(job.assignedTo && job.assignedTo.name) || 'Not assigned'}</p>
              <p className="text-sm text-gray-400 mt-2">{job.eta || '—'}</p>
            </GlassCard>
          </div>
        </div>

        <div className="space-y-4">
          <GlassCard>
            <h4 className="text-lg font-semibold">Quick actions</h4>
            <div className="mt-3 space-y-2">
              <GradientButton onClick={() => navigate(`/customer/track/${job._id}`)}>Refresh</GradientButton>
              <GradientButton onClick={() => navigate(-1)} variant="ghost">Back</GradientButton>
            </div>
          </GlassCard>

          <GlassCard>
            <h4 className="text-lg font-semibold">Notes</h4>
            <p className="text-sm text-gray-300">Add job notes via the app. This page shows mock tracking and job metadata.</p>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  )
}
