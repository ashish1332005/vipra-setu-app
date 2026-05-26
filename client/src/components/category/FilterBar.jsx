import { Calendar, ChevronDown, SlidersHorizontal } from 'lucide-react';

const FilterBar = () => {
  const filters = [
    { label: 'Sort by', icon: <ChevronDown size={14} /> },
    { label: 'Star Rating', icon: <ChevronDown size={14} /> },
    { label: 'Budget', icon: <ChevronDown size={14} /> },
    { label: 'Hotel View', icon: <ChevronDown size={14} /> },
    { label: 'Pets Essential', icon: <ChevronDown size={14} /> },
    { label: 'User Ratings', icon: <ChevronDown size={14} /> },
    { label: 'Amenities', icon: <ChevronDown size={14} /> },
  ];

  return (
    <div className="flex w-full items-center gap-3 overflow-x-auto py-2 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* Date Pickers (mock) */}
      <div className="flex shrink-0 items-center gap-2">
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <span>13-05-2026</span>
          <Calendar size={14} className="text-slate-500" />
        </button>
        <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
          <span>14-05-2026</span>
          <Calendar size={14} className="text-slate-500" />
        </button>
      </div>

      {/* Filter Dropdowns */}
      {filters.map((filter, index) => (
        <button 
          key={index}
          className="flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {filter.label}
          {filter.icon}
        </button>
      ))}

      {/* All Filters */}
      <button className="ml-auto flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-800 hover:bg-slate-50">
        <SlidersHorizontal size={14} />
        All Filters
      </button>
    </div>
  );
};

export default FilterBar;
