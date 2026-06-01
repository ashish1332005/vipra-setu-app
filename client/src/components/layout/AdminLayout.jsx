import { Navigate, NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  BadgeCheck,
  ClipboardList,
  LayoutDashboard,
  ListChecks,
  Settings,
  ShieldCheck,
  Users,
  Megaphone,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import logo from '../../assets/logo.jpeg';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, exact: true },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Providers', path: '/admin/providers', icon: BadgeCheck },
  { name: 'Services', path: '/admin/services', icon: ListChecks },
  { name: 'Requests', path: '/admin/requests', icon: ClipboardList },
  { name: 'Trust', path: '/admin/trust', icon: ShieldCheck },
  { name: 'Business', path: '/admin/business', icon: Settings },
  { name: 'Ads', path: '/admin/ads', icon: Megaphone },
];

const AdminLayout = () => {
  const navigate = useNavigate();
  const { currentUser, authLoading, logout } = useGlobalContext();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (authLoading && !currentUser) {
    return <div className="min-h-screen bg-slate-100 px-6 py-10 text-sm font-bold text-slate-600">Loading admin...</div>;
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== 'admin') return <Navigate to="/" replace />;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8fafc_0%,#eef2ff_100%)] font-sans text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-slate-800 bg-slate-950 text-slate-300 lg:flex">
        <AdminBrand />
        <AdminNav onClick={closeMenu} />
        <AdminActions onLogout={handleLogout} />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/92 backdrop-blur-xl">
          <div className="flex min-h-[68px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                onClick={() => setIsMenuOpen(true)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-sm lg:hidden"
                aria-label="Open admin menu"
              >
                <Menu size={21} />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-sky-700">Admin Control</p>
                <h1 className="truncate text-lg font-black text-slate-950 sm:text-xl">Vipra Sewa Setu</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/"
                className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-black text-slate-600 shadow-sm transition hover:text-sky-700 sm:inline-flex"
              >
                <Home size={17} />
                Website
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100"
                aria-label="Logout"
              >
                <LogOut size={19} />
              </button>
            </div>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {navItems.slice(0, 6).map(({ name, path, icon: Icon, exact }) => (
              <NavLink
                key={path}
                to={path}
                end={exact}
                className={({ isActive }) =>
                  `inline-flex shrink-0 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-black transition ${
                    isActive ? 'bg-slate-950 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200'
                  }`
                }
              >
                <Icon size={15} />
                {name}
              </NavLink>
            ))}
          </nav>
        </header>

        <main className="px-3 py-4 pb-24 sm:px-6 sm:py-6 lg:px-8 lg:pb-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>

      {isMenuOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button
            type="button"
            aria-label="Close admin menu"
            onClick={closeMenu}
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
          />
          <aside className="relative flex h-full w-[86%] max-w-sm flex-col bg-slate-950 text-slate-300 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-4">
              <AdminBrand compact />
              <button
                type="button"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white"
                aria-label="Close admin menu"
              >
                <X size={20} />
              </button>
            </div>
            <AdminNav onClick={closeMenu} />
            <AdminActions onLogout={handleLogout} />
          </aside>
        </div>
      )}
    </div>
  );
};

const AdminBrand = ({ compact = false }) => (
  <div className={compact ? 'flex items-center gap-3' : 'border-b border-slate-800 p-5'}>
    <div className="flex items-center gap-3">
      <img src={logo} alt="Vipra Sewa Setu" className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10" />
      <div>
        <p className="text-lg font-black leading-tight text-white">Admin Panel</p>
        <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-300">Control center</p>
      </div>
    </div>
  </div>
);

const AdminNav = ({ onClick }) => (
  <nav className="flex-1 space-y-1 overflow-y-auto p-4">
    {navItems.map(({ name, path, icon: Icon, exact }) => (
      <NavLink
        key={path}
        to={path}
        end={exact}
        onClick={onClick}
        className={({ isActive }) =>
          `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-black transition ${
            isActive ? 'bg-sky-500 text-white shadow-lg shadow-sky-950/20' : 'text-slate-300 hover:bg-white/8 hover:text-white'
          }`
        }
      >
        <Icon size={19} />
        {name}
      </NavLink>
    ))}
  </nav>
);

const AdminActions = ({ onLogout }) => (
  <div className="border-t border-slate-800 p-4">
    <Link to="/" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-slate-300 transition hover:bg-white/8 hover:text-white">
      <Home size={19} />
      Exit to Website
    </Link>
    <button
      onClick={onLogout}
      className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-black text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
    >
      <LogOut size={19} />
      Logout
    </button>
  </div>
);

export default AdminLayout;
