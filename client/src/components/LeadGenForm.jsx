import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarCheck,
  HandHeart,
  MessageSquareQuote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
} from 'lucide-react';

import bpfLogo from '../assets/bpf.jpeg';
import logo from '../assets/logo.jpeg';
import parshuramHero from '../assets/parshuram-hero.png';
import vipraLogo from '../assets/viprasena.jpeg';

const PARTNERS = [
  { title: 'Vipra Sena', image: vipraLogo },
  { title: 'BPF', image: bpfLogo },
  { title: 'Seva Setu', image: logo },
];

const BENEFITS = [
  { icon: ShieldCheck, title: 'Verified access', text: 'Trusted local members and providers.' },
  { icon: BriefcaseBusiness, title: 'Provider growth', text: 'Visibility for work, services, and business.' },
  { icon: HandHeart, title: 'Community support', text: 'Seva-led help for everyday needs.' },
];

const JOURNEY = [
  { icon: Search, title: 'Smart search', text: 'Find providers by category, city, skill, rating and availability.' },
  { icon: MessageSquareQuote, title: 'Quotes and tracking', text: 'Send or receive structured quotes with request status updates.' },
  { icon: CalendarCheck, title: 'Booking control', text: 'Choose time, budget, urgency and keep repeat providers saved.' },
  { icon: Sparkles, title: 'Growth tools', text: 'Providers get CRM, lead pipeline, analytics and business settings.' },
];

const FEATURE_PATHS = [
  { icon: Search, title: 'For service takers', text: 'Book help, compare providers, save trusted profiles and track every request.', to: '/taker/book', cta: 'Start Booking' },
  { icon: BriefcaseBusiness, title: 'For service providers', text: 'Publish services, claim leads, send quotes and manage your business pipeline.', to: '/provider', cta: 'Open Provider Tools' },
  { icon: Star, title: 'Browse marketplace', text: 'Explore categories and providers before creating an account.', to: '/services', cta: 'Explore Services' },
];

const LeadGenForm = () => {
  return (
    <section className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-[0_18px_60px_rgba(15,23,42,0.08)] sm:rounded-[1.75rem]">
      <div className="grid lg:grid-cols-[minmax(0,1.06fr)_minmax(340px,0.94fr)]">
        <div className="bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_54%,#f8fafc_100%)] p-4 sm:p-7 lg:p-8 xl:p-10">
          <div className="relative overflow-hidden rounded-[1.25rem] bg-slate-950 shadow-[0_18px_50px_rgba(15,23,42,0.18)]">
            <div className="min-h-[240px] sm:min-h-[360px] lg:min-h-[440px]">
              <img
                src={parshuramHero}
                alt="Bhagwan Parshuram"
                className="absolute inset-0 h-full w-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(67,20,7,0.92)_0%,rgba(67,20,7,0.58)_48%,rgba(67,20,7,0.04)_100%)]" />
              <div className="absolute inset-y-0 left-0 flex w-[74%] max-w-md flex-col justify-center p-4 text-white sm:p-7 lg:p-8">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-200 sm:text-xs">
                  Dharma | Seva | Samaj
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight sm:text-4xl">
                  One trusted digital platform for seva, work, and community support.
                </h2>
                <p className="mt-3 text-xs font-semibold leading-5 text-white/82 sm:text-sm sm:leading-6">
                  Trusted local help, work opportunities, and community support in one simple platform.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[1fr_0.85fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-800">
                Join the network
              </p>
              <h2 className="mt-2 max-w-2xl text-2xl font-black leading-tight text-slate-950 sm:text-4xl">
                Create account once, then use the complete app.
              </h2>
              <p className="mt-3 max-w-xl text-sm font-semibold leading-6 text-slate-600 sm:text-base sm:leading-7">
                After signup, members can access dashboards, requests, providers, and service discovery from one place.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {PARTNERS.map((partner) => (
                <div
                  key={partner.title}
                  className="rounded-xl border border-slate-200 bg-white p-2 text-center shadow-sm"
                >
                  <img
                    src={partner.image}
                    alt={partner.title}
                    className="mx-auto h-10 w-10 rounded-lg object-cover sm:h-12 sm:w-12"
                  />
                  <p className="mt-2 text-[10px] font-black leading-4 text-slate-700 sm:text-[11px]">
                    {partner.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 grid gap-2 sm:grid-cols-3 sm:gap-3">
            {BENEFITS.map(({ icon: Icon, title, text }) => (
              <div
                key={title}
                className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-950 text-amber-300">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-black text-slate-950">{title}</h3>
                  <p className="text-xs font-semibold leading-5 text-slate-500">{text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {FEATURE_PATHS.map(({ icon: Icon, title, text, to, cta }) => (
              <Link
                key={title}
                to={to}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-700">
                  <Icon size={18} />
                </span>
                <h3 className="mt-3 text-sm font-black text-slate-950">{title}</h3>
                <p className="mt-2 text-xs font-semibold leading-5 text-slate-500">{text}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-black text-sky-700">
                  {cta}
                  <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>

        <aside className="border-t border-slate-200 bg-slate-50 p-4 sm:p-7 lg:border-l lg:border-t-0 lg:p-8">
          <div className="mx-auto flex h-full max-w-md flex-col justify-between rounded-[1.25rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] sm:p-6">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-amber-700 sm:text-xs">
                Account-first experience
              </p>
              <h2 className="mt-3 text-2xl font-black leading-tight text-slate-950">
                Unlock the app with your member profile.
              </h2>
              <p className="mt-3 text-sm font-semibold leading-6 text-slate-500">
                Create an account to save requests, contact providers, manage leads, and continue from any device.
              </p>

              <div className="mt-6 space-y-3">
                {JOURNEY.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                      <Icon size={18} />
                    </span>
                    <span>
                      <span className="block text-sm font-black text-slate-950">{title}</span>
                      <span className="mt-1 block text-xs font-medium leading-5 text-slate-500">{text}</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-center">
                <div>
                  <p className="text-lg font-black text-slate-950">7+</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Categories</p>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-950">CRM</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Provider</p>
                </div>
                <div>
                  <p className="text-lg font-black text-slate-950">Live</p>
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">Tracking</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <Link
                to="/login?mode=signup"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3.5 text-sm font-black text-white transition hover:bg-sky-600"
              >
                Create Account
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/services"
                className="flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-black text-slate-700 transition hover:border-sky-200 hover:text-sky-700"
              >
                Explore without account
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default LeadGenForm;
