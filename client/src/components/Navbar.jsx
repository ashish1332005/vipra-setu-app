import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Bell, LogIn, Menu, Search, Mail, MapPin, Phone, X } from 'lucide-react';
import { CATEGORIES, WORKERS } from '../data/marketplace';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
];

const getDesktopLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-semibold transition-colors',
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  ].join(' ');

const getMobileLinkClass = ({ isActive }) =>
  [
    'flex items-center justify-between rounded-2xl px-4 py-3 text-base font-semibold transition-colors',
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ');

const Navbar = () => {
  const navigate = useNavigate();
  const [hasNotification, setHasNotification] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isMenuOpen = activePanel === 'menu';
  const isSearchOpen = activePanel === 'search';
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const searchResults = trimmedSearch
    ? [
        ...CATEGORIES.filter((category) =>
          category.name.toLowerCase().includes(trimmedSearch)
        ).map((category) => ({
          label: category.name,
          meta: category.description,
          to: `/category/${encodeURIComponent(category.name)}`,
        })),
        ...WORKERS.filter((worker) =>
          [
            worker.name,
            worker.category,
            worker.city,
            ...(worker.tags || []),
          ]
            .join(' ')
            .toLowerCase()
            .includes(trimmedSearch)
        ).map((worker) => ({
          label: worker.name,
          meta: `${worker.category} in ${worker.city}`,
          to: `/category/${encodeURIComponent(worker.category)}`,
        })),
      ].slice(0, 5)
    : CATEGORIES.slice(0, 4).map((category) => ({
        label: category.name,
        meta: category.description,
        to: `/category/${encodeURIComponent(category.name)}`,
      }));

  const closePanels = () => setActivePanel(null);
  const togglePanel = (panel) => {
    setActivePanel((current) => (current === panel ? null : panel));
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const firstResult = searchResults[0];

    if (firstResult) {
      navigate(firstResult.to);
      closePanels();
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur">
      <div className="bg-slate-900 text-slate-200">
        <div className="site-shell hidden items-center justify-between gap-4 py-1.5 text-xs md:flex">
          <div className="flex items-center gap-4">
            <a href="tel:+919462874574" className="inline-flex items-center gap-2 text-slate-200/90 transition-colors hover:text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/6 text-blue-300"><Phone size={14} /></span>
              +91 94628 74574
            </a>
            <a href="mailto:support@viprasevasetu.com" className="inline-flex items-center gap-2 text-slate-200/80 transition-colors hover:text-white">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/6 text-orange-300"><Mail size={14} /></span>
              support@viprasevasetu.com
            </a>
          </div>

          <div className="flex items-center gap-4 text-slate-200/80">
            <span className="inline-flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/6 text-emerald-300"><MapPin size={14} /></span>
              RK Colony, Bhilwara
            </span>
          </div>
        </div>
      </div>

      <div className="site-shell flex min-h-[76px] items-center justify-between gap-4 py-3">
        <div className="flex min-w-0 items-center gap-4 lg:gap-6">
          <Link to="/" onClick={closePanels} className="flex shrink-0 items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 text-lg font-black text-white shadow-sm shadow-blue-600/25">
              VS
            </span>
            <span className="min-w-0">
              <span className="block text-xl font-extrabold leading-6 tracking-tight text-slate-950 sm:text-2xl">
                Vipra Seva Setu
              </span>
              <span className="hidden text-xs font-semibold text-slate-500 sm:block">
                समाज को जोड़ने वाला विश्वसनीय डिजिटल मंच
              </span>
            </span>
          </Link>

          <button
            type="button"
            onClick={() => togglePanel('search')}
            className="hidden min-w-[280px] flex-1 items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-slate-300 hover:bg-white lg:flex lg:max-w-xl"
          >
            <Search size={17} className="text-slate-400" />
            <span className="truncate text-sm font-medium text-slate-500">
              Search community services, members, and local help
            </span>
          </button>
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={getDesktopLinkClass}>
              {item.label}
            </NavLink>
          ))}

          <button 
            onClick={() => setHasNotification(false)}
            aria-label="View notifications"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition-colors hover:border-slate-300 hover:text-blue-600"
          >
            <Bell size={18} />
            {hasNotification && (
              <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-blue-600 border-2 border-white"></span>
            )}
          </button>

          <Link
            to="/login"
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
          >
            <LogIn size={16} />
            Login / Sign Up
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            aria-label="Search"
            aria-expanded={isSearchOpen}
            aria-controls="navbar-search-panel"
            onClick={() => togglePanel('search')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-blue-600"
          >
            <Search size={18} />
          </button>
          <button
            type="button"
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-navigation"
            onClick={() => togglePanel('menu')}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-colors hover:border-slate-300 hover:text-blue-600"
          >
            {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </div>

      <div
        id="navbar-search-panel"
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 ${
          isSearchOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="site-shell py-4">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="shrink-0 text-slate-400" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search services, members, city..."
              className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-blue-700"
            >
              Search
            </button>
          </form>

          <div className="mt-3 grid gap-2 md:grid-cols-2">
            {searchResults.map((result) => (
              <Link
                key={`${result.label}-${result.to}`}
                to={result.to}
                onClick={closePanels}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-3 transition-colors hover:border-blue-200 hover:bg-blue-50"
              >
                <span className="block text-sm font-bold text-slate-900">{result.label}</span>
                <span className="mt-1 block truncate text-xs font-medium text-slate-500">{result.meta}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={`overflow-hidden border-t border-slate-100 bg-white transition-all duration-300 lg:hidden ${
          isMenuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="site-shell space-y-4 py-4">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={17} className="shrink-0 text-slate-400" />
            <span className="truncate text-sm font-medium text-slate-500">
              Search community services and local help
            </span>
          </div>

          <div className="grid gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={closePanels} className={getMobileLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="grid gap-3 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setHasNotification(false)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition-colors hover:border-slate-300 hover:text-blue-700"
            >
              <Bell size={17} />
              Notifications
              {hasNotification && <span className="h-2 w-2 rounded-full bg-blue-600" />}
            </button>
            <Link
              to="/login"
              onClick={closePanels}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-700"
            >
              <LogIn size={17} />
              Login / Sign Up
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
