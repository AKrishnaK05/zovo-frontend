import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import InputField from '../../components/InputField'
import GradientButton from '../../components/GradientButton'
import { useJobs } from '../../context/JobContext'
import { useNavigate } from 'react-router-dom'

export default function CreateJob(){
  const [form, setForm] = useState({ title:'', category:'Plumbing', description:'' })
  const { createJob } = useJobs()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    const job = await createJob(form)
    navigate(`/customer/track/${job.id}`)
  }

  return (
    <div className="md:flex gap-6">
      <Sidebar role="customer" />
      <div className="flex-1">
        <div className="glass p-6 rounded-xl">
          <h3 className="font-semibold">Create a Job</h3>
          <form onSubmit={submit} className="mt-4 space-y-4">
            <InputField label="Title" value={form.title} onChange={e=>setForm({...form, title:e.target.value})} />
            <div>
              <select className="w-full p-3 rounded-lg bg-transparent border border-white/6" value={form.category} onChange={e=>setForm({...form, category:e.target.value})}>
                <option>Plumbing</option>
                <option>Electrical</option>
                <option>Cleaning</option>
                <option>Appliance Repair</option>
              </select>
            </div>
            <textarea className="w-full p-3 rounded-lg bg-transparent border border-white/6" rows={4} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} />
            <GradientButton type="submit">Post job</GradientButton>
          </form>
        </div>
      </div>
    </div>
  )
}
