import { motion } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CheckCircle2,
  HandHeart,
  MapPin,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';

import logo from '../assets/logo.jpeg';
import parshuramHero from '../assets/parshuram-hero.png';

const HINDI = {
  values: ['\u0927\u0930\u094d\u092e', '\u0938\u0947\u0935\u093e', '\u0938\u0902\u0938\u094d\u0915\u093e\u0930', '\u0938\u0939\u092f\u094b\u0917'],
  brandLine: '\u0927\u0930\u094d\u092e | \u0938\u0947\u0935\u093e | \u0938\u092e\u093e\u091c',
  heroTitle: '\u0938\u092e\u093e\u091c \u0915\u094b \u091c\u094b\u0921\u093c\u0928\u0947 \u0935\u093e\u0932\u093e \u0935\u093f\u0936\u094d\u0935\u0938\u0928\u0940\u092f \u0921\u093f\u091c\u093f\u091f\u0932 \u092e\u0902\u091a',
  visualTitle: '\u092a\u0930\u0902\u092a\u0930\u093e \u0915\u0940 \u091c\u0921\u093c\u0947\u0902, \u0921\u093f\u091c\u093f\u091f\u0932 \u0938\u0941\u0935\u093f\u0927\u093e \u0915\u0947 \u0938\u093e\u0925',
  missionTitle: '\u0935\u093f\u0936\u094d\u0935\u093e\u0938 \u0938\u0947 \u0935\u093f\u0915\u093e\u0938 \u0924\u0915',
  missionOne: 'Vipra Sewa Setu \u0938\u092e\u093e\u091c \u0915\u094b \u0921\u093f\u091c\u093f\u091f\u0932 \u0930\u0942\u092a \u0938\u0947 \u091c\u094b\u0921\u093c\u0928\u0947 \u0915\u0940 \u092a\u0939\u0932 \u0939\u0948, \u091c\u0939\u093e\u0902 \u0930\u094b\u091c\u0917\u093e\u0930, \u0938\u0947\u0935\u093e, \u0935\u094d\u092f\u0935\u0938\u093e\u092f \u0914\u0930 \u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u0938\u0939\u092f\u094b\u0917 \u090f\u0915 \u0939\u0940 \u092e\u0902\u091a \u092a\u0930 \u092e\u093f\u0932\u0924\u0947 \u0939\u0948\u0902.',
  missionTwo: '\u0939\u092e\u093e\u0930\u093e \u0909\u0926\u094d\u0926\u0947\u0936\u094d\u092f \u0938\u094d\u0925\u093e\u0928\u0940\u092f \u0932\u094b\u0917\u094b\u0902 \u0915\u094b \u092d\u0930\u094b\u0938\u0947\u092e\u0902\u0926 \u092a\u0939\u091a\u093e\u0928 \u0926\u0947\u0928\u093e, \u092f\u0941\u0935\u093e\u0913\u0902 \u0915\u094b \u0905\u0935\u0938\u0930\u094b\u0902 \u0938\u0947 \u091c\u094b\u0921\u093c\u0928\u093e \u0914\u0930 \u092a\u0930\u093f\u0935\u093e\u0930\u094b\u0902 \u0924\u0915 \u0938\u0939\u0940 \u0938\u0939\u093e\u092f\u0924\u093e \u092a\u0939\u0941\u0902\u091a\u093e\u0928\u093e \u0939\u0948.',
};

const STATS = [
  ['100%', 'Trust'],
  ['Local', 'Network'],
  ['24/7', 'Access'],
];

const TRUST_CARDS = [
  {
    title: 'Verified people',
    text: 'Local members and service providers are presented with clear identity and trust signals.',
    icon: ShieldCheck,
  },
  {
    title: 'Community first',
    text: 'The platform is built around seva, family needs, and practical local support.',
    icon: HandHeart,
  },
  {
    title: 'Opportunity network',
    text: 'Youth, professionals, and businesses get better visibility through one digital setu.',
    icon: BriefcaseBusiness,
  },
];

const PURPOSE = [
  {
    title: '\u0930\u094b\u091c\u0917\u093e\u0930 \u0914\u0930 \u0905\u0935\u0938\u0930',
    text: '\u092f\u0941\u0935\u093e\u0913\u0902 \u0915\u094b \u0915\u093e\u092e, \u0938\u0947\u0935\u093e \u0914\u0930 \u0935\u094d\u092f\u093e\u0935\u0938\u093e\u092f\u093f\u0915 \u0905\u0935\u0938\u0930\u094b\u0902 \u0938\u0947 \u091c\u094b\u0921\u093c\u0928\u093e.',
    icon: BriefcaseBusiness,
  },
  {
    title: '\u0938\u094d\u0925\u093e\u0928\u0940\u092f \u092a\u0939\u091a\u093e\u0928',
    text: '\u0939\u0941\u0928\u0930\u092e\u0902\u0926 \u0932\u094b\u0917\u094b\u0902 \u0914\u0930 \u0938\u0947\u0935\u093e \u092a\u094d\u0930\u0926\u093e\u0924\u093e\u0913\u0902 \u0915\u094b \u0921\u093f\u091c\u093f\u091f\u0932 \u092a\u0939\u091a\u093e\u0928 \u0926\u0947\u0928\u093e.',
    icon: UsersRound,
  },
  {
    title: '\u0938\u093e\u092e\u093e\u091c\u093f\u0915 \u0938\u0939\u092f\u094b\u0917',
    text: '\u091c\u0930\u0942\u0930\u0924\u092e\u0902\u0926 \u092a\u0930\u093f\u0935\u093e\u0930\u094b\u0902 \u0924\u0915 \u0938\u0939\u0940 \u0938\u092e\u092f \u092a\u0930 \u092d\u0930\u094b\u0938\u0947\u092e\u0902\u0926 \u0938\u0939\u093e\u092f\u0924\u093e \u092a\u0939\u0941\u0902\u091a\u093e\u0928\u093e.',
    icon: HandHeart,
  },
];

const STEPS = [
  ['01', 'Choose service', 'Category select karein aur requirement dekhein.'],
  ['02', 'Submit request', 'Naam, mobile, location aur need share karein.'],
  ['03', 'Trusted connect', 'Relevant provider ya support team connect karegi.'],
];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#fffaf2] pb-10 text-slate-950">
      <div className="site-shell py-5 sm:py-10">
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-[0_24px_70px_rgba(67,20,7,0.10)]"
        >
          <div className="grid lg:grid-cols-[1fr_430px]">
            <div className="relative overflow-hidden bg-gradient-to-br from-[#3b0b07] via-[#7f1d1d] to-slate-950 p-5 text-white sm:p-8 lg:p-10">
              <div className="culture-pattern absolute inset-0 opacity-50" />

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.05, duration: 0.45 }}
                className="relative inline-flex max-w-full items-center gap-3 rounded-full border border-white/15 bg-white/12 py-1.5 pl-1.5 pr-4"
              >
                <img src={logo} alt="Vipra Sewa Setu" className="h-10 w-10 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight">Vipra Sewa Setu</span>
                  <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
                    {HINDI.brandLine}
                  </span>
                </span>
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.1, duration: 0.45 }}
                className="relative mt-7"
              >
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-red-950">
                  <Sparkles size={14} />
                  About the platform
                </span>
                <h1 className="mt-5 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
                  {HINDI.heroTitle}
                </h1>
                <p className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-white/82 sm:text-base">
                  A premium community platform for trusted services, employment, business visibility, and social support.
                </p>
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.16, duration: 0.45 }}
                className="relative mt-6 flex snap-x gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
              >
                {HINDI.values.map((value) => (
                  <span
                    key={value}
                    className="min-w-max snap-start rounded-full border border-white/15 bg-white/12 px-4 py-2 text-sm font-black text-amber-100"
                  >
                    {value}
                  </span>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.22, duration: 0.45 }}
                className="relative mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-white/15 bg-white/10 text-center"
              >
                {STATS.map(([value, label], index) => (
                  <div key={label} className={`px-2 py-4 ${index < 2 ? 'border-r border-white/10' : ''}`}>
                    <span className="block text-xl font-black text-white">{value}</span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-white/58">{label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.28, duration: 0.45 }}
                className="relative mt-6 rounded-2xl border border-white/15 bg-white/10 p-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-red-950">
                    <BadgeCheck size={21} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Premium trust experience</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-white/76">
                      Clear identity, cultural belonging, and practical service access in one app-like flow.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-[#40120d] p-4 sm:p-6 lg:p-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.55, ease: 'easeOut' }}
                className="relative min-h-[320px] overflow-hidden rounded-2xl border border-amber-200/25 bg-gradient-to-b from-red-900 via-[#431407] to-slate-950 shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:min-h-[500px]"
              >
                <div className="culture-pattern absolute inset-0 opacity-25" />
                <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-amber-100">
                  Dharma | Seva | Samaj
                </div>
                <motion.img
                  src={parshuramHero}
                  alt="Bhagwan Parshuram"
                  initial={{ y: 8 }}
                  animate={{ y: [8, 0, 8] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-0 right-[-1.25rem] h-[315px] max-w-none object-contain drop-shadow-[0_28px_42px_rgba(0,0,0,0.36)] sm:left-1/2 sm:right-auto sm:h-[500px] sm:-translate-x-1/2"
                />
                <div className="absolute inset-x-3 bottom-3 z-10 rounded-2xl border border-white/15 bg-slate-950/62 p-4 text-white backdrop-blur-md sm:inset-x-4 sm:bottom-4">
                  <p className="text-[1.35rem] font-black leading-tight sm:text-lg">{HINDI.visualTitle}</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/76">
                    Built to feel respectful, reliable, and easy for every community member.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
          {TRUST_CARDS.map(({ title, text, icon: Icon }, index) => (
            <motion.article
              key={title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-red-900">
                <Icon size={23} />
              </div>
              <h2 className="mt-5 text-lg font-black text-slate-950">{title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
            </motion.article>
          ))}
        </section>

        <section className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950 text-amber-300">
                <ShieldCheck size={25} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-800">Our Mission</span>
                <h2 className="text-xl font-black text-slate-950">{HINDI.missionTitle}</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
              <p>{HINDI.missionOne}</p>
              <p>{HINDI.missionTwo}</p>
            </div>
          </motion.div>

          <div className="grid gap-3 sm:grid-cols-3">
            {PURPOSE.map(({ title, text, icon: Icon }, index) => (
              <motion.article
                key={title}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.35 }}
                variants={fadeUp}
                transition={{ delay: index * 0.06, duration: 0.45 }}
                className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start gap-4 sm:block">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff7ed] text-red-900">
                    <Icon size={21} />
                  </div>
                  <div className="sm:mt-5">
                    <h3 className="font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={fadeUp}
          transition={{ duration: 0.45 }}
          className="mt-5 overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm"
        >
          <div className="border-b border-amber-100 bg-[#fff7ed] px-5 py-5 sm:px-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-800">How it works</span>
                <h2 className="mt-1 text-2xl font-black text-slate-950">Simple, trusted process</h2>
              </div>
              <ArrowRight className="hidden text-red-900 sm:block" size={28} />
            </div>
          </div>

          <div className="grid md:grid-cols-3">
            {STEPS.map(([count, title, text], index) => (
              <motion.article
                key={title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ delay: index * 0.08, duration: 0.42 }}
                className="border-b border-amber-100 p-5 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0 sm:p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-950 text-sm font-black text-amber-200">
                    {count}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-950">{title}</h3>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          variants={fadeUp}
          transition={{ duration: 0.45 }}
          className="mt-5 flex items-center gap-3 rounded-2xl border border-red-900 bg-red-950 p-4 text-white shadow-[0_18px_45px_rgba(127,29,29,0.16)] sm:p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-amber-300 text-red-950">
            <MapPin size={23} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-black">Bhilwara focused community platform</p>
            <p className="mt-1 text-xs font-semibold leading-5 text-amber-50/75">
              Local needs, verified people, and trusted support in one premium app-like experience.
            </p>
          </div>
          <CheckCircle2 className="ml-auto hidden shrink-0 text-amber-300 sm:block" size={24} />
        </motion.section>
      </div>
    </div>
  );
};

export default AboutPage;
