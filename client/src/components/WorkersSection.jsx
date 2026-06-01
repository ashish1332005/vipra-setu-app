import { BadgeCheck, Clock3, MapPin, MessageSquare, ShieldCheck, Star, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const ACCENTS = [
  'from-sky-600 to-slate-950',
  'from-rose-600 to-red-950',
  'from-emerald-600 to-slate-950',
  'from-violet-600 to-slate-950',
];

const WorkersSection = ({ selectedCategory }) => {
  const { marketplaceWorkers, marketplaceLoading, marketplaceError } = useGlobalContext();
  const workers = marketplaceWorkers
    .filter((worker) => !selectedCategory || worker.category === selectedCategory)
    .slice(0, 4);

  return (
    <section className="section-space bg-white">
      <div className="site-shell">
        <div className="section-heading mb-10 gap-5">
          <div className="section-copy">
            <span className="inline-flex rounded-full bg-amber-50 px-3 py-1 text-xs font-black uppercase tracking-[0.16em] text-red-900">
              Trusted Providers
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-950 md:text-4xl">
              {selectedCategory ? `${selectedCategory} providers near you` : 'Verified providers ready for service requests.'}
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-slate-600">
              Compare profile, skills, location, and availability before you decide.
            </p>
          </div>
          <Link to="/services" className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 transition hover:border-amber-300 hover:bg-amber-50 hover:text-red-900">
            View all services
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {workers.map((worker, index) => (
            <article
              key={worker.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_42px_rgba(15,23,42,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.14)]"
            >
              <div className={`relative h-32 bg-gradient-to-br ${ACCENTS[index % ACCENTS.length]}`}>
                <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_0)] [background-size:18px_18px]" />
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1 text-xs font-black text-white backdrop-blur">
                  <BadgeCheck size={14} />
                  Verified
                </div>
              </div>

              <div className="relative flex flex-1 flex-col px-5 pb-5">
                <div className="-mt-10 mb-4 flex items-end justify-between gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-amber-50 text-2xl font-black text-red-950 shadow-lg">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-black text-emerald-700">
                      <Star size={14} className={worker.rating ? 'fill-current' : ''} />
                      {worker.rating ? worker.rating.toFixed(1) : 'New'}
                    </div>
                    <p className="text-[11px] font-bold text-emerald-600">{worker.profileScore}% profile</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-black text-slate-950">{worker.name}</h3>
                  <p className="mt-1 text-sm font-black text-amber-700">{worker.category}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    {worker.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full border border-orange-100 bg-orange-50 px-2.5 py-1 text-xs font-bold text-orange-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-sm font-medium leading-6 text-slate-500">
                    {worker.tags?.join(', ') || 'Trusted community professional'}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Status</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                      <Clock3 size={14} className="text-emerald-600" />
                      {worker.availability || 'Available'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">Location</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-slate-700">
                      <MapPin size={14} className="text-slate-400" />
                      {worker.location || 'Bhilwara'}
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <p className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                      <ShieldCheck size={13} />
                      Trust
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">{worker.isApproved ? 'Approved' : 'Pending'}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-100 p-3">
                    <p className="flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.12em] text-slate-400">
                      <TrendingUp size={13} />
                      Services
                    </p>
                    <p className="mt-1 text-sm font-black text-slate-800">{worker.serviceCount}</p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <Link to={`/category/${encodeURIComponent(worker.category)}`} className="flex-1 rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-black text-white transition hover:bg-amber-700">
                    View profile
                  </Link>
                  <button className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700">
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
          {!marketplaceLoading && workers.length === 0 && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center">
              <p className="text-lg font-black text-slate-900">No approved providers yet</p>
              <p className="mt-2 text-sm font-medium text-slate-500">
                {marketplaceError || 'Providers will appear here after they register and receive approval.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkersSection;
