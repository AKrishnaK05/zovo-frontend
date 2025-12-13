import React from 'react'
import Sidebar from '../../components/Sidebar'
import { useParams } from 'react-router-dom'
import MapMock from '../../components/MapMock'

export default function WorkerJob(){
  const { id } = useParams()
  return (
    <div className="md:flex gap-6">
      <Sidebar role="worker" />
      <div className="flex-1">
        <div className="glass p-6 rounded-xl">
          <h3 className="font-semibold">Job Details — {id}</h3>
          <p className="text-slate-300">Mock data for worker inspection & checklist</p>
          <div className="mt-4"><MapMock /></div>
        </div>
      </div>
    </div>
  )
}
