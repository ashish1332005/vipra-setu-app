import { MapPin, MessageSquare, ShieldCheck, Star } from 'lucide-react';

const MOCK_WORKERS = [
  { id: 1, name: 'Elena Rodriguez', role: 'Cleaning Service', rating: 4.9, reviews: 124, location: 'Bhilwara', tagline: 'Deep cleaning specialist for premium homes', accent: 'from-cyan-500 to-blue-600', tags: ['Cleaner', 'Sanitization'] },
  { id: 2, name: 'James Wilson', role: 'Plumbing Service', rating: 5.0, reviews: 89, location: 'Bhilwara', tagline: 'Fast emergency repair with same-day visits', accent: 'from-amber-500 to-orange-500', tags: ['Plumber', 'Pipe Repair'] },
  { id: 3, name: 'Sarah Chen', role: 'Event Organizer', rating: 4.8, reviews: 210, location: 'Bhilwara', tagline: 'Corporate and wedding planning with polished execution', accent: 'from-fuchsia-500 to-pink-600', tags: ['Event Planner', 'Decorator'] },
  { id: 4, name: 'Marcus Johnson', role: 'Mathematics Tutor', rating: 4.9, reviews: 156, location: 'Bhilwara', tagline: 'Results-focused lessons for exams and academic growth', accent: 'from-emerald-500 to-teal-600', tags: ['Tutor', 'Mathematics'] },
];

const WorkersSection = ({ selectedCategory }) => {
  return (
    <section className="section-space bg-white">
      <div className="site-shell">
        <div className="section-heading mb-10 gap-4">
          <div className="section-copy">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700">
              Featured Experts
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              {selectedCategory ? `${selectedCategory} Experts Near You` : 'Top Rated Experts Near You'}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Carefully screened professionals with strong response times, trusted reviews, and standout service history.
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
            View All Experts
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {MOCK_WORKERS.map((worker) => (
            <article
              key={worker.id}
              className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)]"
            >
              <div className={`relative h-28 bg-gradient-to-br ${worker.accent}`}>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.35),transparent_40%)]"></div>
                <div className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/18 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  <ShieldCheck size={14} />
                  Verified Pro
                </div>
              </div>

              <div className="relative flex flex-1 flex-col px-5 pb-5 pt-0">
                <div className="-mt-10 mb-4 flex items-end justify-between gap-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-3xl border-4 border-white bg-slate-100 text-2xl font-bold text-slate-700 shadow-lg">
                    {worker.name.charAt(0)}
                  </div>
                  <div className="rounded-2xl bg-emerald-50 px-3 py-2 text-right">
                    <div className="flex items-center justify-end gap-1 text-sm font-bold text-emerald-700">
                      <Star size={14} className="fill-current" />
                      {worker.rating}
                    </div>
                    <p className="text-[11px] font-medium text-emerald-600">{worker.reviews}+ reviews</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900">{worker.name}</h3>
                  <p className="mt-1 text-sm font-medium text-blue-700">{worker.role}</p>
                  
                  {/* TAGS */}
                  <div className="mt-2 flex flex-wrap gap-2">
                    {worker.tags && worker.tags.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-500">{worker.tagline}</p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 rounded-2xl bg-slate-50 p-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Status</p>
                    <p className="mt-1 text-sm font-semibold text-slate-700">Available Now</p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Location</p>
                    <p className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-slate-700">
                      <MapPin size={14} className="text-slate-400" />
                      {worker.location}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex gap-3">
                  <button className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700">
                    View Profile
                  </button>
                  <button className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">
                    <MessageSquare size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkersSection;
