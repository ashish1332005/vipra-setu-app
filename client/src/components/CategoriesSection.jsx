import { useNavigate } from 'react-router-dom';
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, GraduationCap, HeartPulse, Home, UtensilsCrossed } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../data/marketplace';

const SERVICE_VISUALS = {
  Household: {
    icon: Home,
    accent: 'from-sky-500/15 to-blue-600/5',
    iconColor: 'text-sky-600',
  },
  Event: {
    icon: CalendarDays,
    accent: 'from-rose-500/15 to-pink-600/5',
    iconColor: 'text-rose-600',
  },
  Education: {
    icon: GraduationCap,
    accent: 'from-violet-500/15 to-indigo-600/5',
    iconColor: 'text-violet-600',
  },
  Hospital: {
    icon: HeartPulse,
    accent: 'from-emerald-500/15 to-green-600/5',
    iconColor: 'text-emerald-600',
  },
  'Property and Rent': {
    icon: Building2,
    accent: 'from-amber-500/15 to-orange-600/5',
    iconColor: 'text-amber-600',
  },
  'Hotels and Restaurant': {
    icon: UtensilsCrossed,
    accent: 'from-fuchsia-500/15 to-purple-600/5',
    iconColor: 'text-fuchsia-600',
  },
  'Other Services': {
    icon: BriefcaseBusiness,
    accent: 'from-slate-500/15 to-slate-700/5',
    iconColor: 'text-slate-700',
  },
};

export const SERVICES = SERVICE_CATEGORIES.map((service) => ({
  ...service,
  desc: service.shortDescription,
  ...SERVICE_VISUALS[service.name],
}));

const CategoriesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-space bg-slate-50">
      <div className="site-shell">
        <div className="section-heading mb-10 text-center md:text-left">
          <div className="section-copy">
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              Service Categories
            </span>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 md:text-4xl">
              Explore Our Services
            </h2>
            <p className="mt-3 text-lg text-slate-600">
              Find exactly what you need from our curated network of professionals.
            </p>
          </div>
          <button onClick={() => navigate('/services')} className="mt-4 hidden rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 md:inline-flex">
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
                className={`group cursor-pointer rounded-[28px] border border-slate-200/80 bg-gradient-to-br ${service.accent} p-5 shadow-[0_12px_32px_rgba(15,23,42,0.06)] transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-[0_20px_48px_rgba(15,23,42,0.12)]`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm ${service.iconColor}`}>
                    <Icon size={26} strokeWidth={2.1} />
                  </div>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                    {service.count}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {service.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {service.workTypes.slice(0, 3).map((workType) => (
                      <span key={workType} className="rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        {workType}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-slate-200/70 pt-4">
                  <span className="text-sm font-semibold text-slate-700">Explore category</span>
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white transition-all group-hover:translate-x-1 group-hover:bg-blue-700">
                    <ArrowRight size={18} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        <button onClick={() => navigate('/services')} className="mt-8 w-full rounded-xl bg-white py-3 font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-100 md:hidden">
          View all categories
        </button>
      </div>
    </section>
  );
};

export default CategoriesSection;
