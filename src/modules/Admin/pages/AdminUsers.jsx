import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Table from '../../components/Table'
import { fetchAdminUsers } from '../../services/api'

export default function AdminUsers(){
  const [users, setUsers] = useState([])
  useEffect(()=> {
    (async ()=> {
      const res = await fetchAdminUsers()
      setUsers(res)
    })()
  },[])

  const columns = [
    { key: 'name', title: 'Name' },
    { key: 'email', title: 'Email' },
    { key: 'role', title: 'Role' },
    { key: 'joined', title: 'Joined', render: (r)=> new Date(r.joined).toLocaleDateString() }
  ]

  return (
    <div className="md:flex gap-6">
      <Sidebar role="admin" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-4">Users</h3>
        <Table columns={columns} data={users} />
      </div>
    </div>
  )
}
