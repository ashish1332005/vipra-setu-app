import { ChevronRight, MapPin, MessageSquare, Phone, Star, ThumbsUp, CheckCircle2 } from 'lucide-react';

const HorizontalWorkerCard = ({ worker }) => {
  // Using a generic Unsplash image for local professionals and hotels.
  const imageUrl = "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=400";

  return (
    <div className="mb-4 flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-shadow hover:shadow-md sm:flex-row">
      
      {/* Left side: Image */}
      <div className="relative h-48 w-full shrink-0 sm:h-auto sm:w-64">
        <img src={imageUrl} alt={worker.name} className="h-full w-full object-cover" />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Right side: Details */}
      <div className="flex flex-1 flex-col justify-between p-4 sm:p-5">
        <div>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-white">
                <ThumbsUp size={12} className="fill-current" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">{worker.name}</h3>
              <CheckCircle2 size={16} className="text-blue-600 ml-1" />
            </div>
            {/* Optional price or rate rendering could go here */}
            {worker.rate && <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">{worker.rate}</span>}
          </div>

          <div className="mt-2 flex items-center gap-3">
            <div className="flex items-center gap-1 rounded bg-green-600 px-1.5 py-0.5 text-xs font-bold text-white">
              {worker.rating} <Star size={10} className="fill-current" />
            </div>
            <span className="text-sm text-slate-500 hover:text-blue-600 hover:underline cursor-pointer">
              {worker.reviews || Math.floor(Math.random() * 500) + 10} Ratings
            </span>
            <span className="inline-flex items-center gap-1 rounded bg-orange-50 px-1.5 py-0.5 text-xs font-medium text-orange-700">
              🔥 Trending
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 text-sm text-slate-600">
            <MapPin size={14} />
            <span>{worker.location || worker.city || 'Bhilwara, India'}</span>
          </div>

          {/* Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {(worker.tags || [worker.category, 'Verified']).map((tag, idx) => (
              <span key={idx} className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-600">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-green-700">
            <Phone size={16} className="fill-current" />
            9462874574
          </button>
          
          <button className="flex items-center gap-2 rounded-lg border border-green-600 bg-white px-4 py-2 text-sm font-bold text-green-700 transition-colors hover:bg-green-50">
            <MessageSquare size={16} />
            WhatsApp
          </button>

          <button className="ml-auto flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700">
            <MessageSquare size={16} className="fill-current" />
            Get Best Deal
          </button>
        </div>
      </div>

    </div>
  );
};

export default HorizontalWorkerCard;
