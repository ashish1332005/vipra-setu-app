import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Bell,
  BriefcaseBusiness,
  Home,
  Info,
  LogIn,
  PhoneCall,
  Search,
  UserRound,
} from 'lucide-react';

import { useGlobalContext } from '../context/GlobalContext';
import logo from '../assets/logo.jpeg';

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Services', to: '/services', icon: BriefcaseBusiness },
  { label: 'About', to: '/about', icon: Info },
  { label: 'Contact', to: '/contact', icon: PhoneCall },
];

const bottomNavItems = [
  ...navItems,
  { label: 'Login', to: '/login', icon: UserRound },
];

const getDesktopLinkClass = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-black transition-colors',
    isActive
      ? 'bg-amber-100 text-red-950 shadow-sm'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
  ].join(' ');

const getBottomLinkClass = ({ isActive }) =>
  [
    'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[9px] font-black transition-all min-[390px]:text-[10px]',
    isActive
      ? 'bg-slate-950 text-amber-200 shadow-[0_10px_24px_rgba(15,23,42,0.22)]'
      : 'text-slate-600 hover:bg-amber-100 hover:text-slate-950',
  ].join(' ');

const Navbar = () => {
  const navigate = useNavigate();
  const { currentUser, marketplaceWorkers, categoryOptions } = useGlobalContext();
  const [hasNotification, setHasNotification] = useState(true);
  const [activePanel, setActivePanel] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const isSearchOpen = activePanel === 'search';
  const accountLink = currentUser ? '/dashboard' : '/login';
  const accountLabel = currentUser ? 'Dashboard' : 'Login';
  const notificationLink = currentUser
    ? currentUser.role === 'admin'
      ? '/admin'
      : currentUser.role === 'service_provider'
        ? '/provider'
        : '/taker'
    : '/login';
  const trimmedSearch = searchQuery.trim().toLowerCase();
  const searchResults = trimmedSearch
    ? [
        ...categoryOptions.filter((category) =>
          category.name.toLowerCase().includes(trimmedSearch)
        ).map((category) => ({
          label: category.name,
          meta: category.description,
          to: `/category/${encodeURIComponent(category.name)}`,
        })),
        ...marketplaceWorkers.filter((worker) =>
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
    : categoryOptions.slice(0, 4).map((category) => ({
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
    <>
      <nav className="sticky top-0 z-50 border-b border-amber-100 bg-[#fffaf2] shadow-[0_10px_28px_rgba(67,20,7,0.08)]">
        <div className="site-shell flex min-h-[64px] items-center justify-between gap-2 py-2 sm:min-h-[76px] sm:gap-3 sm:py-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-6">
            <Link to="/" onClick={closePanels} className="group flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-100 bg-white p-1 shadow-[0_8px_20px_rgba(67,20,7,0.08)] sm:h-14 sm:w-14">
                <img
                  src={logo}
                  alt="Vipra Sewa Setu Logo"
                  className="h-full w-full rounded-[1rem] object-cover"
                />
              </span>
              <span className="min-w-0">
                <span className="block max-w-[150px] truncate text-[0.98rem] font-black leading-5 tracking-tight text-slate-950 min-[390px]:max-w-[178px] sm:max-w-none sm:text-xl">
                  Vipra Sewa Setu
                </span>
                <span className="mt-0.5 hidden truncate text-[10px] font-black uppercase tracking-[0.12em] text-red-800 min-[390px]:block sm:text-xs">
                  Service | Community | Trust
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => togglePanel('search')}
              className="hidden min-w-[280px] flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left shadow-inner transition-colors hover:border-amber-200 hover:bg-white lg:flex lg:max-w-xl"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-sky-700 shadow-sm">
                <Search size={17} />
              </span>
              <span className="truncate text-sm font-medium text-slate-500">
                Search services - plumber, coaching, catering...
              </span>
            </button>
          </div>

          <div className="hidden items-center gap-2 lg:flex">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={getDesktopLinkClass}>
                {item.label}
              </NavLink>
            ))}

            <Link
              to={notificationLink}
              onClick={() => {
                setHasNotification(false);
                closePanels();
              }}
              aria-label="View notifications"
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-500 shadow-sm transition-colors hover:border-amber-200 hover:text-amber-700"
            >
              <Bell size={18} />
              {hasNotification && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500" />
              )}
            </Link>

            <Link
              to={accountLink}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-900 px-5 py-3 text-sm font-black text-white shadow-[0_12px_30px_rgba(127,29,29,0.2)] transition-colors hover:bg-slate-950"
            >
              <LogIn size={16} />
              {accountLabel}
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
            <Link
              to={notificationLink}
              onClick={() => {
                setHasNotification(false);
                closePanels();
              }}
              aria-label="View notifications"
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-100 bg-white text-slate-700 shadow-sm transition-colors hover:border-amber-300 hover:text-red-900 sm:h-11 sm:w-11"
            >
              <Bell size={18} />
              {hasNotification && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full border-2 border-white bg-amber-500" />
              )}
            </Link>
            <button
              type="button"
              aria-label="Search"
              aria-expanded={isSearchOpen}
              aria-controls="navbar-search-panel"
              onClick={() => togglePanel('search')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-950 text-amber-200 shadow-[0_12px_28px_rgba(15,23,42,0.18)] transition-colors hover:bg-red-950 sm:h-11 sm:w-11"
            >
              <Search size={18} />
            </button>
          </div>
        </div>

        <div
          id="navbar-search-panel"
          className={`overflow-hidden border-t border-slate-100 bg-white/96 backdrop-blur-xl transition-all duration-300 ${
            isSearchOpen ? 'max-h-[560px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="site-shell py-4">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 shadow-inner sm:px-4">
              <Search size={18} className="shrink-0 text-slate-400" />
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search service, provider, or city..."
                className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-950 px-4 py-2.5 text-xs font-black text-white transition-colors hover:bg-red-950"
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
                  className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm transition-colors hover:border-amber-200 hover:bg-amber-50"
                >
                  <span className="block text-sm font-bold text-slate-900">{result.label}</span>
                  <span className="mt-1 block truncate text-xs font-medium text-slate-500">{result.meta}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <nav className="fixed inset-x-2 bottom-3 z-[60] rounded-[1.35rem] border border-amber-100 bg-[#fffaf2] px-1.5 pb-[calc(env(safe-area-inset-bottom)+0.3rem)] pt-1.5 shadow-[0_-10px_34px_rgba(15,23,42,0.16)] lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-0.5">
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const to = item.to === '/login' ? accountLink : item.to;
            const label = item.to === '/login' && currentUser ? 'Dashboard' : item.label;

            return (
              <NavLink
                key={item.to}
                to={to}
                onClick={closePanels}
                className={getBottomLinkClass}
              >
                <Icon size={18} />
                <span className="truncate">{label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
