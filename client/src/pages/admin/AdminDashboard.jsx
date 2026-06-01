import { useEffect, useState } from 'react';
import { Users, Activity, CheckCircle, BriefcaseBusiness } from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

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
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProviders: 0,
    totalTakers: 0,
    pendingProviders: 0,
    activeServices: 0,
    openRequests: 0,
    pendingServices: 0,
    openReports: 0,
    activeSubscriptions: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/dashboard')
      .then(({ data }) => {
        setStats(data.stats);
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load live admin stats')))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
        <p className="text-slate-500 mt-1">
          {loading ? 'Loading live statistics...' : 'Real-time statistics and system status.'}
        </p>
        {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Services"
          value={stats.activeServices.toLocaleString()}
          icon={<BriefcaseBusiness size={24} className="text-emerald-600" />}
          color="bg-emerald-100"
          subtitle="Published provider services"
        />
        <StatCard
          title="Open Requests"
          value={stats.openRequests.toLocaleString()}
          icon={<Activity size={24} className="text-blue-600" />}
          color="bg-blue-100"
          subtitle="Service taker requests"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={<Users size={24} className="text-indigo-600" />}
          color="bg-indigo-100"
          subtitle="Registered accounts"
        />
        <StatCard
          title="Pending Approvals"
          value={stats.pendingProviders}
          icon={<CheckCircle size={24} className="text-amber-600" />}
          color="bg-amber-100"
          subtitle="Professionals waiting"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[300px]">
          <h3 className="font-bold text-slate-800 mb-4">Live Platform Mix</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatPill label="Providers" value={stats.totalProviders} />
            <StatPill label="Service Takers" value={stats.totalTakers} />
            <StatPill label="Open Requests" value={stats.openRequests} />
            <StatPill label="Pending Services" value={stats.pendingServices || 0} />
            <StatPill label="Open Reports" value={stats.openReports || 0} />
            <StatPill label="Active Subscriptions" value={stats.activeSubscriptions || 0} />
          </div>
          <div className="mt-6 rounded-xl bg-slate-50 p-5 text-sm font-medium text-slate-600">
            These numbers are loaded from protected admin APIs and reflect MongoDB records.
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 min-h-[300px]">
          <h3 className="font-bold text-slate-800 mb-4">System Alerts</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">Backend connection is configured for live admin stats.</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">Provider approvals are pulled from MongoDB.</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">User management actions call protected admin APIs.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-sm font-medium text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-900">{value.toLocaleString()}</p>
  </div>
);

export default AdminDashboard;
