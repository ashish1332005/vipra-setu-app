import { Search, Sparkles, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '../data/marketplace';
import { useGlobalContext } from '../../context/GlobalContext';

const QuickFindSection = () => {
  const { users } = useGlobalContext();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredWorkers = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    
    // Only use active providers
    const activeProviders = users.filter(user => user.role === 'Provider' && user.status === 'Active');

    return activeProviders.filter((worker) => {
      const matchesCategory = activeCategory === 'All' || worker.category === activeCategory;
      const matchesQuery =
        normalizedQuery.length === 0 ||
        worker.name.toLowerCase().includes(normalizedQuery) ||
        worker.category.toLowerCase().includes(normalizedQuery) ||
        worker.city.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const topWorkers = filteredWorkers.slice().sort((left, right) => right.rating - left.rating).slice(0, 3);

  return (
    <section id="quick-find" className="py-16">
      <div className="container mx-auto px-4">
        <div className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white/80 shadow-[0_24px_80px_rgba(43,29,27,0.08)] backdrop-blur">
          <div className="grid gap-10 px-6 py-8 md:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-12 lg:py-12">
            <div>
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Quick match
              </span>
              <h2 className="max-w-xl text-3xl font-bold text-ink md:text-4xl">
                Search by worker, category, or city and shortlist trusted help in seconds.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-600">
                This discovery panel gives the landing page a faster path from browsing to booking without forcing users to jump through every category first.
              </p>

              <label className="mt-8 block">
                <span className="mb-3 block text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Find your next service pro
                </span>
                <span className="flex items-center gap-3 rounded-2xl border border-primary/10 bg-surface px-4 py-4 shadow-inner shadow-primary/5 focus-within:border-secondary">
                  <Search className="h-5 w-5 text-secondary" aria-hidden="true" />
                  <input
                    type="text"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Try 'event', 'Bhilwara', or 'Alice'"
                    className="w-full bg-transparent text-base text-ink outline-none placeholder:text-slate-400"
                  />
                </span>
              </label>

              <div className="mt-6 flex flex-wrap gap-3">
                {['All', ...CATEGORIES.map((category) => category.name)].map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                      activeCategory === category
                        ? 'bg-primary text-light shadow-lg shadow-primary/20'
                        : 'border border-primary/10 bg-white text-slate-600 hover:border-secondary/60 hover:text-primary'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] bg-[linear-gradient(160deg,#8B1E2D_0%,#5B121D_52%,#2B1D1B_100%)] p-6 text-light shadow-[0_20px_60px_rgba(91,18,29,0.3)]">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-light/60">Matches</p>
                  <p className="mt-2 text-3xl font-bold">{filteredWorkers.length}</p>
                </div>
                <div className="rounded-2xl bg-white/10 p-4">
                  <p className="text-sm uppercase tracking-[0.2em] text-light/60">Categories</p>
                  <p className="mt-2 text-3xl font-bold">{activeCategory === 'All' ? CATEGORIES.length : 1}</p>
                </div>
              </div>

              <div className="mt-6">
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Suggested workers</h3>
                  <span className="text-sm text-light/70">Top rated first</span>
                </div>

                <div className="space-y-3">
                  {topWorkers.length > 0 ? (
                    topWorkers.map((worker) => (
                      <div key={worker.id} className="rounded-2xl border border-white/10 bg-white/10 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold">{worker.name}</p>
                            <p className="mt-1 text-sm text-light/70">
                              {worker.category} in {worker.city}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-1">
                              {worker.tags && worker.tags.map((tag, idx) => (
                                <span key={idx} className="inline-flex items-center rounded bg-white/20 px-1.5 py-0.5 text-[10px] font-medium text-white">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="inline-flex items-center gap-1 text-sm font-semibold text-amber-300">
                              <Star className="h-4 w-4 fill-amber-300 text-amber-300" aria-hidden="true" />
                              {worker.rating}
                            </p>
                            <p className="mt-1 text-sm text-light/70">{worker.rate}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-white/20 bg-white/5 p-4 text-sm text-light/75">
                      No exact matches yet. Try another city, worker name, or broader category.
                    </div>
                  )}
                </div>
              </div>

              <Link
                to={activeCategory === 'All' ? '/category/Household' : `/category/${encodeURIComponent(activeCategory)}`}
                className="mt-6 inline-flex rounded-full bg-light px-5 py-3 font-semibold text-primary transition hover:bg-white"
              >
                Open matching category
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickFindSection;
