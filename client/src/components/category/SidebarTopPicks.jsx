import { MessageSquare, Phone, Star, ThumbsUp } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

const SidebarTopPicks = ({ categoryName }) => {
  const { marketplaceWorkers } = useGlobalContext();
  const topPicks = marketplaceWorkers
    .filter((worker) => worker.category === categoryName || worker.tags?.includes(categoryName))
    .sort((left, right) => (right.rating || 0) - (left.rating || 0))
    .slice(0, 4);
  const imageUrl = 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80';

  return (
    <div className="mt-6 rounded-[1.35rem] border border-amber-100 bg-white p-5 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.2em] text-red-800">Top Picks</p>
      <h3 className="mt-1 text-xl font-black text-slate-900">Customer trusted</h3>
      <p className="mb-4 mt-1 text-sm font-medium text-slate-600">{categoryName} in Bhilwara</p>

      <div className="grid grid-cols-2 gap-3">
        {topPicks.map((pick) => (
          <div key={pick.id} className="overflow-hidden rounded-2xl border border-amber-100 bg-[#fffdf8]">
            <div className="relative h-24 w-full overflow-hidden">
              <img src={imageUrl} alt={pick.name} className="h-full w-full object-cover" />
              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/92 px-2 py-1 text-[10px] font-black text-red-900">
                <ThumbsUp size={10} className="fill-current" />
                Pick
              </div>
            </div>

            <div className="p-3">
              <h4 className="truncate text-sm font-black text-slate-950">{pick.name}</h4>

              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="font-black text-slate-900">{pick.rating}</span>
                <Star size={10} className="fill-amber-500 text-amber-500" />
                <span className="text-slate-500">{pick.rate}</span>
              </div>

              <p className="mt-0.5 truncate text-xs font-medium text-slate-600">{pick.location}</p>

              <div className="mt-3 grid grid-cols-2 gap-1.5">
                <button className="flex items-center justify-center gap-1 rounded-xl bg-emerald-600 py-2 text-[10px] font-black text-white transition hover:bg-emerald-700">
                  <Phone size={11} className="fill-current" />
                  Call
                </button>
                <button className="flex items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 py-2 text-[10px] font-black text-emerald-800 transition hover:bg-emerald-100">
                  <MessageSquare size={11} />
                  Chat
                </button>
              </div>
            </div>
          </div>
        ))}
        {topPicks.length === 0 && (
          <p className="col-span-2 rounded-2xl border border-dashed border-amber-200 p-4 text-center text-sm font-bold text-slate-500">
            No top picks yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default SidebarTopPicks;
