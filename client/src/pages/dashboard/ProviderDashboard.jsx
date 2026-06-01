import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  BellRing,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Clock3,
  MessageSquareQuote,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const statusClass = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  assigned: 'bg-blue-50 text-blue-700 border-blue-200',
  in_progress: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const ProviderDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [requests, setRequests] = useState([]);
  const [openRequests, setOpenRequests] = useState([]);
  const [error, setError] = useState('');

  const completed = requests.filter((request) => request.status === 'completed').length;
  const pendingFollowUps = requests.filter((request) => request.nextFollowUpAt && new Date(request.nextFollowUpAt) <= new Date()).length;
  const quoteReady = requests.filter((request) => ['assigned', 'in_progress'].includes(request.status) && request.quote?.status !== 'sent').length;
  const urgentOpenLeads = openRequests.filter((request) => ['urgent', 'emergency'].some((word) => `${request.priority || ''} ${request.description || ''}`.toLowerCase().includes(word))).length;

  useEffect(() => {
    Promise.all([
      api.get('/providers/me'),
      api.get('/providers/me/services'),
      api.get('/providers/me/requests'),
      api.get('/providers/me/open-requests'),
    ])
      .then(([profileRes, servicesRes, requestsRes, openRes]) => {
        setProfile(profileRes.data.profile);
        setServices(servicesRes.data.services);
        setRequests(requestsRes.data.requests);
        setOpenRequests(openRes.data.requests);
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load provider dashboard')));
  }, []);

  const stats = useMemo(() => [
    { label: 'Live Services', value: services.filter((service) => service.isActive).length, icon: BriefcaseBusiness },
    { label: 'Assigned Requests', value: requests.length, icon: ClipboardList },
    { label: 'Completed Work', value: completed, icon: CheckCircle2 },
    { label: 'Open Leads', value: openRequests.length, icon: Clock3 },
    { label: 'Quotes Needed', value: quoteReady, icon: MessageSquareQuote },
    { label: 'Follow-ups Due', value: pendingFollowUps, icon: CalendarClock },
  ], [completed, openRequests.length, pendingFollowUps, quoteReady, requests.length, services]);
  const profileComplete = [
    profile?.businessName || profile?.user?.name,
    profile?.category,
    profile?.city,
    profile?.rate,
    profile?.availability,
    profile?.skills?.length,
  ].filter(Boolean).length;
  const profileScore = Math.round((profileComplete / 6) * 100);

  return (
    <div className="space-y-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm"
      >
        <div className="bg-[linear-gradient(135deg,#7c2d12,#ea580c_45%,#1e1b4b)] px-6 py-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-orange-100">Provider Control Room</p>
          <h2 className="mt-3 text-3xl font-black">Manage seva listings, leads, and approvals.</h2>
          <p className="mt-3 max-w-2xl text-sm font-medium text-orange-50">
            Keep your profile updated, publish services, claim matching requests, and move work through completion.
          </p>
        </div>
        {error && <div className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm font-bold text-red-700">{error}</div>}
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center rounded-2xl border border-orange-100 bg-white p-5 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
            <Sparkles size={23} />
          </span>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Growth checklist</p>
            <h3 className="mt-1 text-xl font-black text-slate-950">Your public listing is {profileScore}% complete</h3>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
              Complete profile details and publish active services to improve trust and receive better leads.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link to="/provider/profile" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white hover:bg-orange-700">
            Improve Profile
            <ArrowRight size={16} />
          </Link>
          <Link to="/provider/services" className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
            Publish Service
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-slate-500">{stat.label}</p>
                <Icon size={20} className="text-orange-600" />
              </div>
              <p className="mt-4 text-3xl font-black text-slate-950">{stat.value}</p>
            </div>
          );
        })}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          icon={BellRing}
          title={`${urgentOpenLeads} urgent open leads`}
          text="Review matching leads first and claim the right work before competitors respond."
          to="/provider/requests"
          action="Review Leads"
          tone="orange"
        />
        <ActionCard
          icon={MessageSquareQuote}
          title={`${quoteReady} quotes can be sent`}
          text="Use the quote builder to share amount, scope, validity and customer-ready terms."
          to="/provider/business"
          action="Build Quotes"
          tone="blue"
        />
        <ActionCard
          icon={TrendingUp}
          title="Upgrade discoverability"
          text="Complete profile, service area, emergency availability and weekly timing for better matching."
          to="/provider/profile"
          action="Improve Trust"
          tone="emerald"
        />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">Profile Health</h3>
          <div className="mt-4 space-y-3 text-sm">
            <InfoRow label="Business" value={profile?.businessName || profile?.user?.name || '-'} />
            <InfoRow label="Category" value={profile?.category || '-'} />
            <InfoRow label="City" value={profile?.city || '-'} />
            <InfoRow label="Approval" value={profile?.isApproved ? 'Approved' : 'Pending admin approval'} />
            <InfoRow label="Trust Signal" value={profile?.isApproved ? 'Verified provider' : 'Needs verification'} />
            <InfoRow label="Emergency Work" value={profile?.businessSettings?.acceptsEmergency ? 'Accepted' : 'Off'} />
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">Recent Requests</h3>
          <div className="mt-4 space-y-3">
            {requests.slice(0, 4).map((request) => (
              <RequestLine key={request._id} request={request} />
            ))}
            {requests.length === 0 && <p className="text-sm font-medium text-slate-500">No assigned requests yet.</p>}
          </div>
        </div>
      </section>
    </div>
  );
};

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3">
    <span className="font-bold text-slate-500">{label}</span>
    <span className="text-right font-black text-slate-900">{value}</span>
  </div>
);

const ActionCard = ({ icon: Icon, title, text, to, action, tone }) => {
  const toneClass = {
    orange: 'bg-orange-50 text-orange-700',
    blue: 'bg-blue-50 text-blue-700',
    emerald: 'bg-emerald-50 text-emerald-700',
  }[tone];

  return (
    <Link to={to} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start gap-4">
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon size={20} />
        </span>
        <div>
          <h3 className="text-base font-black text-slate-950">{title}</h3>
          <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{text}</p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-slate-900">
            {action}
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
};

const RequestLine = ({ request }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
    <div className="flex items-center justify-between gap-3">
      <p className="font-black text-slate-900">{request.title}</p>
      <span className={`rounded-full border px-2.5 py-1 text-xs font-black ${statusClass[request.status] || statusClass.assigned}`}>
        {request.status}
      </span>
    </div>
    <p className="mt-1 text-sm font-medium text-slate-500">{request.category} | {request.city}</p>
  </div>
);

export default ProviderDashboard;
