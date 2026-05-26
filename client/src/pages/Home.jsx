import { ArrowRight, BriefcaseBusiness, HandHeart, ShieldCheck, UsersRound } from 'lucide-react';
import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import LeadGenForm from '../components/LeadGenForm';
import CategoriesSection from '../components/CategoriesSection';
import WorkersSection from '../components/WorkersSection';
import ReviewsSection from '../components/ReviewsSection';

const ALL_SLIDES = [
  {
    id: 1,
    title: 'Vipra Seva Setu',
    subtitle: 'समाज, सेवा और रोजगार को जोड़ने वाला आधुनिक डिजिटल मंच',
    badge: 'COMMUNITY FIRST',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
    color: 'from-[#431407]/95 via-[#7f1d1d]/85'
  },
  {
    id: 2,
    title: 'Local services, trusted people',
    subtitle: 'Household, event, hospital, education, property aur business support ek jagah',
    badge: 'ORDER SERVICES',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1400&auto=format&fit=crop',
    color: 'from-slate-950/95 via-blue-950/80'
  },
  {
    id: 3,
    title: 'Youth opportunities and business visibility',
    subtitle: 'Samaj ke yuva, professionals aur local providers ko naye mauke se connect karein',
    badge: 'GROW TOGETHER',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1400&auto=format&fit=crop',
    color: 'from-amber-950/90 via-red-950/80'
  },
  {
    id: 4,
    title: 'Apply, order and get connected',
    subtitle: 'Service choose karein, requirement bhejein, aur right provider se baat karein',
    badge: 'START NOW',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1400&auto=format&fit=crop',
    color: 'from-indigo-950/95 via-slate-900/75'
  }
];

const HOME_STATS = [
  { label: 'Service Categories', value: '7+', icon: BriefcaseBusiness },
  { label: 'Verified Providers', value: '650+', icon: ShieldCheck },
  { label: 'Community Members', value: '15k+', icon: UsersRound },
  { label: 'Support Requests', value: '24/7', icon: HandHeart },
];

const Home = () => {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-white pb-14">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-amber-50 to-white" />
        <div className="relative h-[360px] w-full overflow-hidden border-b border-amber-100/70 md:h-[440px]">
          <HeroCarousel slides={ALL_SLIDES} />
        </div>

        <div className="site-shell relative mt-8">
          <LeadGenForm />
        </div>
      </section>

      <section className="border-y border-slate-200 bg-white">
        <div className="site-shell py-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {HOME_STATS.map(({ label, value, icon: Icon }) => (
              <div key={label} className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                  <Icon size={22} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-950">{value}</p>
                  <p className="text-sm font-semibold text-slate-500">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] py-10">
        <div className="site-shell">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <span className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-amber-800">
                Fast Service Flow
              </span>
              <h2 className="mt-3 text-2xl font-extrabold text-slate-950 md:text-3xl">
                Service choose karo, apply/order karo, provider se connect ho jao.
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
                Household, event, hospital, education, property, hotel aur other services ke liye category page par related work options milenge.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-amber-700"
            >
              Explore services <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      <CategoriesSection />
      <WorkersSection selectedCategory={null} />
      <ReviewsSection />
    </div>
  );
};

export default Home;
