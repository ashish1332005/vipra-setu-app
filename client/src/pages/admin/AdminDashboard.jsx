import React from 'react';
import { IndianRupee, Users, Activity, CheckCircle } from 'lucide-react';
import { ADMIN_STATS } from '../../data/adminData';

const StatCard = ({ title, value, icon, subtitle, color }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex items-start gap-4">
    <div className={`p-3 rounded-lg ${color}`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

const AdminDashboard = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">Real-time statistics and system status.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Earnings" 
          value={`₹${ADMIN_STATS.currentEarnings.toLocaleString()}`} 
          icon={<IndianRupee size={24} className="text-emerald-600" />} 
          color="bg-emerald-100"
          subtitle="+12% from last month"
        />
        <StatCard 
          title="Active Visitors" 
          value={ADMIN_STATS.activeUsers.toLocaleString()} 
          icon={<Activity size={24} className="text-blue-600" />} 
          color="bg-blue-100"
          subtitle="Real-time traffic"
        />
        <StatCard 
          title="Total Users" 
          value={ADMIN_STATS.totalUsers.toLocaleString()} 
          icon={<Users size={24} className="text-indigo-600" />} 
          color="bg-indigo-100"
          subtitle="Registered accounts"
        />
        <StatCard 
          title="Pending Approvals" 
          value={ADMIN_STATS.pendingApprovals} 
          icon={<CheckCircle size={24} className="text-amber-600" />} 
          color="bg-amber-100"
          subtitle="Professionals waiting"
        />
      </div>

      {/* Placeholder for Charts / Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[300px] flex flex-col items-center justify-center text-slate-400 border-dashed">
           <Activity size={48} className="mb-4 text-slate-300" />
           <p>Revenue Chart Placeholder</p>
           <p className="text-sm">Connect a charting library like Recharts here.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[300px]">
          <h3 className="font-bold text-slate-800 mb-4">System Alerts</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">Database backup completed successfully.</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">High traffic warning: 500+ users connected simultaneously.</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">New ad campaign "Summer Spas" has been activated.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
