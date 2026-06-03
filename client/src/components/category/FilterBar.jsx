import { Calendar, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ query, onQueryChange, sortBy, onSortChange, onlyAvailable, onOnlyAvailableChange, resultCount }) => {
  return (
    <div className="grid w-full grid-cols-[1fr_auto] gap-2 rounded-xl border border-slate-200 bg-white p-2 shadow-[0_10px_24px_rgba(15,23,42,0.05)] lg:grid-cols-[minmax(260px,1fr)_auto_auto_auto] lg:items-center">
      <label className="flex min-h-11 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 lg:col-span-1">
        <Search size={16} className="text-red-900" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search provider, skill, city..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
        />
      </label>

      <span className="flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 px-2 py-2 text-xs font-black text-slate-700 lg:order-3 lg:px-3">
        {resultCount}
        <span className="hidden pl-1 sm:inline">results</span>
      </span>

      <div className="col-span-2 flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] lg:col-span-1 lg:order-2">
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="min-h-9 shrink-0 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 outline-none hover:bg-slate-50"
        >
          <option value="recommended">Recommended</option>
          <option value="profile">Best profile</option>
          <option value="services">Most services</option>
          <option value="rating">Highest rating</option>
        </select>

        <button
          type="button"
          onClick={() => onOnlyAvailableChange(!onlyAvailable)}
          className={`flex min-h-9 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-xs font-black ${
            onlyAvailable
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Calendar size={14} />
          Available
        </button>

        <span className="hidden min-h-9 shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-black text-slate-700 sm:flex">
          <ShieldCheck size={14} className="text-red-900" />
          Verified network
        </span>
      </div>

      <button type="button" className="hidden min-h-9 shrink-0 items-center justify-center gap-2 rounded-lg border border-red-900 bg-red-950 px-3 py-2 text-xs font-black text-white hover:bg-red-900 lg:order-4 lg:flex lg:px-4">
        <SlidersHorizontal size={14} />
        <span className="sr-only lg:not-sr-only">Filters</span>
      </button>
    </div>
  );
};

export default FilterBar;
