import React from 'react'
import Sidebar from '../../components/Sidebar'
import { useJobs } from '../../context/JobContext'
import JobCard from '../../components/JobCard'

export default function History(){
  const { jobs } = useJobs()
  return (
    <div className="md:flex gap-6">
      <Sidebar role="customer" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-4">Previous Jobs</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {jobs.map(j => <JobCard key={j.id} job={j} />)}
        </div>
      </div>
    </div>
  )
}
