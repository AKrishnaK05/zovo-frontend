// frontend/src/components/ui/JobCard.jsx
import React from 'react';

export default function JobCard({ job }) {
  if (!job) return null;
  const status = (job.status || 'pending').toLowerCase();
  const scheduled = job.scheduledAt ? new Date(job.scheduledAt) : null;

  return (
    <article className="panel-card p-4">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-400">{job.description}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-gray-800 text-gray-200">{status}</span>
        </div>
      </div>

      <div className="mt-3 text-sm text-gray-300 space-y-1">
        {job.location && <div><strong>Location:</strong> {job.location}</div>}
        {job.price !== undefined && <div><strong>Price:</strong> ₹{Number(job.price)}</div>}
        <div><strong>Scheduled:</strong> {scheduled ? scheduled.toLocaleString() : 'Not scheduled'}</div>
      </div>
    </article>
  );
}
