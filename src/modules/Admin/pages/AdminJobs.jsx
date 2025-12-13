import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Table from '../../components/Table'
import { fetchAdminJobs } from '../../services/api'

export default function AdminJobs(){
  const [jobs, setJobs] = useState([])
  useEffect(()=> {
    (async ()=> {
      const res = await fetchAdminJobs()
      setJobs(res)
    })()
  },[])

  const columns = [
    { key: 'title', title: 'Title' },
    { key: 'status', title: 'Status' },
    { key: 'createdAt', title: 'Created', render: (r)=> new Date(r.createdAt).toLocaleString() }
  ]

  return (
    <div className="md:flex gap-6">
      <Sidebar role="admin" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-4">Jobs</h3>
        <Table columns={columns} data={jobs} />
      </div>
    </div>
  )
}
