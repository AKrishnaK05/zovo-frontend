import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import { fetchWorkerJobs, acceptJob, startJob, completeJob } from '../../services/api' // <-- named imports
import JobCard from '../../components/JobCard'

export default function WorkerDashboard(){
  const [jobs, setJobs] = useState([])
  useEffect(()=> {
    (async ()=> {
      const res = await fetchWorkerJobs()
      setJobs(res)
    })()
  },[])
  return (
    <div className="md:flex gap-6">
      <Sidebar role="worker" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-4">Your Jobs</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(j => <div key={j.id} className="glass p-4 rounded-xl"><div className="font-semibold">{j.title}</div><div className="text-sm text-slate-300">{j.location}</div><div className="text-xs mt-2">{j.status}</div></div>)}
        </div>
      </div>
    </div>
  )
}
