import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { SERVICES } from '../components/CategoriesSection';

const ServicesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="site-shell max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 shadow-sm">
            All Services
          </span>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
            Our Service Categories
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Browse through all available categories to find the right professional for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((service) => {
            const Icon = service.icon;

            return (
              <article
                key={service.id}
                onClick={() => navigate(`/category/${encodeURIComponent(service.name)}`)}
                className={`group cursor-pointer rounded-[28px] border border-slate-200/80 bg-gradient-to-br ${service.accent} p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-md`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm ${service.iconColor}`}>
                    <Icon size={30} strokeWidth={2.1} />
                  </div>
                  <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 shadow-sm">
                    {service.count}
                  </span>
                </div>

                <div className="mt-8">
                  <h3 className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-blue-700">
                    {service.name}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-slate-600">
                    {service.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-200/70 pt-5">
                  <span className="text-sm font-bold text-slate-700">Explore category</span>
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-white transition-all group-hover:translate-x-1 group-hover:bg-blue-700">
                    <ArrowRight size={20} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;
