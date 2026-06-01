import { ArrowRight, BadgeCheck, BriefcaseBusiness, ClipboardCheck, PhoneCall, Rocket, SearchCheck, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';

const FLOW = [
  { icon: SearchCheck, title: 'Discover', text: 'Users compare real categories, skills, city, rate and availability before sending a request.' },
  { icon: ClipboardCheck, title: 'Request', text: 'A logged-in service taker creates a requirement that is saved in the backend.' },
  { icon: PhoneCall, title: 'Connect', text: 'Approved providers receive matching leads and move work through assigned, progress and completed.' },
];

const PROVIDER_GROWTH = [
  'Professional listing with category, skill tags, city, rate and availability',
  'Open lead board for providers to claim work matching profile',
  'Dashboard for live services, assigned requests and completed work',
  'Admin approval flow so users see a controlled provider network',
];

const MarketplaceValueSection = () => {
  const { providers, services, marketplaceWorkers } = useGlobalContext();
  const approvedProviders = providers.filter((provider) => provider.isApproved).length;
  const liveServices = services.filter((service) => service.isActive).length;
  const topCategories = marketplaceWorkers.reduce((counts, worker) => {
    counts[worker.category] = (counts[worker.category] || 0) + 1;
    return counts;
  }, {});

  return (
    <>
      <section className="bg-slate-950 py-10 text-white sm:py-16">
        <div className="site-shell">
          <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-black uppercase tracking-[0.18em] text-sky-200">
                <Sparkles size={15} />
                Built like a service marketplace
              </span>
              <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight sm:text-4xl">
                Real discovery, real requests, real provider growth.
              </h2>
              <p className="mt-3 max-w-2xl text-sm font-medium leading-7 text-slate-300 sm:text-base">
                The platform now focuses on the two sides that matter: users can find trusted help quickly, and providers get a clear path to publish services and receive leads.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Metric label="Approved providers" value={approvedProviders} />
              <Metric label="Live services" value={liveServices} />
              <Metric label="Categories active" value={Object.keys(topCategories).length} />
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FLOW.map(({ icon: Icon, title, text }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.06] p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-400 text-slate-950">
                  <Icon size={21} />
                </div>
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-300">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-10 sm:py-16">
        <div className="site-shell">
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Rocket size={23} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">For service providers</p>
                  <h2 className="mt-2 text-2xl font-black text-slate-950 sm:text-4xl">
                    Grow from local contact to trusted digital listing.
                  </h2>
                  <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                    Providers need visibility, trust and repeatable lead flow. The app gives them profile quality, published services, direct requests and a lead board.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {PROVIDER_GROWTH.map((item) => (
                  <div key={item} className="flex gap-3 rounded-2xl bg-slate-50 p-4">
                    <BadgeCheck size={19} className="mt-0.5 shrink-0 text-emerald-600" />
                    <p className="text-sm font-bold leading-6 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/login" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-emerald-700">
                  Join as Provider
                  <ArrowRight size={17} />
                </Link>
                <Link to="/services" className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-50">
                  Explore Marketplace
                </Link>
              </div>
            </div>

            <div className="grid gap-4">
              <Signal icon={ShieldCheck} title="Trust-first network" text="Admin approval and account status keep listings controlled." />
              <Signal icon={TrendingUp} title="Growth dashboard" text="Providers see live services, open leads, assigned work and completed jobs." />
              <Signal icon={BriefcaseBusiness} title="Service catalogue" text="Each provider can publish multiple services with rate and description." />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

const Metric = ({ label, value }) => (
  <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
    <p className="text-3xl font-black text-white">{value}</p>
    <p className="mt-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">{label}</p>
  </div>
);

const Signal = ({ icon: Icon, title, text }) => (
  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-start gap-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-700">
        <Icon size={21} />
      </span>
      <div>
        <h3 className="font-black text-slate-950">{title}</h3>
        <p className="mt-1 text-sm font-medium leading-6 text-slate-500">{text}</p>
      </div>
    </div>
  </article>
);

export default MarketplaceValueSection;
