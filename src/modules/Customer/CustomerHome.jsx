// frontend/src/pages/Customer/CustomerHome.jsx
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useJobs } from "../../context/JobContext";
import JobCard from "../../components/ui/JobCard";

export default function CustomerHome() {
  // defensive: if JobContext is not mounted, return a simple loader
  const jobsContext = useJobs();
  const safeContext = jobsContext || { jobs: [], loading: true, error: null, reload: () => {} };
  const { jobs = [], loading, error, reload } = safeContext;

  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (jobs || []).filter((j) => {
      if (statusFilter !== 'all' && (String(j.status || 'pending').toLowerCase() !== statusFilter)) return false;
      if (!q) return true;
      const title = String(j.title || '').toLowerCase();
      const desc = String(j.description || '').toLowerCase();
      return title.includes(q) || desc.includes(q);
    });
  }, [jobs, query, statusFilter]);

  if (!jobsContext) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Customer Home</h1>
        <div className="text-gray-300">Initializing job service… Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-100">Customer Home</h1>
        <div className="flex items-center gap-3">
          <Link to="/customer/create-job" className="px-4 py-2 bg-gradient-to-r from-violet-500 to-cyan-400 text-black rounded shadow-sm">Create job</Link>
          <button onClick={reload} className="px-3 py-2 border rounded text-sm text-gray-300">Refresh</button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        <div className="md:col-span-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search jobs by title or description..."
            className="w-full border rounded p-2 bg-transparent text-gray-100 border-gray-700"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-2 bg-transparent text-gray-100 border-gray-700"
          >
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In-Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {loading && (
        <div className="space-y-3">
          <div className="h-24 bg-gray-800 rounded animate-pulse" />
          <div className="h-24 bg-gray-800 rounded animate-pulse" />
        </div>
      )}

      {!loading && error && (
        <div className="p-4 bg-red-900/30 border border-red-800 text-red-200 rounded">
          Error loading jobs. Try refresh.
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="p-6 bg-yellow-900/10 border border-yellow-800/10 rounded text-yellow-200">
          No jobs found. <Link to="/customer/create-job" className="text-cyan-300 underline">Create your first job</Link>.
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {filtered.map((job) => (
          <JobCard key={job._id || job.id} job={job} />
        ))}
      </div>
    </div>
  );
}
