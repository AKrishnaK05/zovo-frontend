// src/pages/Customer/TrackJob.jsx
import React from 'react'
import { useParams } from 'react-router-dom'

export default function TrackJob() {
  const { jobId } = useParams()
  return (
    <div>
      <h2 className="text-xl font-semibold">Track Job</h2>
      <div className="mt-4">Tracking job id: {jobId}</div>
      <div className="mt-4 text-slate-400">(Worker tracking UI and map to be added)</div>
    </div>
  )
}
