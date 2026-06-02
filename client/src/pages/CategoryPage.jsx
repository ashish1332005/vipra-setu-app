import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, ChevronRight, MapPin, Phone, Search, Send, Sparkles, User } from 'lucide-react';
import FilterBar from '../components/category/FilterBar';
import HorizontalWorkerCard from '../components/category/HorizontalWorkerCard';
import SidebarLeadForm from '../components/category/SidebarLeadForm';
import SidebarTopPicks from '../components/category/SidebarTopPicks';
import { useGlobalContext } from '../context/GlobalContext';
import { getCategoryConfig, isSameCategory } from '../data/marketplace';
import api from '../services/api';
import { getApiErrorMessage } from '../utils/apiError';

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const inputClass =
  'w-full rounded-2xl border border-amber-100 bg-[#fffaf2] px-3 py-3 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const decodedCategory = decodeURIComponent(categoryName);
  const { currentUser, marketplaceWorkers, marketplaceLoading, marketplaceError, loadMarketplace } = useGlobalContext();
  const [selectedService, setSelectedService] = useState('');
  const [providerQuery, setProviderQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [requestForm, setRequestForm] = useState({
    name: '',
    phone: '',
    city: 'Bhilwara',
    address: '',
    preferredDate: '',
    description: '',
  });
  const [requestMessage, setRequestMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const categoryConfig = getCategoryConfig(decodedCategory);
  const displayCategory = categoryConfig?.name || decodedCategory;
  const workTypes = categoryConfig?.workTypes || [];
  const activeService = selectedService || workTypes[0] || displayCategory;

  const categoryWorkers = useMemo(() => {
    return marketplaceWorkers.filter(
      worker => worker.category && isSameCategory(worker.category, displayCategory)
    );
  }, [displayCategory, marketplaceWorkers]);

  const serviceWorkers = useMemo(() => {
    const normalizedQuery = providerQuery.trim().toLowerCase();
    let nextWorkers = categoryWorkers;

    if (selectedService) {
      const normalizedService = selectedService.toLowerCase();
      const matchingWorkers = nextWorkers.filter((worker) =>
        (worker.tags || []).some((tag) => tag.toLowerCase().includes(normalizedService))
      );
      nextWorkers = matchingWorkers.length > 0 ? matchingWorkers : nextWorkers;
    }

    if (normalizedQuery) {
      nextWorkers = nextWorkers.filter((worker) =>
        [worker.name, worker.category, worker.city, worker.rate, worker.availability, ...(worker.tags || [])]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery)
      );
    }

    if (onlyAvailable) {
      nextWorkers = nextWorkers.filter((worker) => (worker.availability || '').toLowerCase().includes('available'));
    }

    return [...nextWorkers].sort((left, right) => {
      if (sortBy === 'profile') return (right.profileScore || 0) - (left.profileScore || 0);
      if (sortBy === 'services') return (right.serviceCount || 0) - (left.serviceCount || 0);
      if (sortBy === 'rating') return (right.rating || 0) - (left.rating || 0);
      return (right.isApproved === true) - (left.isApproved === true)
        || (right.profileScore || 0) - (left.profileScore || 0)
        || (right.serviceCount || 0) - (left.serviceCount || 0);
    });
  }, [categoryWorkers, onlyAvailable, providerQuery, selectedService, sortBy]);

  const handleRequestChange = (field, value) => {
    setRequestForm((current) => ({ ...current, [field]: value }));
  };

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    setRequestMessage('');

    if (!currentUser) {
      navigate('/login', { state: { from: `/category/${encodeURIComponent(displayCategory)}` } });
      return;
    }

    if (currentUser.role !== 'service_taker') {
      setRequestMessage('Please use a service taker account to create service requests.');
      return;
    }

    setSubmitting(true);

    try {
      await api.post('/service-takers/me/requests', {
        category: displayCategory,
        title: activeService,
        description: requestForm.description,
        city: requestForm.city,
        address: requestForm.address,
        preferredDate: requestForm.preferredDate || undefined,
      });
      setRequestMessage('Request saved. Providers can now see and claim it.');
      setRequestForm({
        name: '',
        phone: '',
        city: 'Bhilwara',
        address: '',
        preferredDate: '',
        description: '',
      });
      loadMarketplace();
    } catch (error) {
      setRequestMessage(getApiErrorMessage(error, 'Unable to create request'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#fbf7f0] font-sans text-slate-950">
      <div className="site-shell py-4 sm:py-6">
        <nav className="mb-3 flex items-center gap-2 overflow-x-auto whitespace-nowrap text-xs font-semibold text-slate-500">
          <Link to="/" className="hover:text-red-900">Bhilwara</Link>
          <ChevronRight size={12} />
          <span className="cursor-pointer hover:text-red-900">{displayCategory} in Bhilwara</span>
          <ChevronRight size={12} />
          <span>{marketplaceLoading ? 'Loading listings' : `${categoryWorkers.length} Listings`}</span>
        </nav>

        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="overflow-hidden rounded-[1.5rem] border border-amber-100 bg-white shadow-[0_22px_60px_rgba(67,20,7,0.08)]"
        >
          <div className="grid lg:grid-cols-[1fr_360px]">
            <div className="bg-[linear-gradient(135deg,#fffdf8_0%,#fff7ed_100%)] p-4 sm:p-7 lg:p-9">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-900 shadow-sm">
                <Sparkles size={14} />
                Trusted Category
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
              </span>

              <h1 className="mt-4 text-3xl font-black leading-tight text-slate-950 sm:text-5xl">
                {displayCategory} services in Bhilwara
              </h1>
              {categoryConfig?.description && (
                <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-slate-600 md:text-base">
                  {categoryConfig.description}
                </p>
              )}

              <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-amber-100 bg-white text-center shadow-sm">
                {[
                  [workTypes.length || '7+', 'Services'],
                  [marketplaceLoading ? '...' : categoryWorkers.length, 'Providers'],
                  ['Local', 'Support'],
                ].map(([value, label], index) => (
                  <div key={label} className={`px-2 py-4 ${index < 2 ? 'border-r border-amber-100' : ''}`}>
                    <span className="block text-xl font-black text-red-900">{value}</span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-red-950 p-4 text-white sm:p-7 lg:p-8">
              <div className="flex h-full flex-col justify-between rounded-[1.35rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300 text-red-950">
                    <Search size={23} />
                  </div>
                  <h2 className="mt-5 text-2xl font-black leading-tight">Choose service, send request</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-amber-50/76">
                    Select exact work type and submit requirement. Team/provider will connect with you.
                  </p>
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-amber-200">Selected</p>
                  <p className="mt-1 text-lg font-black">{activeService}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {workTypes.length > 0 && (
          <motion.section
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="mt-5 rounded-[1.35rem] border border-amber-100 bg-white p-4 shadow-sm md:p-5"
          >
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-800">Available Work</p>
                <h2 className="mt-1 text-xl font-black text-slate-900">
                  Select a {displayCategory} service
                </h2>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Service choose karo, phir apply/order form submit kar do.
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-500">
                {workTypes.length} services available
              </span>
            </div>
            <div className="mt-4 flex snap-x gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 xl:grid-cols-3">
              {workTypes.map((workType) => (
                <button
                  key={workType}
                  type="button"
                  onClick={() => setSelectedService(workType)}
                  className={`group flex min-h-[104px] min-w-[78%] snap-start flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md sm:min-w-0 ${
                    activeService === workType
                      ? 'border-amber-300 bg-[#fff7ed] shadow-sm'
                      : 'border-amber-100 bg-white hover:border-amber-200 hover:bg-[#fffaf2]'
                  }`}
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    <span className="text-base font-black text-slate-900">{workType}</span>
                    {activeService === workType && <CheckCircle2 size={18} className="shrink-0 text-red-900" />}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-black text-red-900">
                    Apply / Order <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              ))}
            </div>
          </motion.section>
        )}

        <div className="sticky top-[64px] z-30 mt-4 border-b border-amber-100 bg-[#fbf7f0]/95 pb-3 backdrop-blur lg:static">
          <FilterBar
            query={providerQuery}
            onQueryChange={setProviderQuery}
            sortBy={sortBy}
            onSortChange={setSortBy}
            onlyAvailable={onlyAvailable}
            onOnlyAvailableChange={setOnlyAvailable}
            resultCount={serviceWorkers.length}
          />
        </div>

        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          <div className="flex-1 lg:w-2/3 xl:w-3/4">
            <div className="mb-4 rounded-[1.35rem] border border-amber-100 bg-white p-4 shadow-sm">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-red-800">Selected Service</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{activeService}</h2>
              <p className="mt-1 text-sm font-medium text-slate-500">
                Compare providers, filter by skill or city, then send a request after login.
              </p>
            </div>

            {serviceWorkers.length > 0 ? (
              serviceWorkers.map((worker, index) => (
                <motion.div
                  key={worker.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.04, duration: 0.38 }}
                >
                  <HorizontalWorkerCard worker={worker} />
                </motion.div>
              ))
            ) : (
              <div className="rounded-[1.35rem] border border-dashed border-amber-200 bg-white p-8 text-center">
                <h2 className="text-xl font-black text-slate-900">No providers found yet</h2>
                <p className="mt-2 text-sm text-slate-500">
                  {marketplaceError || `Approved ${activeService} professionals will appear here after providers publish profiles.`}
                </p>
              </div>
            )}
          </div>

          <div className="w-full shrink-0 lg:w-80 xl:w-96">
            <div className="mb-4 rounded-[1.35rem] border border-amber-100 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <div className="mb-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-red-800">Apply Now</p>
                <h3 className="mt-1 text-lg font-black text-slate-900">Order {activeService}</h3>
                <p className="mt-1 text-sm font-medium text-slate-500">
                  Apni requirement bhejein, team/provider aapko contact karega.
                </p>
              </div>

              <form className="grid gap-3" onSubmit={handleRequestSubmit}>
                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Service
                  <select
                    value={activeService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className={inputClass}
                  >
                    {workTypes.map((workType) => (
                      <option key={workType} value={workType}>{workType}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Name
                  <span className="relative">
                    <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className={`${inputClass} pl-10`}
                      placeholder="Your name"
                      value={requestForm.name}
                      onChange={(event) => handleRequestChange('name', event.target.value)}
                    />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Mobile Number
                  <span className="relative">
                    <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="tel"
                      className={`${inputClass} pl-10`}
                      placeholder="10-digit mobile number"
                      value={requestForm.phone}
                      onChange={(event) => handleRequestChange('phone', event.target.value)}
                    />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  City
                  <span className="relative">
                    <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      className={`${inputClass} pl-10`}
                      placeholder="City"
                      required
                      value={requestForm.city}
                      onChange={(event) => handleRequestChange('city', event.target.value)}
                    />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Address
                  <input
                    className={inputClass}
                    placeholder="Area / address"
                    value={requestForm.address}
                    onChange={(event) => handleRequestChange('address', event.target.value)}
                  />
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Preferred Date
                  <span className="relative">
                    <CalendarCheck size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      className={`${inputClass} pl-10`}
                      value={requestForm.preferredDate}
                      onChange={(event) => handleRequestChange('preferredDate', event.target.value)}
                    />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Requirement
                  <textarea
                    className={`${inputClass} min-h-24 resize-none`}
                    placeholder={`Tell us about your ${activeService} requirement`}
                    required
                    value={requestForm.description}
                    onChange={(event) => handleRequestChange('description', event.target.value)}
                  />
                </label>

                {requestMessage && (
                  <p className="rounded-2xl bg-amber-50 px-4 py-3 text-sm font-bold text-red-900">
                    {requestMessage}
                  </p>
                )}

                <button
                  disabled={submitting}
                  className="mt-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-red-950 px-4 py-3 text-sm font-black text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <Send size={16} />
                  {!currentUser ? 'Login to Get Service' : submitting ? 'Saving...' : 'Apply / Order Now'}
                </button>
              </form>
            </div>

            <SidebarLeadForm categoryName={activeService} />
            <SidebarTopPicks categoryName={displayCategory} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
