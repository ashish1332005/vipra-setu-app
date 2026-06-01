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
  Star,
  UsersRound,
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

import AdsRail from '../components/AdsRail';
import CategoriesSection from '../components/CategoriesSection';
import LeadGenForm from '../components/LeadGenForm';
import MarketplaceValueSection from '../components/MarketplaceValueSection';
import ReviewsSection from '../components/ReviewsSection';
import TopAdCarousel from '../components/TopAdCarousel';
import WorkersSection from '../components/WorkersSection';
import logo from '../assets/logo.jpeg';
import parshuramHero from '../assets/parshuram-hero.png';
import { useGlobalContext } from '../context/GlobalContext';

const TRUST_POINTS = [
  { icon: ShieldCheck, title: 'Verified Network', text: 'Community-first provider screening.' },
  { icon: HandHeart, title: 'Seva Mindset', text: 'Support rooted in trust and values.' },
  { icon: Sparkles, title: 'Fast Discovery', text: 'Find the right help without confusion.' },
];

const QUICK_ACTIONS = [
  { label: 'Book Service', text: 'Create a request and track replies.', to: '/taker/book', icon: CalendarPlus },
  { label: 'Find Providers', text: 'Compare trusted local professionals.', to: '/taker/providers', icon: Search },
  { label: 'Dashboard', text: 'Manage bookings, leads, and profile.', to: '/dashboard', icon: LayoutDashboard },
];

const CULTURE_STATS = [
  { label: 'Service Categories', value: '7+', icon: BriefcaseBusiness },
  { label: 'Community Trust', value: '4.9', icon: Star },
  { label: 'Members Connected', value: '15k+', icon: UsersRound },
];

const HERO_MICRO_CARDS = [
  { label: 'Verified', value: 'Members', icon: ShieldCheck },
  { label: 'Local', value: 'Seva', icon: HandHeart },
  { label: 'Smart', value: 'Booking', icon: Sparkles },
];

const Home = () => {
  const { currentUser, authLoading } = useGlobalContext();

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#fffaf2] px-4 text-center">
        <div>
          <div className="mx-auto h-11 w-11 animate-pulse rounded-2xl bg-sky-500 shadow-[0_16px_40px_rgba(14,165,233,0.22)]" />
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
    ? { label: 'Open Provider Workspace', to: '/provider', icon: LayoutDashboard }
    : { label: 'Book a Service', to: '/taker/book', icon: CalendarPlus };
  const PrimaryActionIcon = primaryAction.icon;
  const quickActions = isProvider
    ? [
        { label: 'Provider Dashboard', text: 'Track growth, profile score, and leads.', to: '/provider', icon: LayoutDashboard },
        { label: 'Manage Services', text: 'Publish and update service offerings.', to: '/provider/services', icon: BriefcaseBusiness },
        { label: 'Service Requests', text: 'Review customer requests and quotes.', to: '/provider/requests', icon: Search },
      ]
    : QUICK_ACTIONS;

  return (
    <div className="bg-[#fffaf2] text-slate-950">
      <AdsRail />
      <TopAdCarousel placement="home" />

      <section className="relative overflow-hidden bg-[#fffaf2]">
        <div className="absolute inset-x-0 top-0 h-[80%] bg-[radial-gradient(circle_at_18%_10%,rgba(251,191,36,0.24),transparent_26%),linear-gradient(135deg,#3b0b07_0%,#7f1d1d_46%,#111827_112%)]" />
        <div className="culture-pattern absolute inset-x-0 top-0 h-[80%] opacity-70" />
        <div className="absolute -right-24 top-14 h-56 w-56 rounded-full border border-amber-200/20 sm:h-80 sm:w-80" />
        <div className="absolute -left-16 top-48 h-44 w-44 rounded-full bg-sky-300/10 blur-3xl" />

        <div className="site-shell relative py-6 sm:py-12 lg:py-16">
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
                    Dharma | Seva | Samaj
                  </span>
                </span>
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-amber-200">
                Namaste, {currentUser.name}
              </p>
              <h1 className="mt-3 max-w-3xl text-[2.15rem] font-black leading-[1.03] tracking-tight sm:text-5xl lg:text-[4.1rem]">
                Culture-first app for trusted local seva.
              </h1>
              <p className="mt-4 max-w-2xl text-sm font-semibold leading-6 text-white/80 sm:text-lg sm:leading-8">
                Discover verified services, manage requests, and grow community connections inside a modern professional workspace.
              </p>

              <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
                <Link
                  to={primaryAction.to}
                  className="group inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-400 px-5 py-3.5 text-sm font-black text-slate-950 shadow-[0_18px_45px_rgba(56,189,248,0.26)] transition hover:bg-sky-300"
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
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-white/10 p-2 shadow-[0_30px_90px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="relative min-h-[380px] overflow-hidden rounded-[1.35rem] bg-slate-950 sm:min-h-[500px]">
                  <img
                    src={parshuramHero}
                    alt="Vipra Sewa Setu cultural platform"
                    className="absolute inset-0 h-full w-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.02)_0%,rgba(67,20,7,0.14)_34%,rgba(15,23,42,0.9)_100%)]" />
                  <div className="soft-float absolute left-4 top-4 rounded-2xl border border-white/15 bg-white/14 px-4 py-3 text-white shadow-lg backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-amber-200">Live now</p>
                    <p className="mt-1 text-sm font-black">Requests moving fast</p>
                  </div>
                  <div className="soft-float-delayed absolute right-4 top-24 rounded-2xl border border-white/15 bg-slate-950/48 px-4 py-3 text-white shadow-lg backdrop-blur-md">
                    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-sky-200">Provider score</p>
                    <p className="mt-1 text-xl font-black">98%</p>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/15 bg-slate-950/62 p-4 text-white shadow-lg backdrop-blur-md sm:p-5">
                    <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-200">
                      Trusted member experience
                    </p>
                    <h2 className="mt-2 text-2xl font-black leading-tight">
                      Services, people, and purpose in one app.
                    </h2>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {CULTURE_STATS.map(({ label, value }) => (
                        <div key={label} className="rounded-xl bg-white/10 p-2 text-center">
                          <p className="text-lg font-black">{value}</p>
                          <p className="mt-0.5 text-[9px] font-black uppercase tracking-[0.1em] text-white/55">{label}</p>
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
            className="mt-6 grid grid-cols-3 gap-2 sm:gap-3"
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

      <section className="bg-white py-7 sm:py-12">
        <div className="site-shell">
          <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Quick actions</p>
              <h2 className="mt-2 max-w-lg text-2xl font-black leading-tight text-slate-950 sm:text-4xl">
                Move through the app without confusion.
              </h2>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-500">
                A balanced workspace for service seekers, providers, and community growth.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {quickActions.map(({ icon: Icon, label, text, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex min-h-[132px] gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-sky-200 hover:bg-white hover:shadow-[0_18px_40px_rgba(15,23,42,0.08)] md:block"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-amber-300">
                    <Icon size={19} />
                  </span>
                  <span className="min-w-0">
                    <h3 className="text-base font-black text-slate-950 md:mt-4">{label}</h3>
                    <p className="mt-1 text-sm font-semibold leading-6 text-slate-500 md:mt-2">{text}</p>
                    <span className="mt-3 inline-flex items-center gap-2 text-sm font-black text-sky-700 md:mt-4">
                      Open <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </span>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#fffaf2_0%,#ffffff_48%,#f8fafc_100%)] py-7 sm:py-14 lg:py-16">
        <div className="site-shell">
          <LeadGenForm />
        </div>
      </section>

      <section className="bg-slate-950 py-7 text-white sm:py-12">
        <div className="site-shell">
          <div className="grid gap-3 sm:grid-cols-3">
            {TRUST_POINTS.map(({ icon: Icon, title, text }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 backdrop-blur"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-300 text-red-950">
                  <Icon size={19} />
                </div>
                <h2 className="mt-4 text-sm font-black text-white">{title}</h2>
                <p className="mt-2 text-xs font-medium leading-5 text-white/62">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <MarketplaceValueSection />
      <CategoriesSection />
      <WorkersSection selectedCategory={null} />
      <ReviewsSection />
    </div>
  );
};

export default Home;
