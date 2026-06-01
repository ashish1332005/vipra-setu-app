import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  BriefcaseBusiness,
  CreditCard,
  ClipboardList,
  CalendarPlus,
  Building2,
  Home,
  LayoutDashboard,
  LogOut,
  Search,
  UserRound,
} from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';
import api from '../../services/api';

const navByRole = {
  service_provider: [
    { label: 'Overview', to: '/provider', icon: LayoutDashboard, end: true },
    { label: 'Profile', to: '/provider/profile', icon: UserRound },
    { label: 'Growth', to: '/provider/growth', icon: CreditCard },
    { label: 'Business Suite', to: '/provider/business', icon: Building2 },
    { label: 'Services', to: '/provider/services', icon: BriefcaseBusiness },
    { label: 'Requests', to: '/provider/requests', icon: ClipboardList },
  ],
  service_taker: [
    { label: 'Overview', to: '/taker', icon: LayoutDashboard, end: true },
    { label: 'Book Service', to: '/taker/book', icon: CalendarPlus },
    { label: 'Find Providers', to: '/taker/providers', icon: Search },
    { label: 'My Requests', to: '/taker/requests', icon: ClipboardList },
  ],
};

const DashboardLayout = ({ role }) => {
  const navigate = useNavigate();
  const { currentUser, authLoading, logout } = useGlobalContext();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!currentUser) return;
    api.get('/notifications')
      .then(({ data }) => setNotifications(data.notifications || []))
      .catch(() => setNotifications([]));
  }, [currentUser]);

  if (authLoading && !currentUser) {
    return <div className="min-h-screen bg-slate-50 px-6 py-10 text-sm font-bold text-slate-600">Loading dashboard...</div>;
  }

  if (!currentUser) return <Navigate to="/login" replace />;
  if (currentUser.role !== role) return <Navigate to={currentUser.role === 'admin' ? '/admin' : '/'} replace />;

  const navItems = navByRole[role] || [];
  const isProvider = role === 'service_provider';
  const isEmailVerified = Boolean(currentUser.isEmailVerified || currentUser.emailVerifiedAt);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed_0,#f8fafc_34%,#eef2ff_100%)] text-slate-950">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-slate-200/80 bg-white/90 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="border-b border-slate-200 p-6">
          <Link to="/" className="text-xl font-black tracking-tight text-slate-950">
            Vipra <span className="text-orange-600">Sewa</span> Setu
          </Link>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {isProvider ? 'Provider workspace' : 'Service taker workspace'}
          </p>
        </div>

        <nav className="flex-1 space-y-2 p-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                    isActive
                      ? 'bg-slate-950 text-white shadow-lg shadow-slate-950/15'
                      : 'text-slate-600 hover:bg-orange-50 hover:text-orange-700'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4">
          <Link to="/" className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100">
            <Home size={18} />
            Website
          </Link>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-600">
                {isProvider ? 'Seva Provider' : 'Seva Taker'}
              </p>
              <h1 className="mt-1 text-xl font-black text-slate-950 sm:text-2xl">
                Namaste, {currentUser.name}
              </h1>
            </div>
            <div className="hidden rounded-full border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-bold text-orange-800 sm:block">
              {notifications.filter((item) => !item.readAt).length} new alerts
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-red-50 text-red-600 shadow-sm transition hover:bg-red-100 lg:hidden"
              aria-label="Logout"
            >
              <LogOut size={19} />
            </button>
          </div>

          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-bold ${
                      isActive ? 'bg-slate-950 text-white' : 'bg-white text-slate-600'
                    }`
                  }
                >
                  <Icon size={15} />
                  {item.label}
                </NavLink>
              );
            })}
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-bold text-red-600"
            >
              <LogOut size={15} />
              Logout
            </button>
          </nav>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">
          {!isEmailVerified && (
            <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800">
              {isProvider
                ? 'Email verification pending. You can browse your dashboard, but publishing services, claiming leads and sending quotes require verified email. Open the verification link sent to your email or resend it from Login.'
                : 'Email verification pending. You can still book, save providers and track requests. Verify your email from Login to keep your account more secure.'}
            </div>
          )}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
