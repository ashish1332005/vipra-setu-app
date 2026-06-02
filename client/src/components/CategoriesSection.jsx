import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChevronRight,
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
    panel: 'from-sky-500 via-cyan-500 to-blue-700',
    tint: 'bg-sky-50 text-sky-700',
    border: 'hover:border-sky-300',
    line: 'bg-sky-500',
  },
  Event: {
    icon: CalendarDays,
    panel: 'from-rose-500 via-red-500 to-orange-600',
    tint: 'bg-rose-50 text-rose-700',
    border: 'hover:border-rose-300',
    line: 'bg-rose-500',
  },
  Education: {
    icon: GraduationCap,
    panel: 'from-violet-500 via-indigo-500 to-blue-700',
    tint: 'bg-violet-50 text-violet-700',
    border: 'hover:border-violet-300',
    line: 'bg-violet-500',
  },
  Hospital: {
    icon: HeartPulse,
    panel: 'from-emerald-500 via-teal-500 to-cyan-700',
    tint: 'bg-emerald-50 text-emerald-700',
    border: 'hover:border-emerald-300',
    line: 'bg-emerald-500',
  },
  'Property and Rent': {
    icon: Building2,
    panel: 'from-amber-400 via-orange-500 to-red-700',
    tint: 'bg-amber-50 text-amber-700',
    border: 'hover:border-amber-300',
    line: 'bg-amber-500',
  },
  'Hotels and Restaurant': {
    icon: UtensilsCrossed,
    panel: 'from-fuchsia-500 via-pink-500 to-rose-700',
    tint: 'bg-fuchsia-50 text-fuchsia-700',
    border: 'hover:border-fuchsia-300',
    line: 'bg-fuchsia-500',
  },
  'Other Services': {
    icon: BriefcaseBusiness,
    panel: 'from-slate-700 via-zinc-700 to-stone-950',
    tint: 'bg-slate-100 text-slate-700',
    border: 'hover:border-slate-300',
    line: 'bg-slate-700',
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
    <section className="section-space bg-[linear-gradient(180deg,#fff7ed_0%,#f8fafc_48%,#ffffff_100%)]">
      <div className="site-shell">
        <div className="mb-6 flex flex-col gap-4 lg:mb-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-red-950 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-amber-200">
              Service Categories
            </span>
            <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Find the right service for every need.
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-600 sm:text-base">
              Home, event, education, health, property, food, and professional support in one place.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/services')}
            className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-red-900 sm:w-fit"
          >
            View all services
            <ArrowRight size={17} />
          </button>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SERVICES.map((service) => {
            const Icon = service.icon;
            const providerCount = providerCountByCategory[service.name] || 0;

            return (
              <button
                type="button"
                key={service.id}
                onClick={() => navigate(`/category/${encodeURIComponent(service.name)}`)}
                className={`group relative flex h-full min-h-[292px] flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-[0_14px_36px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 ${service.border} hover:shadow-[0_24px_58px_rgba(127,29,29,0.13)] sm:min-h-[320px]`}
              >
                <div className={`relative min-h-[150px] w-full bg-gradient-to-br ${service.panel} p-4 text-white sm:min-h-[168px] sm:p-5`}>
                  <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(30deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff),linear-gradient(150deg,#fff_12%,transparent_12.5%,transparent_87%,#fff_87.5%,#fff)] [background-position:0_0,12px_12px] [background-size:24px_24px]" />
                  <div className="relative flex items-start justify-between gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/18 text-white ring-1 ring-white/25 backdrop-blur sm:h-12 sm:w-12">
                      <Icon size={22} />
                    </span>
                    <span className="shrink-0 rounded-full bg-white/18 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.1em] text-white ring-1 ring-white/20 backdrop-blur sm:text-[11px]">
                      {providerCount} providers
                    </span>
                  </div>

                  <h3 className="relative mt-6 text-xl font-black leading-tight sm:mt-8 sm:text-2xl">{service.name}</h3>
                  <p className="relative mt-2 line-clamp-2 text-xs font-semibold leading-5 text-white/82 sm:text-sm sm:leading-6">
                    {service.description}
                  </p>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3">
                      <p className="text-lg font-black text-slate-950">{providerCount}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Providers</p>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-2.5 sm:p-3">
                      <p className="text-lg font-black text-slate-950">{service.workTypes.length}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-slate-400">Services</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.workTypes.slice(0, 3).map((workType) => (
                      <span key={workType} className={`max-w-full truncate rounded-lg px-2.5 py-1 text-[11px] font-black ${service.tint}`}>
                        {workType}
                      </span>
                    ))}
                  </div>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
                    <span className="text-sm font-black text-slate-800">View providers</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-950 text-white transition group-hover:translate-x-1 group-hover:bg-red-900">
                      <ChevronRight size={18} />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-5 grid gap-3 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm sm:grid-cols-3">
          {[
            ['Choose', 'Select a service'],
            ['Compare', 'View providers'],
            ['Request', 'Send a request'],
          ].map(([title, text]) => (
            <div key={title} className="flex items-center gap-3 rounded-xl bg-orange-50 p-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950 text-amber-200">
                <ArrowRight size={16} />
              </span>
              <span>
                <span className="block text-sm font-black text-slate-950">{title}</span>
                <span className="block text-xs font-semibold text-slate-500">{text}</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
