import { BriefcaseBusiness, Building2, CheckCircle2, MapPin, MessageSquare, Phone, ShieldCheck, Star } from 'lucide-react';
import { getMediaUrl } from '../../utils/media';

const HorizontalWorkerCard = ({ worker }) => {
  const initials = (worker.name || 'SP')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  const profileImage = getMediaUrl(worker.profileImageUrl);
  const coverImage = getMediaUrl(worker.coverImageUrl);

  return (
    <article className="mb-3 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] sm:mb-4">
      <div className="relative h-24 bg-slate-100 sm:h-32">
        {coverImage ? (
          <img src={coverImage} alt={`${worker.name} cover`} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-[linear-gradient(135deg,#f8fafc_0%,#ecfdf5_48%,#fff7ed_100%)] text-emerald-700/35">
            <Building2 size={38} strokeWidth={1.6} />
          </div>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.00)_0%,rgba(15,23,42,0.34)_100%)]" />
        <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-black text-emerald-700 shadow-sm ring-1 ring-emerald-100">
          <CheckCircle2 size={13} />
          {worker.isApproved ? 'Verified' : 'Pending'}
        </span>
      </div>

      <div className="p-3 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="-mt-9 flex h-18 w-18 shrink-0 items-center justify-center overflow-hidden rounded-xl border-4 border-white bg-slate-950 text-lg font-black text-amber-200 shadow-md ring-1 ring-slate-100 [height:4.5rem] [width:4.5rem] sm:-mt-12 sm:[height:6rem] sm:[width:6rem] sm:text-xl">
            {profileImage ? (
              <img src={profileImage} alt={worker.name} className="h-full w-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="min-w-0 flex-1 pt-1">
            <p className="text-[11px] font-bold leading-4 text-slate-500">
              {worker.responseLabel || worker.availability || 'Listed provider'}
            </p>
            <div className="mt-1 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="truncate text-lg font-black leading-6 text-slate-950 sm:text-xl">{worker.name}</h3>
                <p className="mt-0.5 text-sm font-black text-orange-700">{worker.category || worker.role}</p>
              </div>
              {worker.rate && (
                <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                  {worker.rate}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-red-950 px-2.5 py-1 text-xs font-black text-white">
              {worker.rating ? worker.rating.toFixed(1) : 'New'} <Star size={11} className="fill-amber-300 text-amber-300" />
            </div>
            <span className="text-xs font-bold text-slate-500">
              Live provider
            </span>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-black text-emerald-700">
              {worker.profileScore}% profile
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
            <MapPin size={14} className="text-red-900" />
            <span>{worker.location || worker.city || 'Bhilwara, India'}</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span className="truncate">{worker.isApproved ? 'Approved' : 'Pending'}</span>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-black text-slate-700">
              <BriefcaseBusiness size={14} className="text-red-900" />
              {worker.serviceCount} services
            </div>
          </div>

          <div className="mt-3 flex max-h-9 flex-wrap gap-2 overflow-hidden sm:max-h-none">
            {(worker.tags || [worker.category, 'Verified']).map((tag, idx) => (
              <span key={idx} className="rounded-full border border-orange-100 bg-orange-50 px-3 py-1 text-xs font-bold text-slate-700">
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-[1fr_1fr_auto] gap-2 sm:mt-5">
            <a href={worker.phone ? `tel:${worker.phone}` : undefined} className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-3 py-3 text-xs font-black text-white transition hover:bg-emerald-700">
              <Phone size={15} className="fill-current" />
              Call
            </a>
            <a href={worker.phone ? `https://wa.me/91${worker.phone}` : undefined} className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-3 text-xs font-black text-emerald-800 transition hover:bg-emerald-100">
              <MessageSquare size={15} />
              WhatsApp
            </a>
            <button className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-red-950 text-white transition hover:bg-amber-700">
              <MessageSquare size={17} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default HorizontalWorkerCard;
