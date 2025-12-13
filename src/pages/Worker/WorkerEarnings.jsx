import { useState, useEffect } from 'react';
import api from '../../services/api';

const WorkerEarnings = () => {
  const [loading, setLoading] = useState(true);
  const [earningsData, setEarningsData] = useState({
    totalEarnings: 0,
    totalJobs: 0,
    transactions: []
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const response = await api.get('/worker/earnings');
      if (response.data.success) {
        setEarningsData(response.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch earnings:', err);
      setError('Failed to load earnings data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">My Earnings</h1>
        <p className="text-gray-400">Track your income and payment history</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Earnings</h3>
            <span className="p-2 bg-green-500/20 rounded-lg text-green-400">
              💰
            </span>
          </div>
          <p className="text-4xl font-bold text-white">
            ₹{earningsData.totalEarnings.toLocaleString()}
          </p>
          <p className="text-sm text-green-400 mt-2 flex items-center">
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Lifetime income
          </p>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Completed Jobs</h3>
            <span className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
              ✅
            </span>
          </div>
          <p className="text-4xl font-bold text-white">
            {earningsData.totalJobs}
          </p>
          <p className="text-sm text-purple-400 mt-2 flex items-center">
            <span className="w-2 h-2 rounded-full bg-purple-500 mr-2"></span>
            Paid jobs
          </p>
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Payment History</h2>
        </div>

        {earningsData.transactions.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <span className="text-4xl mb-4 block">💸</span>
            <p>No earnings yet. Complete jobs to start earning!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-800/50 text-gray-400 text-sm uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Service</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {earningsData.transactions.map((transaction) => (
                  <tr key={transaction._id} className="hover:bg-gray-800/30 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-white font-medium">{transaction.title}</p>
                        <p className="text-xs text-gray-500 capitalize">{transaction.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center text-xs text-white font-bold mr-3">
                          {transaction.customer?.name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-gray-300">{transaction.customer?.name || 'Unknown User'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">
                      {new Date(transaction.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-bold">
                        +₹{transaction.finalPrice}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        Paid
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerEarnings;