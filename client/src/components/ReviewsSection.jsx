import { Quote, Star } from 'lucide-react';

const REVIEWS = [
  { id: 1, text: "The cleaning service was impeccable. They arrived on time and left my house spotless. Highly recommended!", author: "Emily Chen", role: "Homeowner, Bhilwara", score: "4.9", accent: 'from-sky-50 to-white' },
  { id: 2, text: "Found an emergency plumber at 2 AM within minutes. He was professional and fixed the leak immediately. Lifesaver!", author: "Michael Thompson", role: "Business Owner, Delhi", score: "5.0", accent: 'from-amber-50 to-white' },
  { id: 3, text: "Hired an event planner for our corporate retreat. The level of detail and professionalism was outstanding from start to finish.", author: "Sarah Jenkins", role: "Operations Lead, Bangalore", score: "4.8", accent: 'from-rose-50 to-white' },
];

const ReviewsSection = () => {
  return (
    <section className="section-space bg-[linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]">
      <div className="site-shell">
        <div className="section-heading mb-10 gap-4">
          <div className="section-copy">
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-slate-700 shadow-sm">
              Customer Stories
            </span>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              Reviews that build trust before the first call
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Real feedback from customers who found reliable professionals quickly and with confidence.
            </p>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Average Rating</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900">4.9</span>
              <div className="flex gap-1 text-amber-500">
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
              className={`group flex h-full flex-col rounded-[28px] border border-slate-200/80 bg-gradient-to-br ${review.accent} p-6 shadow-[0_12px_36px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_18px_48px_rgba(15,23,42,0.12)]`}
            >
              <div className="mb-6 flex items-start justify-between gap-4">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-md">
                  <Quote size={20} />
                </div>
                <div className="rounded-2xl bg-white/90 px-3 py-2 text-right shadow-sm">
                  <div className="flex items-center justify-end gap-1 text-sm font-bold text-amber-600">
                    <Star size={14} className="fill-current" />
                    {review.score}
                  </div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.16em] text-slate-400">Verified Review</p>
                </div>
              </div>

              <p className="text-base leading-7 text-slate-700">
                "{review.text}"
              </p>

              <div className="mt-8 flex items-center gap-3 border-t border-slate-200/70 pt-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 font-bold text-white">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900">{review.author}</h4>
                  <p className="text-xs text-slate-500">{review.role}</p>
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
