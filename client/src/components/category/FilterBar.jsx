import { Calendar, Search, ShieldCheck, SlidersHorizontal } from 'lucide-react';

const FilterBar = ({ query, onQueryChange, sortBy, onSortChange, onlyAvailable, onOnlyAvailableChange, resultCount }) => {
  return (
    <div className="grid w-full gap-2 py-2 lg:grid-cols-[minmax(260px,1fr)_auto_auto_auto] lg:items-center">
      <label className="flex items-center gap-2 rounded-full border border-amber-100 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
        <Search size={15} className="text-red-900" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search provider, skill, city..."
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold outline-none placeholder:text-slate-400"
        />
      </label>

      <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <select
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
          className="shrink-0 rounded-full border border-amber-100 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm outline-none hover:bg-[#fff7ed]"
        >
          <option value="recommended">Recommended</option>
          <option value="profile">Best profile</option>
          <option value="services">Most services</option>
          <option value="rating">Highest rating</option>
        </select>

        <button
          type="button"
          onClick={() => onOnlyAvailableChange(!onlyAvailable)}
          className={`flex shrink-0 items-center gap-2 rounded-full border px-3 py-2 text-xs font-black shadow-sm ${
            onlyAvailable
              ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
              : 'border-amber-100 bg-white text-slate-700 hover:bg-[#fff7ed]'
          }`}
        >
          <Calendar size={14} />
          Available
        </button>

        <span className="flex shrink-0 items-center gap-2 rounded-full border border-amber-100 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
          <ShieldCheck size={14} className="text-red-900" />
          Verified network
        </span>
      </div>

      <span className="flex shrink-0 items-center justify-center rounded-full border border-amber-100 bg-white px-3 py-2 text-xs font-black text-slate-700 shadow-sm">
        {resultCount} results
      </span>

      <button type="button" className="flex shrink-0 items-center justify-center gap-2 rounded-full border border-red-100 bg-red-950 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-amber-700">
        <SlidersHorizontal size={14} />
        Filters
      </button>
    </div>
  );
};

export default FilterBar;
