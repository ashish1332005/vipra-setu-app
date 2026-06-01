import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  GraduationCap,
  HeartPulse,
  Home,
  UtensilsCrossed,
} from 'lucide-react';

import { SERVICE_CATEGORIES } from '../data/marketplace';
import { useGlobalContext } from '../context/GlobalContext';

const SERVICE_VISUALS = {
  Household: {
    icon: Home,
    accent: 'from-sky-50 via-white to-blue-50',
    ring: 'group-hover:border-sky-200',
    iconColor: 'text-sky-700',
    glow: 'bg-sky-500',
  },
  Event: {
    icon: CalendarDays,
    accent: 'from-rose-50 via-white to-orange-50',
    ring: 'group-hover:border-rose-200',
    iconColor: 'text-rose-700',
    glow: 'bg-rose-500',
  },
  Education: {
    icon: GraduationCap,
    accent: 'from-violet-50 via-white to-indigo-50',
    ring: 'group-hover:border-violet-200',
    iconColor: 'text-violet-700',
    glow: 'bg-violet-500',
  },
  Hospital: {
    icon: HeartPulse,
    accent: 'from-emerald-50 via-white to-teal-50',
    ring: 'group-hover:border-emerald-200',
    iconColor: 'text-emerald-700',
    glow: 'bg-emerald-500',
  },
  'Property and Rent': {
    icon: Building2,
    accent: 'from-amber-50 via-white to-orange-50',
    ring: 'group-hover:border-amber-200',
    iconColor: 'text-amber-700',
    glow: 'bg-amber-500',
  },
  'Hotels and Restaurant': {
    icon: UtensilsCrossed,
    accent: 'from-fuchsia-50 via-white to-pink-50',
    ring: 'group-hover:border-fuchsia-200',
    iconColor: 'text-fuchsia-700',
    glow: 'bg-fuchsia-500',
  },
  'Other Services': {
    icon: BriefcaseBusiness,
    accent: 'from-slate-50 via-white to-stone-50',
    ring: 'group-hover:border-slate-300',
    iconColor: 'text-slate-700',
    glow: 'bg-slate-700',
  },
};

export const SERVICES = SERVICE_CATEGORIES.map((service) => ({
  ...service,
  desc: service.shortDescription,
  ...SERVICE_VISUALS[service.name],
}));

const CategoriesSection = () => {
  const navigate = useNavigate();
  const { providers } = useGlobalContext();
  const providerCountByCategory = providers.reduce((counts, provider) => {
    counts[provider.category] = (counts[provider.category] || 0) + 1;
    return counts;
  }, {});

  return (
    <section className="section-space bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_48%,#fffaf2_100%)]">
      <div className="site-shell">
        <div className="section-heading mb-10 gap-5 text-center md:text-left">
          <div className="section-copy">
            <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-amber-900">
              Service Categories
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              Practical help for every household, event, and business.
            </h2>
            <p className="mt-3 text-base font-medium leading-7 text-slate-600">
              Color-coded categories make the page easy to scan: blue for reliability, green for care, amber for action, and rose for celebration.
            </p>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="hidden rounded-xl border border-orange-100 bg-white px-5 py-3 text-sm font-black text-slate-800 shadow-sm transition hover:border-amber-300 hover:bg-amber-50 md:inline-flex"
          >
            View all categories
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                onClick={() => navigate(`/category/${encodeURIComponent(service.name)}`)}
                className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br ${service.accent} p-5 shadow-[0_14px_36px_rgba(15,23,42,0.07)] transition duration-300 hover:-translate-y-1 ${service.ring} hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]`}
              >
                <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full ${service.glow} opacity-10 blur-2xl transition group-hover:opacity-20`} />
                <div className="relative flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ${service.iconColor}`}>
                    <Icon size={26} strokeWidth={2.1} />
                  </div>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-slate-500 shadow-sm">
                    {providerCountByCategory[service.name] || 0} providers
                  </span>
                </div>

                <div className="relative mt-8">
                  <h3 className="text-xl font-black text-slate-950">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm font-medium leading-6 text-slate-600">
                    {service.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.workTypes.slice(0, 3).map((workType) => (
                      <span
                        key={workType}
                        className="rounded-full border border-white bg-white/80 px-2.5 py-1 text-xs font-bold text-slate-600 shadow-sm"
                      >
                        {workType}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="relative mt-6 flex items-center justify-between border-t border-slate-200/70 pt-4">
                  <span className="text-sm font-black text-slate-700">Explore category</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition group-hover:translate-x-1 group-hover:bg-amber-600">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <button
          onClick={() => navigate('/services')}
          className="mt-8 w-full rounded-xl bg-slate-950 py-3 font-black text-white shadow-sm transition hover:bg-amber-700 md:hidden"
        >
          View all categories
        </button>
      </div>
    </section>
  );
};

export default CategoriesSection;
