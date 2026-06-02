import { motion } from 'framer-motion';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarPlus,
  HandHeart,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

import CategoriesSection from '../components/CategoriesSection';
import WorkersSection from '../components/WorkersSection';
import bpfLogo from '../assets/bpf.jpeg';
import logo from '../assets/logo.jpeg';
import parshuramHero from '../assets/parshuram-hero.png';
import vipraSenaLogo from '../assets/viprasena.jpeg';
import { useGlobalContext } from '../context/GlobalContext';

const QUICK_ACTIONS = [
  { label: 'Book a Service', text: 'Send your requirement and track replies.', to: '/taker/book', icon: CalendarPlus },
  { label: 'Find Providers', text: 'Compare trusted local professionals.', to: '/taker/providers', icon: Search },
  { label: 'Dashboard', text: 'Manage bookings, leads, and profile.', to: '/dashboard', icon: LayoutDashboard },
];

const CULTURE_STATS = [
  { label: 'Service Categories', value: '7+', icon: BriefcaseBusiness },
  { label: 'Verified Flow', value: 'Easy', icon: ShieldCheck },
  { label: 'Local Community', value: 'Bhilwara', icon: HandHeart },
];

const HERO_MICRO_CARDS = [
  { label: 'Verified', value: 'Members', icon: ShieldCheck },
  { label: 'Local', value: 'Service', icon: HandHeart },
  { label: 'Smart', value: 'Booking', icon: Sparkles },
];

const USER_STEPS = [
  { title: 'Choose a service', text: 'Select a category or search by your need.', icon: Search },
  { title: 'Send request', text: 'Add date, location, budget, and contact details.', icon: CalendarPlus },
  { title: 'Track work', text: 'View replies, status, and history in your dashboard.', icon: LayoutDashboard },
];

const HERO_BRANDS = [
  { name: 'Vipra Sena', image: vipraSenaLogo },
  { name: 'BPF', image: bpfLogo },
];

const Home = () => {
  const { currentUser, authLoading } = useGlobalContext();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf2] px-4 text-center">
        <div>
          <div className="mx-auto h-11 w-11 animate-pulse rounded-2xl bg-red-900 shadow-[0_16px_40px_rgba(127,29,29,0.22)]" />
          <p className="mt-4 text-sm font-black uppercase tracking-[0.18em] text-slate-500">
            Preparing your app
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/login?mode=signup" replace />;
  }

  const isProvider = currentUser.role === 'service_provider';
  const primaryDashboard = currentUser.role === 'admin' ? '/admin' : isProvider ? '/provider' : '/taker';
  const primaryAction = isProvider
    ? { label: 'Provider Workspace', to: '/provider', icon: LayoutDashboard }
    : { label: 'Book a Service', to: '/taker/book', icon: CalendarPlus };
  const PrimaryActionIcon = primaryAction.icon;
  const quickActions = isProvider
    ? [
        { label: 'Provider Dashboard', text: 'Track leads, profile, and requests.', to: '/provider', icon: LayoutDashboard },
        { label: 'Manage Services', text: 'Publish and update your offerings.', to: '/provider/services', icon: BriefcaseBusiness },
        { label: 'View Requests', text: 'Review customer requests and quotes.', to: '/provider/requests', icon: Search },
      ]
    : QUICK_ACTIONS;

  return (
    <div className="bg-[#fffaf2] text-slate-950">
      <section className="relative overflow-hidden bg-[#fffaf2]">
        <div className="absolute inset-x-0 top-0 h-[80%] bg-[radial-gradient(circle_at_18%_10%,rgba(251,191,36,0.24),transparent_26%),linear-gradient(135deg,#3b0b07_0%,#7f1d1d_46%,#111827_112%)]" />
        <div className="culture-pattern absolute inset-x-0 top-0 h-[80%] opacity-70" />

        <div className="site-shell relative py-6 sm:py-10 lg:py-14">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mb-5 flex flex-wrap items-center gap-2 rounded-xl border border-white/15 bg-white/10 p-2 shadow-[0_14px_40px_rgba(0,0,0,0.12)] backdrop-blur-md sm:w-fit"
          >
            {HERO_BRANDS.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/10 px-2.5 py-1.5 text-white sm:px-3"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="h-7 w-7 shrink-0 rounded-md object-cover ring-1 ring-white/20 sm:h-8 sm:w-8"
                />
                <span className="text-xs font-black leading-tight sm:text-sm">
                  {brand.name}
                </span>
              </div>
            ))}
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
              className="text-white"
            >
              <div className="shine-sweep inline-flex max-w-full items-center gap-3 rounded-full border border-white/15 bg-white/10 py-1.5 pl-1.5 pr-4 shadow-[0_16px_45px_rgba(0,0,0,0.12)] backdrop-blur-md">
                <img src={logo} alt="Vipra Sewa Setu" className="h-10 w-10 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight">Vipra Sewa Setu</span>
                  <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">
                    धर्म | सेवा | समाज
                  </span>
                </span>
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                Namaste, {currentUser.name}
              </p>
              <h1 className="mt-3 max-w-3xl text-[2.15rem] font-black leading-[1.03] tracking-tight sm:text-5xl lg:text-[4.1rem]">
                आज किस सेवा की जरूरत है?
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/80 sm:text-lg sm:leading-8">
                Find trusted local providers, send service requests, and track every update from one simple dashboard.
              </p>

              <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                <Link
                  to={primaryAction.to}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-3.5 text-sm font-black text-red-950 shadow-[0_18px_45px_rgba(251,191,36,0.26)] transition hover:bg-amber-200"
                >
                  <PrimaryActionIcon size={18} />
                  {primaryAction.label}
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to={primaryDashboard}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3.5 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
                >
                  <LayoutDashboard size={18} />
                  My Dashboard
                </Link>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2 sm:max-w-xl">
                {HERO_MICRO_CARDS.map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/12 bg-white/10 p-3 text-center shadow-[0_12px_35px_rgba(0,0,0,0.12)] backdrop-blur"
                  >
                    <Icon size={17} className="mx-auto text-amber-200" />
                    <p className="mt-2 text-[10px] font-black uppercase tracking-[0.14em] text-white/55">{label}</p>
                    <p className="text-xs font-black text-white">{value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 18 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-[1.5rem] border border-white/15 bg-white/10 p-2 shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur sm:rounded-[1.75rem]">
                <div className="relative min-h-[360px] overflow-hidden rounded-[1.1rem] bg-slate-950 sm:min-h-[500px] sm:rounded-[1.35rem]">
                  <img
                    src={parshuramHero}
                    alt="Vipra Sewa Setu cultural platform"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(67,20,7,0.14)_34%,rgba(15,23,42,0.9)_100%)]" />
                 
                 
                  <div className="absolute bottom-3 left-3 right-3 rounded-2xl border border-white/15 bg-slate-950/58 p-4 text-white shadow-lg backdrop-blur-md sm:bottom-4 sm:left-4 sm:right-4 sm:p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-amber-200 sm:text-[11px] sm:tracking-[0.2em]">
                      सेवा | समाज | विश्वास
                    </p>
                    <h2 className="mt-2 text-[1.7rem] font-black leading-tight sm:text-2xl">
                      One app for simple community service.
                    </h2>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {CULTURE_STATS.map(({ label, value }) => (
                        <div key={label} className="rounded-xl bg-white/10 p-2 text-center">
                          <p className="text-base font-black sm:text-lg">{value}</p>
                          <p className="mt-0.5 text-[8px] font-black uppercase leading-3 tracking-[0.06em] text-white/55 sm:text-[9px] sm:tracking-[0.1em]">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-6 hidden grid-cols-3 gap-2 sm:grid sm:gap-3"
          >
            {CULTURE_STATS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_14px_35px_rgba(15,23,42,0.07)] sm:p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[9px] font-black uppercase leading-4 tracking-[0.1em] text-slate-500 sm:text-xs sm:tracking-[0.14em]">{label}</p>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700 sm:h-10 sm:w-10">
                    <Icon size={16} />
                  </span>
                </div>
                <p className="mt-3 text-2xl font-black text-slate-950 sm:text-3xl">{value}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="bg-white py-8 sm:py-12">
        <div className="site-shell">
          <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-red-800">Start here</p>
              <h2 className="mt-2 max-w-lg text-2xl font-black leading-tight text-slate-950 sm:text-4xl">
                What would you like to do first?
              </h2>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                Three clear actions keep the app easy for every user.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {quickActions.map(({ icon: Icon, label, text, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex min-h-[132px] gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-white hover:shadow-[0_18px_40px_rgba(67,20,7,0.08)] md:block"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-300">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <h3 className="text-base font-black text-slate-950 md:mt-4">{label}</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-500 md:mt-2">{text}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-red-900 md:mt-4">
                      Open <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
            <div className="grid gap-3 md:grid-cols-3">
              {USER_STEPS.map(({ icon: Icon, title, text }, index) => (
                <div key={title} className="flex gap-3 rounded-xl bg-white p-4 shadow-sm">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-300">
                    <Icon size={18} />
                  </span>
                  <span>
                    <span className="text-[11px] font-black uppercase tracking-[0.14em] text-sky-700">
                      Step {index + 1}
                    </span>
                    <h3 className="mt-1 text-sm font-black text-slate-950">{title}</h3>
                    <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">{text}</p>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CategoriesSection />
      <WorkersSection selectedCategory={null} />
    </div>
  );
};

export default Home;
