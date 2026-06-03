import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Activity, CheckCircle, BriefcaseBusiness, Megaphone, ShieldCheck } from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const StatCard = ({ title, value, icon, subtitle, color }) => (
  <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className={`rounded-xl p-3 ${color}`}>
      {icon}
    </div>
    <div>
      <p className="mb-1 text-sm font-bold text-slate-500">{title}</p>
      <h3 className="text-2xl font-black text-slate-900">{value}</h3>
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
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-[#3b0b07] via-[#7f1d1d] to-slate-950 px-5 py-6 text-white sm:px-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Admin Control Center</p>
          <h1 className="mt-2 text-3xl font-black">Manage trust, services, and ads.</h1>
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-6 text-white/72">
            {loading ? 'Loading live statistics...' : 'Real-time platform status for users, providers, requests, and sponsored placements.'}
          </p>
          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <Link to="/admin/ads" className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-4 py-3 text-sm font-black text-red-950">
              <Megaphone size={17} />
              Manage Ads
            </Link>
            <Link to="/admin/providers" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-black text-white">
              <ShieldCheck size={17} />
              Review Providers
            </Link>
          </div>
        </div>
        {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{error}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-h-[300px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="mb-4 font-black text-slate-800">Live Platform Mix</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <StatPill label="Providers" value={stats.totalProviders} />
            <StatPill label="Service Takers" value={stats.totalTakers} />
            <StatPill label="Open Requests" value={stats.openRequests} />
            <StatPill label="Pending Services" value={stats.pendingServices || 0} />
            <StatPill label="Open Reports" value={stats.openReports || 0} />
          </div>
          <div className="mt-6 rounded-xl bg-amber-50 p-5 text-sm font-bold text-red-900">
            Use Ads Control to target one service category, one placement, and one provider sponsor when needed.
          </div>
        </div>
        <div className="min-h-[300px] rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-black text-slate-800">Admin Priorities</h3>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">Approve trusted providers before increasing ad visibility.</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">Keep ads category-specific to avoid irrelevant promotion.</span>
            </li>
            <li className="flex gap-3 text-sm">
              <span className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
              <span className="text-slate-600">Watch open requests so local customers get quick responses.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const StatPill = ({ label, value }) => (
  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <p className="text-sm font-bold text-slate-500">{label}</p>
    <p className="mt-2 text-2xl font-black text-slate-900">{value.toLocaleString()}</p>
  </div>
);

export default AdminDashboard;
