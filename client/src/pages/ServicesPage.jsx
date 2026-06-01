import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  CheckCircle2,
  Flame,
  MapPin,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';
import { SERVICES } from '../components/CategoriesSection';
import TopAdCarousel from '../components/TopAdCarousel';
import { useGlobalContext } from '../context/GlobalContext';

const TRUST_BADGES = [
  { icon: ShieldCheck, title: 'Verified', text: 'Trusted providers' },
  { icon: MapPin, title: 'Bhilwara', text: 'Local support' },
  { icon: Star, title: 'Rated', text: 'Easy comparison' },
];

const ServicesPage = () => {
  const navigate = useNavigate();
  const { providers, marketplaceLoading, marketplaceError } = useGlobalContext();
  const [query, setQuery] = useState('');
  const providerCountByCategory = useMemo(() => providers.reduce((counts, provider) => {
    counts[provider.category] = (counts[provider.category] || 0) + 1;
    return counts;
  }, {}), [providers]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    if (!normalizedQuery) {
      return SERVICES;
    }

    return SERVICES.filter((service) =>
      [
        service.name,
        service.desc,
        service.description,
        ...(service.workTypes || []),
      ]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery)
    );
  }, [query]);

  const totalProfessionals = providers.length;

  const featuredService = SERVICES[0];
  const FeaturedIcon = featuredService.icon;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_42%,#ffffff_100%)] pb-10 pt-4 text-slate-950 sm:pt-8 lg:py-14">
      <TopAdCarousel placement="services" />
      <div className="site-shell max-w-7xl">
        <section className="relative overflow-hidden rounded-[1.6rem] border border-orange-100 bg-white shadow-[0_18px_60px_rgba(127,29,29,0.10)] sm:rounded-3xl">
          <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(135deg,#7f1d1d_0%,#f59e0b_120%)] lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[46%]" />
          <div className="absolute inset-0 opacity-[0.08] [background-image:radial-gradient(circle_at_1px_1px,#431407_1px,transparent_0)] [background-size:18px_18px]" />
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="relative px-4 pb-6 pt-5 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/85 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-900 shadow-sm backdrop-blur lg:border-orange-100 lg:bg-amber-50">
                <Sparkles size={14} />
                Seva Categories
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
              </span>

              <h1 className="mt-5 max-w-3xl text-3xl font-black leading-[1.06] tracking-tight text-white drop-shadow-sm sm:text-6xl lg:text-slate-950 lg:drop-shadow-none">
                सेवा, रोजगार और भरोसेमंद मदद एक ही जगह
              </h1>

              <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/86 sm:mt-4 sm:text-lg sm:leading-8 lg:text-slate-600">
                Home, event, education, health, property, food aur business support ke verified local providers ko fast discover karein.
              </p>

              <div className="sticky top-[74px] z-20 mt-5 flex items-center gap-3 rounded-2xl border border-white/40 bg-white px-4 py-3 shadow-[0_14px_35px_rgba(67,20,7,0.16)] sm:static sm:mt-6 lg:border-slate-200 lg:bg-slate-50 lg:shadow-none">
                <Search size={19} className="shrink-0 text-slate-400" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search plumber, catering, coaching..."
                  className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="mt-5 grid grid-cols-3 overflow-hidden rounded-2xl border border-orange-100 bg-white text-center shadow-sm sm:mt-6">
                <div className="border-r border-orange-100 px-2 py-4">
                  <span className="block text-xl font-black text-red-900">{SERVICES.length}</span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Categories</span>
                </div>
                <div className="border-r border-orange-100 px-2 py-4">
                  <span className="block text-xl font-black text-red-900">{marketplaceLoading ? '...' : totalProfessionals}</span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Providers</span>
                </div>
                <div className="px-2 py-4">
                  <span className="block text-xl font-black text-red-900">Local</span>
                  <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">Support</span>
                </div>
              </div>
            </div>

            <div className="relative p-4 pt-0 text-white sm:p-8 lg:p-10">
              <div className="flex h-full flex-col justify-between overflow-hidden rounded-[1.4rem] border border-white/15 bg-[linear-gradient(145deg,#431407_0%,#7f1d1d_52%,#0f172a_100%)] p-5 shadow-[0_22px_55px_rgba(67,20,7,0.28)] sm:rounded-3xl">
                <div className="absolute right-8 top-8 h-20 w-20 rounded-full border border-amber-300/25" />
                <div className="absolute right-14 top-14 h-28 w-28 rounded-full border border-amber-300/15" />
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white ${featuredService.iconColor}`}>
                      <FeaturedIcon size={31} strokeWidth={2.1} />
                    </div>
                    <span className="rounded-full bg-amber-300 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-red-950">
                      Featured
                    </span>
                  </div>

                  <h2 className="mt-7 text-2xl font-black leading-tight sm:text-3xl">
                    Start with {featuredService.name}
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-6 text-amber-50/82">
                    {featuredService.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {featuredService.workTypes.slice(0, 5).map((workType) => (
                      <span key={workType} className="rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-100">
                        {workType}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/category/${encodeURIComponent(featuredService.name)}`)}
                  className="relative mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-red-950 transition-colors hover:bg-amber-50"
                >
                  Explore featured service
                  <ArrowRight size={17} />
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-5 flex snap-x gap-3 overflow-x-auto pb-1 sm:mt-8 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0">
          {TRUST_BADGES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex min-w-[78%] snap-start items-center gap-4 rounded-2xl border border-orange-100 bg-white p-4 shadow-sm sm:min-w-0">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-red-900">
                <Icon size={21} />
              </span>
              <span>
                <span className="block font-black text-slate-950">{title}</span>
                <span className="mt-0.5 block text-sm font-medium text-slate-500">{text}</span>
              </span>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-4 rounded-3xl border border-slate-200 bg-slate-950 p-5 text-white shadow-sm sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-400 text-slate-950">
              <Rocket size={23} />
            </span>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-200">For professionals</p>
              <h2 className="mt-1 text-2xl font-black">List your service and start receiving local leads.</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-300">
                Create provider account, complete profile, publish services, and claim matching customer requests from your dashboard.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-black text-slate-950 hover:bg-sky-50"
          >
            Become a Provider
            <ArrowRight size={17} />
          </button>
        </section>

        <section className="mt-6 sm:mt-10">
          <div className="mb-4 flex items-end justify-between gap-4">
            <div>
              <span className="text-xs font-black uppercase tracking-[0.18em] text-red-800">Categories</span>
              <h2 className="mt-1 text-2xl font-black text-slate-950 sm:text-3xl">Choose a service</h2>
            </div>
            <span className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-slate-500 ring-1 ring-slate-200 sm:inline-flex">
              {filteredServices.length} results
            </span>
          </div>

          <div className="mb-4 flex snap-x gap-2 overflow-x-auto pb-1 sm:hidden">
            {SERVICES.map((service) => {
              const Icon = service.icon;

              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => navigate(`/category/${encodeURIComponent(service.name)}`)}
                  className="flex min-w-max snap-start items-center gap-2 rounded-full border border-orange-100 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm"
                >
                  <Icon size={15} className={service.iconColor} />
                  {service.name}
                </button>
              );
            })}
          </div>

          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
              {filteredServices.map((service) => {
                const Icon = service.icon;

                return (
                  <article
                    key={service.id}
                    onClick={() => navigate(`/category/${encodeURIComponent(service.name)}`)}
                    className="group relative cursor-pointer overflow-hidden rounded-[1.35rem] border border-orange-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-200 hover:shadow-[0_18px_45px_rgba(127,29,29,0.12)] sm:rounded-3xl"
                  >
                    <div className={`relative bg-gradient-to-br ${service.accent} p-4 sm:p-5`}>
                      <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full ${service.glow} opacity-10 blur-2xl transition duration-500 group-hover:scale-125 group-hover:opacity-20`} />
                      <div className="flex items-start justify-between gap-4">
                        <div className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-14 sm:w-14 ${service.iconColor}`}>
                          <Icon size={25} strokeWidth={2.1} />
                        </div>
                        <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.16em] text-slate-500 shadow-sm">
                          {providerCountByCategory[service.name] || 0} providers
                        </span>
                      </div>

                      <h3 className="relative mt-5 text-xl font-black text-slate-950 sm:mt-6 sm:text-2xl">
                        {service.name}
                      </h3>
                      <p className="relative mt-2 text-sm font-medium leading-6 text-slate-600">
                        {service.desc}
                      </p>
                    </div>

                    <div className="p-4 sm:p-5">
                      <div className="flex flex-wrap gap-2">
                        {service.workTypes.slice(0, 4).map((workType) => (
                          <span key={workType} className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-bold text-slate-600">
                            {workType}
                          </span>
                        ))}
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-orange-100 pt-4">
                        <span className="inline-flex items-center gap-2 text-sm font-black text-slate-700">
                          <CheckCircle2 size={16} className="text-red-800" />
                          Explore category
                        </span>
                        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white transition-all group-hover:translate-x-1 group-hover:bg-red-900">
                          <ArrowRight size={19} />
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl border border-orange-100 bg-white px-5 py-10 text-center shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 text-red-900">
                <Flame size={24} />
              </div>
              <p className="text-lg font-black text-slate-950">No services found</p>
              <p className="mt-2 text-sm text-slate-500">Try searching a broader service name.</p>
              <button
                type="button"
                onClick={() => setQuery('')}
                className="mt-5 rounded-full bg-red-900 px-5 py-2.5 text-sm font-black text-white"
              >
                Clear search
              </button>
            </div>
          )}
          {marketplaceError && (
            <p className="mt-4 rounded-2xl border border-amber-100 bg-white px-4 py-3 text-sm font-bold text-amber-800">
              {marketplaceError}
            </p>
          )}
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;
