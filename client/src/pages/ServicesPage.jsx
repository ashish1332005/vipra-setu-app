import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Flame,
  HandHeart,
  MapPin,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  UsersRound,
  X,
} from 'lucide-react';

import { SERVICES } from '../components/CategoriesSection';
import AdPlacement from '../components/ads/AdPlacement';
import { useGlobalContext } from '../context/GlobalContext';
import logo from '../assets/logo.jpeg';
import parshuramHero from '../assets/parshuram-hero.png';

const ALL_FILTER = 'All';

const ServicesPage = () => {
  const navigate = useNavigate();
  const { providers, marketplaceLoading, marketplaceError } = useGlobalContext();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL_FILTER);

  const providerCountByCategory = useMemo(() => providers.reduce((counts, provider) => {
    counts[provider.category] = (counts[provider.category] || 0) + 1;
    return counts;
  }, {}), [providers]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return SERVICES.filter((service) => {
      const matchesCategory = activeCategory === ALL_FILTER || service.name === activeCategory;
      const searchableText = [
        service.name,
        service.desc,
        service.description,
        ...(service.workTypes || []),
      ].join(' ').toLowerCase();
      const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const totalWorkTypes = SERVICES.reduce((total, service) => total + service.workTypes.length, 0);
  const hasSearch = query.trim().length > 0 || activeCategory !== ALL_FILTER;

  const clearFilters = () => {
    setQuery('');
    setActiveCategory(ALL_FILTER);
  };

  return (
    <div className="min-h-screen bg-[#fffaf2] pb-10 text-slate-950">
      <section className="relative overflow-hidden border-b border-amber-100 bg-[#fffaf2]">
        <div className="absolute inset-x-0 top-0 h-[78%] bg-[radial-gradient(circle_at_16%_8%,rgba(251,191,36,0.3),transparent_28%),linear-gradient(135deg,#3b0b07_0%,#7f1d1d_48%,#111827_116%)]" />
        <div className="culture-pattern absolute inset-x-0 top-0 h-[78%] opacity-60" />

        <div className="site-shell relative py-6 sm:py-10">
          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-stretch">
            <div className="flex min-h-[430px] flex-col justify-between rounded-2xl border border-white/15 bg-white/10 p-4 text-white shadow-[0_28px_80px_rgba(67,20,7,0.22)] backdrop-blur sm:p-6 lg:p-7">
              <div>
                <span className="inline-flex max-w-full items-center gap-3 rounded-full border border-white/15 bg-white/12 py-1.5 pl-1.5 pr-4 shadow-sm backdrop-blur">
                  <img src={logo} alt="Vipra Sewa Setu" className="h-9 w-9 rounded-full object-cover" />
                  <span className="min-w-0">
                    <span className="block text-sm font-black leading-tight">Vipra Sewa Setu</span>
                    <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
                      Service | Community | Trust
                    </span>
                  </span>
                </span>

                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-[3.45rem]">
                  भरोसेमंद सेवा, simple booking.
                </h1>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/78 sm:text-base">
                  Discover verified providers for home, event, education, health, property, food, and professional support.
                </p>
              </div>

              <div className="mt-6 grid gap-2 sm:grid-cols-3">
                {[
                  [HandHeart, 'Service', 'Community first'],
                  [ShieldCheck, 'Trust', 'Verified support'],
                  [MapPin, 'Local', 'Bhilwara focused'],
                ].map(([Icon, title, text]) => (
                  <div key={title} className="rounded-xl border border-white/12 bg-white/10 p-3 backdrop-blur">
                    <Icon size={18} className="text-amber-200" />
                    <p className="mt-2 text-sm font-black text-white">{title}</p>
                    <p className="text-xs font-semibold text-white/58">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-[430px] overflow-hidden rounded-2xl border border-white/15 bg-slate-950 shadow-[0_28px_80px_rgba(15,23,42,0.34)]">
              <img
                src={parshuramHero}
                alt="Vipra Sewa Setu cultural service platform"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(67,20,7,0.18)_34%,rgba(15,23,42,0.92)_100%)]" />
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5">
                <div className="rounded-2xl border border-white/15 bg-slate-950/68 p-4 text-white backdrop-blur-md">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">सेवा Directory</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    {[
                      [SERVICES.length, 'Categories', BriefcaseBusiness],
                      [marketplaceLoading ? '...' : providers.length, 'Providers', UsersRound],
                      [totalWorkTypes, 'Services', ShieldCheck],
                    ].map(([value, label, Icon]) => (
                      <div key={label} className="rounded-xl bg-white/10 p-2 text-center">
                        <Icon size={16} className="mx-auto text-amber-200" />
                        <p className="mt-1 text-lg font-black">{value}</p>
                        <p className="text-[9px] font-black uppercase tracking-[0.08em] text-white/55">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-amber-100 bg-white p-3 shadow-[0_20px_55px_rgba(67,20,7,0.12)]">
            <label className="flex min-h-12 items-center gap-3 rounded-xl bg-slate-50 px-4 ring-1 ring-slate-100 focus-within:bg-white focus-within:ring-amber-300">
              <Search size={20} className="shrink-0 text-red-900" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search plumber, catering, coaching, property..."
                className="min-w-0 flex-1 bg-transparent text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-200 hover:text-slate-950"
                  aria-label="Clear search"
                >
                  <X size={16} />
                </button>
              )}
            </label>

            <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-300">
                <SlidersHorizontal size={16} />
              </span>
              {[ALL_FILTER, ...SERVICES.map((service) => service.name)].map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`min-h-9 shrink-0 rounded-xl px-3 text-xs font-black transition ${
                      isActive
                        ? 'bg-red-900 text-white shadow-sm'
                        : 'bg-amber-50 text-slate-700 ring-1 ring-amber-100 hover:bg-amber-100 hover:text-slate-950'
                    }`}
                  >
                    {category}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <main className="site-shell">
        <div className="mt-6">
          <AdPlacement placement="services" limit={2} />
        </div>

        <section className="mt-6">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-800">Service directory</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">What service do you need?</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Search, filter, and open a category to view providers.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-600 ring-1 ring-slate-200">
                {filteredServices.length} results
              </span>
              {hasSearch && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl bg-slate-950 px-3 py-2 text-sm font-black text-white transition hover:bg-red-900"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => {
                const Icon = service.icon;
                const providerCount = providerCountByCategory[service.name] || 0;
                const firstWorkTypes = service.workTypes.slice(0, 4);
                const remainingCount = Math.max(service.workTypes.length - firstWorkTypes.length, 0);

                return (
                  <article
                    key={service.id}
                    onClick={() => navigate(`/category/${encodeURIComponent(service.name)}`)}
                    className="group flex min-h-[310px] cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-amber-200 hover:shadow-[0_22px_55px_rgba(67,20,7,0.12)]"
                  >
                    <div className="relative border-b border-slate-100 bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_55%,#f8fafc_100%)] p-4">
                      <div className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${service.panel}`} />
                      <div className="flex items-start gap-4 pl-2">
                        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${service.tint} ring-1 ring-white`}>
                          <Icon size={23} strokeWidth={2.1} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-xl font-black leading-tight text-slate-950">{service.name}</h3>
                            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-black text-red-900 ring-1 ring-amber-100">
                              {providerCount} pros
                            </span>
                          </div>
                          <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-4">
                      <div className="flex flex-wrap gap-2">
                        {firstWorkTypes.map((workType) => (
                          <span key={workType} className="rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-100">
                            {workType}
                          </span>
                        ))}
                        {remainingCount > 0 && (
                          <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-black text-red-900 ring-1 ring-amber-100">
                            +{remainingCount} more
                          </span>
                        )}
                      </div>

                      <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-sm font-black text-red-900">View providers</span>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition group-hover:translate-x-1 group-hover:bg-red-900">
                          <ArrowRight size={18} />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-12 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-red-900">
                <Flame size={24} />
              </div>
              <p className="mt-4 text-lg font-black text-slate-950">No service found</p>
              <p className="mt-2 text-sm font-semibold text-slate-500">Try a broader service name or clear the selected filter.</p>
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl bg-red-900 px-5 py-2.5 text-sm font-black text-white transition hover:bg-slate-950"
              >
                Clear filters
              </button>
            </div>
          )}

          {marketplaceError && (
            <p className="mt-4 rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-bold text-amber-800">
              {marketplaceError}
            </p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ServicesPage;
