import React, { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { CalendarCheck, CheckCircle2, ChevronRight, MapPin, Phone, Send, User } from 'lucide-react';
import CategoryBannerAd from '../components/category/CategoryBannerAd';
import FilterBar from '../components/category/FilterBar';
import HorizontalWorkerCard from '../components/category/HorizontalWorkerCard';
import SidebarLeadForm from '../components/category/SidebarLeadForm';
import SidebarTopPicks from '../components/category/SidebarTopPicks';
import { useGlobalContext } from '../context/GlobalContext';
import { getCategoryConfig, isSameCategory } from '../data/marketplace';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const decodedCategory = decodeURIComponent(categoryName);
  const { users } = useGlobalContext();
  const [selectedService, setSelectedService] = useState('');
  const categoryConfig = getCategoryConfig(decodedCategory);
  const displayCategory = categoryConfig?.name || decodedCategory;
  const workTypes = categoryConfig?.workTypes || [];
  const activeService = selectedService || workTypes[0] || displayCategory;

  const categoryWorkers = useMemo(() => {
    const activeProviders = users.filter(user => user.role === 'Provider' && user.status === 'Active');

    return activeProviders.filter(
      worker => worker.category && isSameCategory(worker.category, displayCategory)
    );
  }, [displayCategory, users]);

  const serviceWorkers = useMemo(() => {
    if (!selectedService) {
      return categoryWorkers;
    }

    const normalizedService = selectedService.toLowerCase();
    const matchingWorkers = categoryWorkers.filter((worker) =>
      (worker.tags || []).some((tag) => tag.toLowerCase().includes(normalizedService))
    );

    return matchingWorkers.length > 0 ? matchingWorkers : categoryWorkers;
  }, [categoryWorkers, selectedService]);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50 font-sans">
      <CategoryBannerAd />

      <div className="site-shell py-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Link to="/" className="hover:text-blue-600">Bhilwara</Link>
          <ChevronRight size={12} />
          <span className="hover:text-blue-600 cursor-pointer">{displayCategory} in Bhilwara</span>
          <ChevronRight size={12} />
          <span>{categoryWorkers.length}+ Listings</span>
        </nav>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
          Popular {displayCategory} in Bhilwara
        </h1>
        {categoryConfig?.description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
            {categoryConfig.description}
          </p>
        )}

        {workTypes.length > 0 && (
          <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Available Work</p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  Select a {displayCategory} service
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Service choose karo, phir apply/order form submit kar do.
                </p>
              </div>
              <span className="text-sm font-semibold text-slate-500">
                {workTypes.length} services available
              </span>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {workTypes.map((workType) => (
                <button
                  key={workType}
                  type="button"
                  onClick={() => setSelectedService(workType)}
                  className={`group flex min-h-[92px] flex-col items-start justify-between rounded-2xl border p-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
                    activeService === workType
                      ? 'border-blue-300 bg-blue-50 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="flex w-full items-start justify-between gap-3">
                    <span className="text-base font-bold text-slate-900">{workType}</span>
                    {activeService === workType && <CheckCircle2 size={18} className="shrink-0 text-blue-700" />}
                  </span>
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-blue-700">
                    Apply / Order <ChevronRight size={15} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Filter Bar */}
        <div className="mt-4 border-b border-slate-200 pb-4">
          <FilterBar />
        </div>

        {/* Main 2-Column Layout */}
        <div className="mt-6 flex flex-col gap-6 lg:flex-row">
          
          {/* Left Column (Main List) */}
          <div className="flex-1 lg:w-2/3 xl:w-3/4">
            <div className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Selected Service</p>
              <h2 className="mt-1 text-xl font-bold text-slate-900">{activeService}</h2>
              <p className="mt-1 text-sm text-slate-500">
                Neeche matching providers hain. Direct deal ke liye side form se request bhejein.
              </p>
            </div>

            {serviceWorkers.length > 0 ? (
              serviceWorkers.map((worker) => (
                <HorizontalWorkerCard key={worker.id} worker={worker} />
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                <h2 className="text-xl font-bold text-slate-900">No providers found yet</h2>
                <p className="mt-2 text-sm text-slate-500">
                  We are adding trusted {activeService} professionals for Bhilwara.
                </p>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0">
            <div className="mb-4 rounded-xl border border-blue-100 bg-white p-5 shadow-sm">
              <div className="mb-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Apply Now</p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">Order {activeService}</h3>
                <p className="mt-1 text-sm text-slate-500">
                  Apni requirement bhejein, team/provider aapko contact karega.
                </p>
              </div>

              <form className="grid gap-3" onSubmit={(event) => event.preventDefault()}>
                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Service
                  <select
                    value={activeService}
                    onChange={(event) => setSelectedService(event.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  >
                    {workTypes.map((workType) => (
                      <option key={workType} value={workType}>{workType}</option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Name
                  <span className="relative">
                    <User size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Your name" />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Mobile Number
                  <span className="relative">
                    <Phone size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="tel" className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="10-digit mobile number" />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Location
                  <span className="relative">
                    <MapPin size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder="Area / address" />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Preferred Date
                  <span className="relative">
                    <CalendarCheck size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="date" className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" />
                  </span>
                </label>

                <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                  Requirement
                  <textarea className="min-h-24 resize-none rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20" placeholder={`Tell us about your ${activeService} requirement`} />
                </label>

                <button className="mt-1 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700">
                  <Send size={16} />
                  Apply / Order Now
                </button>
              </form>
            </div>

            <SidebarLeadForm categoryName={activeService} />
            <SidebarTopPicks categoryName={displayCategory} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
