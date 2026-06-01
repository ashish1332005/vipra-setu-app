import { useState } from 'react';
import { User, Smartphone, ChevronRight } from 'lucide-react';

const SidebarLeadForm = ({ categoryName }) => {
  const [type, setType] = useState('Budget');

  return (
    <div className="rounded-[1.35rem] border border-amber-100 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-800">Quick List</p>
        <h3 className="mt-1 text-lg font-black text-slate-900">
          Top <span className="text-red-900">{categoryName}</span>
        </h3>
        <p className="mt-1 text-sm font-medium text-slate-600">
          We'll send you contact details in seconds for free
        </p>
      </div>

      <div className="mb-4">
        <p className="mb-3 text-sm font-bold text-slate-800">
          What type of {categoryName} are you looking for?
        </p>
        <div className="grid grid-cols-3 gap-2 text-sm font-medium text-slate-700">
          {['Budget', 'Luxury', 'Others'].map((option) => (
            <label key={option} className={`flex cursor-pointer items-center justify-center gap-1.5 rounded-full border px-2 py-2 text-xs font-black ${type === option ? 'border-amber-300 bg-[#fff7ed] text-red-900' : 'border-amber-100 bg-white text-slate-600'}`}>
              <input
                type="radio"
                name="type"
                value={option}
                checked={type === option}
                onChange={(e) => setType(e.target.value)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </div>

      <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <User size={16} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Name"
            className="block w-full rounded-2xl border border-amber-100 bg-[#fffaf2] py-3 pl-10 pr-3 text-sm font-semibold outline-none placeholder:text-slate-500 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Smartphone size={16} className="text-slate-400" />
          </div>
          <input
            type="tel"
            placeholder="Mobile Number"
            className="block w-full rounded-2xl border border-amber-100 bg-[#fffaf2] py-3 pl-10 pr-3 text-sm font-semibold outline-none placeholder:text-slate-500 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100"
          />
        </div>

        <label className="flex items-start gap-2 mt-1">
          <input
            type="checkbox"
            defaultChecked
            className="mt-0.5 h-4 w-4 rounded border-amber-200 text-red-900 focus:ring-red-900"
          />
          <span className="text-xs text-slate-500">
            I Agree to <a href="#" className="underline hover:text-slate-700">T&C's Privacy Policy</a>
          </span>
        </label>

        <button className="mt-2 flex w-full items-center justify-center gap-1 rounded-2xl bg-red-950 py-3 text-sm font-black text-white transition hover:bg-amber-700">
          Get Best Deal <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
};

export default SidebarLeadForm;
