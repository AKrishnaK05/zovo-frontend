import React from 'react'
import Sidebar from '../../components/Sidebar'
import { motion } from 'framer-motion'
import CategoryCard from '../../components/CategoryCard'

export default function Recommendations(){
  const recs = [
    { title: 'Local trusted plumbers', icon: '🔧' },
    { title: 'Top-rated electricians', icon: '🔌' },
    { title: 'Weekly cleaning offers', icon: '🧼' }
  ]
  return (
    <div className="md:flex gap-6">
      <Sidebar role="customer" />
      <div className="flex-1 space-y-4">
        <h3 className="text-xl font-semibold">Recommendations for you</h3>
        <div className="grid md:grid-cols-3 gap-4">
          {recs.map(r => <motion.div key={r.title} whileHover={{ scale: 1.03 }}><CategoryCard {...r} /></motion.div>)}
        </div>
      </div>
    </div>
  )
}
