import { useEffect, useMemo, useState } from 'react';
import { Bookmark, BriefcaseBusiness, CheckCircle2, Flag, MapPin, Search, Send, ShieldCheck, Star } from 'lucide-react';
import api from '../../services/api';
import { useGlobalContext } from '../../context/GlobalContext';
import { getApiErrorMessage } from '../../utils/apiError';

const TakerProviders = () => {
  const [providers, setProviders] = useState([]);
  const [savedProfiles, setSavedProfiles] = useState([]);
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [compareIds, setCompareIds] = useState([]);
  const [message, setMessage] = useState('');
  const { serviceCategories } = useGlobalContext();

  const load = () => {
    Promise.all([
      api.get('/providers'),
      api.get('/service-takers/me/saved-providers'),
    ]).then(([providersRes, savedRes]) => {
      setProviders(providersRes.data.providers || []);
      setSavedProfiles(savedRes.data.profiles || []);
    }).catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load providers')));
  };

  useEffect(load, []);

  const filteredProviders = useMemo(() => {
    const normalized = query.toLowerCase().trim();
    const nextProviders = providers.filter((provider) => {
      const text = [provider.businessName, provider.user?.name, provider.category, provider.city, provider.rate, ...(provider.skills || [])].join(' ').toLowerCase();
      return (category === 'All' || provider.category === category) && (!normalized || text.includes(normalized));
    });

    return [...nextProviders].sort((left, right) => {
      if (sortBy === 'rating') return (right.rating || 0) - (left.rating || 0);
      if (sortBy === 'jobs') return (right.completedJobs || 0) - (left.completedJobs || 0);
      return (right.rating || 0) - (left.rating || 0)
        || (right.completedJobs || 0) - (left.completedJobs || 0);
    });
  }, [category, providers, query, sortBy]);

  const compareProviders = filteredProviders.filter((provider) => compareIds.includes(provider._id));

  const requestProvider = async (provider) => {
    try {
      await api.post('/service-takers/me/requests', {
        provider: provider.user?._id,
        category: provider.category,
        title: `Direct booking request for ${provider.businessName || provider.user?.name}`,
        description: `I want a quote and availability for ${provider.category}.`,
        city: provider.city,
        budgetLabel: provider.rate || 'Open quote',
      });
      setMessage('Trackable booking request sent to provider.');
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to send request'));
    }
  };

  const saveProvider = async (provider) => {
    try {
      await api.post(`/service-takers/me/saved-providers/${provider.user?._id}`);
      setMessage('Provider saved.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to save provider'));
    }
  };

  const reportProvider = async (provider) => {
    try {
      await api.post('/service-takers/me/reports', {
        provider: provider.user?._id,
        reason: 'Customer reported provider',
        details: `Reported from provider discovery: ${provider.businessName || provider.user?.name}`,
      });
      setMessage('Report submitted to admin.');
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to submit report'));
    }
  };

  const toggleCompare = (provider) => {
    setCompareIds((current) => {
      if (current.includes(provider._id)) return current.filter((id) => id !== provider._id);
      return [...current, provider._id].slice(-3);
    });
  };

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-red-800">Provider Marketplace</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Compare verified local professionals</h2>
            <p className="mt-2 text-sm font-medium text-slate-500">Search, save, compare and send a trackable booking request.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <label className="flex min-w-64 items-center gap-2 rounded-xl border border-slate-200 px-4 py-3">
              <Search size={18} className="text-slate-400" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, city, skill" className="w-full bg-transparent text-sm font-semibold outline-none" />
            </label>
            <select value={category} onChange={(event) => setCategory(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none">
              <option value="All">All Categories</option>
              {serviceCategories.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none">
              <option value="recommended">Recommended</option>
              <option value="rating">Highest rated</option>
              <option value="jobs">Most completed</option>
            </select>
          </div>
        </div>

        {message && <p className="mt-5 rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-red-900">{message}</p>}
      </section>

      {compareProviders.length > 0 && (
        <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-black text-slate-950">Compare selected providers</h3>
              <p className="mt-1 text-sm font-medium text-slate-600">Up to 3 providers can be compared at once.</p>
            </div>
            <button onClick={() => setCompareIds([])} className="rounded-full bg-white px-3 py-1.5 text-xs font-black text-slate-600">Clear</button>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {compareProviders.map((provider) => (
              <div key={provider._id} className="rounded-2xl bg-white p-4">
                <h4 className="font-black text-slate-950">{provider.businessName || provider.user?.name}</h4>
        <p className="mt-1 text-sm font-bold text-red-900">{provider.category}</p>
                <CompareRow label="Rating" value={provider.rating || 'New'} />
                <CompareRow label="Jobs" value={provider.completedJobs || 0} />
                <CompareRow label="Rate" value={provider.rate || 'Custom quote'} />
                <CompareRow label="Response" value={provider.responseTimeLabel || '24 hours'} />
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <section className="grid gap-4 md:grid-cols-2">
          {filteredProviders.map((provider) => (
            <ProviderCard
              key={provider._id}
              provider={provider}
              selected={compareIds.includes(provider._id)}
              onCompare={() => toggleCompare(provider)}
              onRequest={() => requestProvider(provider)}
              onSave={() => saveProvider(provider)}
              onReport={() => reportProvider(provider)}
            />
          ))}
          {filteredProviders.length === 0 && <Empty text="No providers match your filters." />}
        </section>

        <aside className="space-y-4">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-slate-950">Saved Providers</h3>
            <div className="mt-4 space-y-3">
              {savedProfiles.slice(0, 5).map((provider) => (
                <div key={provider._id} className="rounded-xl bg-slate-50 px-4 py-3">
                  <p className="font-black text-slate-900">{provider.businessName || provider.user?.name}</p>
                  <p className="mt-1 text-xs font-bold text-slate-500">{provider.category} | {provider.city}</p>
                </div>
              ))}
              {savedProfiles.length === 0 && <Empty text="No saved providers yet." />}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
};

const ProviderCard = ({ provider, selected, onCompare, onRequest, onSave, onReport }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <h3 className="font-black text-slate-950">{provider.businessName || provider.user?.name}</h3>
        </div>
        <p className="mt-1 text-sm font-bold text-red-900">{provider.category} | {provider.city}</p>
      </div>
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700">
        <Star size={13} className={provider.rating ? 'fill-current' : ''} />
        {provider.rating || 'New'}
      </span>
    </div>
    <p className="mt-3 text-sm font-medium leading-6 text-slate-600">{provider.skills?.join(', ') || 'Trusted community professional'}</p>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <Mini icon={ShieldCheck} label="Trust" value={provider.isApproved ? 'Verified' : 'Pending'} />
      <Mini icon={BriefcaseBusiness} label="Jobs" value={provider.completedJobs || 0} />
      <Mini icon={MapPin} label="Rate" value={provider.rate || 'Custom'} />
      <Mini icon={CheckCircle2} label="Response" value={provider.responseTimeLabel || '24h'} />
    </div>
    <div className="mt-4 grid grid-cols-2 gap-2">
      <button onClick={onRequest} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-3 text-xs font-black text-white hover:bg-indigo-700">
        <Send size={15} />
        Book
      </button>
      <button onClick={onCompare} className={`rounded-xl px-4 py-3 text-xs font-black ${selected ? 'bg-amber-100 text-red-900' : 'border border-slate-200 bg-white text-slate-700'}`}>
        {selected ? 'Selected' : 'Compare'}
      </button>
      <button onClick={onSave} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-black text-slate-700 hover:bg-slate-50">
        <Bookmark size={14} />
        Save
      </button>
      <button onClick={onReport} className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-xs font-black text-red-700 hover:bg-red-100">
        <Flag size={14} />
        Report
      </button>
    </div>
  </article>
);

const Mini = ({ icon: Icon, label, value }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">
      <Icon size={12} />
      {label}
    </p>
    <p className="mt-1 truncate text-xs font-black text-slate-800">{value}</p>
  </div>
);

const CompareRow = ({ label, value }) => (
  <div className="mt-3 flex items-center justify-between gap-3 text-sm">
    <span className="font-bold text-slate-500">{label}</span>
    <span className="text-right font-black text-slate-900">{value}</span>
  </div>
);

const Empty = ({ text }) => <p className="rounded-xl border border-dashed border-slate-200 p-5 text-center text-sm font-bold text-slate-500">{text}</p>;

export default TakerProviders;
