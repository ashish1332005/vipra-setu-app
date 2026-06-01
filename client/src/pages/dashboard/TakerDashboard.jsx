import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Bell,
  Bookmark,
  BriefcaseBusiness,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const TakerDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState('');

  const load = () => {
    Promise.all([
      api.get('/service-takers/me/requests'),
      api.get('/service-takers/me/recommendations'),
      api.get('/service-takers/me/saved-providers'),
      api.get('/notifications'),
    ])
      .then(([requestsRes, recommendationsRes, savedRes, notificationRes]) => {
        setRequests(requestsRes.data.requests || []);
        setRecommendations(recommendationsRes.data.providers || []);
        setSavedProfiles(savedRes.data.profiles || []);
        setNotifications(notificationRes.data.notifications || []);
      })
      .catch((err) => setError(getApiErrorMessage(err, 'Unable to load dashboard')));
  };

  useEffect(load, []);

  const activeRequests = requests.filter((request) => !['completed', 'cancelled'].includes(request.status));
  const quotes = requests.filter((request) => request.quote?.status === 'sent');
  const openRequests = activeRequests.filter((request) => !request.provider);
  const scheduledRequests = activeRequests.filter((request) => request.preferredDate);
  const stats = useMemo(() => [
    { label: 'Active Bookings', value: activeRequests.length, icon: ClipboardList },
    { label: 'Quotes Received', value: quotes.length, icon: Sparkles },
    { label: 'Completed', value: requests.filter((request) => request.status === 'completed').length, icon: CheckCircle2 },
    { label: 'Saved Providers', value: savedProfiles.length, icon: Bookmark },
  ], [activeRequests.length, quotes.length, requests, savedProfiles.length]);

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="overflow-hidden rounded-2xl border border-indigo-100 bg-white shadow-sm">
        <div className="bg-[linear-gradient(135deg,#111827,#312e81_46%,#0891b2)] px-6 py-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-indigo-100">Customer Service Desk</p>
          <h2 className="mt-3 text-3xl font-black">Track every booking like a premium service app.</h2>
          <p className="mt-3 max-w-2xl text-sm font-medium text-indigo-50">
            Book service, compare providers, approve quotes, save trusted professionals and follow every request timeline.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link to="/taker/book" className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950">
              Book a Service
              <ArrowRight size={17} />
            </Link>
            <Link to="/taker/providers" className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-sm font-black text-white">
              Compare Providers
              <Search size={17} />
            </Link>
          </div>
        </div>
        {error && <div className="border-t border-red-100 bg-red-50 px-6 py-3 text-sm font-bold text-red-700">{error}</div>}
      </motion.section>

      <section className="grid gap-4 md:grid-cols-4">
        {stats.map((stat) => <StatCard key={stat.label} {...stat} />)}
      </section>

      {quotes.length > 0 && (
        <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-700">Action Needed</p>
              <h3 className="mt-1 text-xl font-black text-slate-950">You have {quotes.length} quote waiting for approval</h3>
            </div>
            <Link to="/taker/requests" className="rounded-xl bg-slate-950 px-4 py-3 text-sm font-black text-white">Review Quotes</Link>
          </div>
        </section>
      )}

      <section className="grid gap-4 lg:grid-cols-3">
        <ActionCard
          icon={MessageSquareQuote}
          title={`${quotes.length} quote approvals`}
          text="Review scope, price and validity before confirming the right provider."
          to="/taker/requests"
          action="Review Quotes"
          tone="amber"
        />
        <ActionCard
          icon={Search}
          title={`${openRequests.length} open requests`}
          text="Compare matching professionals or send a direct booking to a saved provider."
          to="/taker/providers"
          action="Find Providers"
          tone="indigo"
        />
        <ActionCard
          icon={CalendarClock}
          title={`${scheduledRequests.length} scheduled jobs`}
          text="Keep dates, preferred slots and request status visible from one dashboard."
          to="/taker/requests"
          action="Track Schedule"
          tone="cyan"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-950">Active Booking Tracker</h3>
              <p className="mt-1 text-sm font-medium text-slate-500">Latest request status, quote and schedule details.</p>
            </div>
            <Link to="/taker/requests" className="text-sm font-black text-indigo-700">View all</Link>
          </div>
          <div className="mt-5 space-y-3">
            {activeRequests.slice(0, 5).map((request) => (
              <article key={request._id} className="rounded-2xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="font-black text-slate-950">{request.title}</h4>
                    <p className="mt-1 text-sm font-bold text-indigo-700">{request.category} | {request.city}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge icon={CalendarClock} text={request.preferredDate ? new Date(request.preferredDate).toLocaleDateString() : 'Flexible date'} />
                      <Badge icon={BriefcaseBusiness} text={request.provider?.name || 'Open request'} />
                      <Badge icon={Sparkles} text={`Quote: ${request.quote?.status || 'not sent'}`} />
                      <Badge icon={ShieldCheck} text={request.provider ? 'Provider selected' : 'Matching providers'} />
                    </div>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-slate-700">{request.status.replace('_', ' ')}</span>
                </div>
              </article>
            ))}
            {activeRequests.length === 0 && <Empty text="No active bookings. Start with Book a Service." />}
          </div>
        </div>

        <div className="grid gap-6">
          <Panel title="Recommended Providers" action={{ label: 'Explore', to: '/taker/providers' }}>
            {recommendations.slice(0, 4).map((provider) => (
              <ProviderLine key={provider._id} provider={provider} />
            ))}
            {recommendations.length === 0 && <Empty text="Recommendations appear after your first request." />}
          </Panel>

          <Panel title="Saved Providers" action={{ label: 'Manage', to: '/taker/providers' }}>
            {savedProfiles.slice(0, 4).map((provider) => (
              <ProviderLine key={provider._id} provider={provider} />
            ))}
            {savedProfiles.length === 0 && <Empty text="Save providers for repeat booking." />}
          </Panel>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-indigo-700" />
          <h3 className="text-lg font-black text-slate-950">Recent Alerts</h3>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {notifications.slice(0, 4).map((item) => (
            <div key={item._id} className="rounded-2xl bg-slate-50 p-4">
              <p className="font-black text-slate-950">{item.title}</p>
              <p className="mt-1 text-sm font-medium text-slate-500">{item.message}</p>
            </div>
          ))}
          {notifications.length === 0 && <Empty text="No alerts yet." />}
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <Icon size={20} className="text-indigo-600" />
    </div>
    <p className="mt-4 text-3xl font-black text-slate-950">{value}</p>
  </div>
);

const ActionCard = ({ icon: Icon, title, text, to, action, tone }) => {
  const toneClass = {
    amber: 'bg-amber-50 text-amber-700',
    indigo: 'bg-indigo-50 text-indigo-700',
    cyan: 'bg-cyan-50 text-cyan-700',
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

const Panel = ({ title, action, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-black text-slate-950">{title}</h3>
      <Link to={action.to} className="text-sm font-black text-indigo-700">{action.label}</Link>
    </div>
    <div className="mt-4 space-y-3">{children}</div>
  </section>
);

const ProviderLine = ({ provider }) => (
  <div className="rounded-2xl bg-slate-50 px-4 py-3">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="font-black text-slate-900">{provider.businessName || provider.user?.name}</p>
        <p className="mt-1 text-sm font-medium text-slate-500">{provider.category} | {provider.city}</p>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-black text-amber-700">
        <Star size={12} className={provider.rating ? 'fill-current' : ''} />
        {provider.rating || 'New'}
      </span>
    </div>
  </div>
);

const Badge = ({ icon: Icon, text }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
    <Icon size={13} />
    {text}
  </span>
);

const Empty = ({ text }) => <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm font-bold text-slate-500">{text}</p>;

export default TakerDashboard;
