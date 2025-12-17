import { LayoutDashboard, Users, ClipboardList, Wallet } from 'lucide-react';

export default function AdminSidebar() {
  return (
    <aside className="w-72 hidden md:block">
      <div className="glass p-6 rounded-2xl h-[calc(100vh-6rem)] sticky top-24 border border-white/10">
        <h4 className="font-bold text-lg mb-6 text-white px-2">Admin Panel</h4>
        <nav className="space-y-2">
          <Link to="/admin/dashboard" className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition">
            <LayoutDashboard size={20} className="mr-3" /> Dashboard
          </Link>
          <Link to="/admin/users" className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition">
            <Users size={20} className="mr-3" /> Users
          </Link>
          <Link to="/admin/jobs" className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition">
            <ClipboardList size={20} className="mr-3" /> Jobs
          </Link>
          <Link to="/admin/transactions" className="flex items-center px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition">
            <Wallet size={20} className="mr-3" /> Transactions
          </Link>
        </nav>
      </div>
    </aside>
  )
}
