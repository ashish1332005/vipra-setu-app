import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    text: 'I found an electrician quickly and the work was handled with respect. The platform feels local, simple, and dependable.',
    author: 'Neha Sharma',
    role: 'Homeowner, Bhilwara',
    score: '4.9',
    accent: 'from-amber-50 to-white',
  },
  {
    id: 2,
    text: 'For our family event, the provider understood our traditions and handled the setup professionally from start to finish.',
    author: 'Mahesh Vyas',
    role: 'Event Customer',
    score: '5.0',
    accent: 'from-rose-50 to-white',
  },
  {
    id: 3,
    text: 'It helped my coaching center get more inquiries. The design builds confidence before people even call.',
    author: 'Ravi Joshi',
    role: 'Service Provider',
    score: '4.8',
    accent: 'from-emerald-50 to-white',
  },
];

const ReviewsSection = () => {
  return (
    <section className="section-space bg-[linear-gradient(135deg,#431407_0%,#7f1d1d_48%,#111827_100%)] text-white">
      <div className="site-shell">
        <div className="section-heading mb-10 gap-5">
          <div className="section-copy">
            <span className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase tracking-[0.22em] text-amber-200 ring-1 ring-white/15">
              Community Reputation
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-white md:text-4xl">
              Trust grows when every story feels real.
            </h2>
            <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-amber-50/80">
              Reviews are framed with contrast, warmth, and clear ratings so visitors quickly feel confidence and belonging.
            </p>
          </div>
          <div className="rounded-2xl border border-white/15 bg-white/10 px-5 py-4 shadow-sm backdrop-blur">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-200">Average Rating</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-black text-white">4.9</span>
              <div className="flex gap-1 text-amber-300">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={15} className="fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {REVIEWS.map((review) => (
            <article
              key={review.id}
              className={`group flex h-full flex-col rounded-2xl border border-white/15 bg-gradient-to-br ${review.accent} p-6 text-slate-800 shadow-[0_18px_50px_rgba(0,0,0,0.16)] transition duration-300 hover:-translate-y-1`}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950 text-amber-200 shadow-md">
                  <Quote size={20} />
                </div>
                <div className="rounded-2xl bg-white/90 px-3 py-2 text-right shadow-sm">
                  <div className="flex items-center justify-end gap-1 text-sm font-black text-amber-600">
                    <Star size={14} className="fill-current" />
                    {review.score}
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400">Verified</p>
                </div>
              </div>

              <p className="text-base font-medium leading-7 text-slate-700">
                "{review.text}"
              </p>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-200/80 pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-950 font-black text-white">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-950">{review.author}</h4>
                  <p className="text-xs font-semibold text-slate-500">{review.role}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
