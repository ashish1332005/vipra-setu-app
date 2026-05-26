import { useState } from 'react';
import { User, Smartphone, ChevronRight } from 'lucide-react';

const SidebarLeadForm = ({ categoryName }) => {
  const [type, setType] = useState('Budget');

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900">
          Get the List of Top <span className="text-blue-600">{categoryName}</span>
        </h3>
        <p className="mt-1 text-sm text-slate-600 font-medium">
          We'll send you contact details in seconds for free
        </p>
      </div>

      <div className="mb-4">
        <p className="mb-3 text-sm font-bold text-slate-800">
          What type of {categoryName} are you looking for?
        </p>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-700">
          {['Budget', 'Luxury', 'Others'].map((option) => (
            <label key={option} className="flex cursor-pointer items-center gap-1.5">
              <input
                type="radio"
                name="type"
                value={option}
                checked={type === option}
                onChange={(e) => setType(e.target.value)}
                className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600 cursor-pointer"
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
            className="block w-full rounded border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Smartphone size={16} className="text-slate-400" />
          </div>
          <input
            type="tel"
            placeholder="Mobile Number"
            className="block w-full rounded border border-slate-300 py-2 pl-10 pr-3 text-sm outline-none placeholder:text-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <label className="flex items-start gap-2 mt-1">
          <input
            type="checkbox"
            defaultChecked
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
          />
          <span className="text-xs text-slate-500">
            I Agree to <a href="#" className="underline hover:text-slate-700">T&C's Privacy Policy</a>
          </span>
        </label>

        <button className="mt-2 flex w-full items-center justify-center gap-1 rounded bg-blue-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-blue-700">
          Get Best Deal <ChevronRight size={16} />
        </button>
      </form>
    </div>
  );
};

export default SidebarLeadForm;
