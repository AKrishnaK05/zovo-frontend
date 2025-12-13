import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar'
import Table from '../../components/Table'
import { fetchTransactions } from '../../services/api'

export default function AdminTransactions(){
  const [txns, setTxns] = useState([])
  useEffect(()=> {
    (async ()=> {
      const res = await fetchTransactions()
      setTxns(res)
    })()
  },[])

  const columns = [
    { key: 'id', title: 'Transaction ID' },
    { key: 'user', title: 'User' },
    { key: 'amount', title: 'Amount' },
    { key: 'date', title: 'Date', render: (r)=> new Date(r.date).toLocaleString() }
  ]

  return (
    <div className="md:flex gap-6">
      <Sidebar role="admin" />
      <div className="flex-1">
        <h3 className="text-xl font-semibold mb-4">Transactions</h3>
        <Table columns={columns} data={txns} />
      </div>
    </div>
  )
}
