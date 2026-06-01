import { BriefcaseBusiness, CheckCircle2, MapPin, MessageSquare, Phone, ShieldCheck, Star, ThumbsUp } from 'lucide-react';

const HorizontalWorkerCard = ({ worker }) => {
  const imageUrl = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400';

  return (
    <article className="mb-4 overflow-hidden rounded-[1.35rem] border border-amber-100 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(127,29,29,0.10)] sm:flex">
      <div className="relative h-44 w-full shrink-0 bg-red-950 sm:h-auto sm:w-56">
        <img src={imageUrl} alt={worker.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(67,20,7,0.02)_0%,rgba(67,20,7,0.62)_100%)]" />
        <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/92 px-3 py-1 text-[11px] font-black text-red-900 shadow-sm">
          <CheckCircle2 size={13} />
          Verified
        </div>
        <div className="absolute bottom-3 left-3 rounded-full bg-amber-300 px-3 py-1 text-[11px] font-black text-red-950 shadow-sm">
          {worker.responseLabel || worker.availability || 'Listed provider'}
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-950 text-amber-200">
                  <ThumbsUp size={13} className="fill-current" />
                </div>
                <h3 className="truncate text-xl font-black text-slate-950">{worker.name}</h3>
              </div>
              <p className="mt-1 text-sm font-black text-amber-700">{worker.category || worker.role}</p>
            </div>
            {worker.rate && (
              <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                {worker.rate}
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-red-950 px-2.5 py-1 text-xs font-black text-white">
              {worker.rating ? worker.rating.toFixed(1) : 'New'} <Star size={11} className="fill-amber-300 text-amber-300" />
            </div>
            <span className="text-xs font-bold text-slate-500">
              Live provider
            </span>
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-black text-orange-700">
              {worker.profileScore}% profile
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            <MapPin size={14} className="text-red-900" />
            <span>{worker.location || worker.city || 'Bhilwara, India'}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
              <ShieldCheck size={14} className="text-emerald-600" />
              {worker.isApproved ? 'Approved provider' : 'Approval pending'}
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
              <BriefcaseBusiness size={14} className="text-red-900" />
              {worker.serviceCount} services
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {(worker.tags || [worker.category, 'Verified']).map((tag, idx) => (
              <span key={idx} className="rounded-full border border-amber-100 bg-[#fff7ed] px-3 py-1 text-xs font-bold text-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-[1fr_1fr_auto] gap-2">
          <a href={worker.phone ? `tel:${worker.phone}` : undefined} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-3 text-xs font-black text-white transition hover:bg-emerald-700">
            <Phone size={15} className="fill-current" />
            Call
          </a>
          <a href={worker.phone ? `https://wa.me/91${worker.phone}` : undefined} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs font-black text-emerald-800 transition hover:bg-emerald-100">
            <MessageSquare size={15} />
            WhatsApp
          </a>
          <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-red-950 text-white transition hover:bg-amber-700">
            <MessageSquare size={17} />
          </button>
        </div>
      </div>
    </article>
  );
};

export default HorizontalWorkerCard;
