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

import parshuramHero from '../assets/parshuram-hero.png';

const VALUES = ['धर्म', 'सेवा', 'संस्कार', 'सहयोग'];

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
    title: 'रोजगार और अवसर',
    text: 'युवाओं को काम, सेवा और व्यवसायिक अवसरों से जोड़ना.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'स्थानीय पहचान',
    text: 'हुनरमंद लोगों और सेवा प्रदाताओं को डिजिटल पहचान देना.',
    icon: UsersRound,
  },
  {
    title: 'सामाजिक सहयोग',
    text: 'जरूरतमंद परिवारों तक सही समय पर भरोसेमंद सहायता पहुंचाना.',
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
    <div className="min-h-screen bg-[#fbf7f0] pb-10 pt-4 text-slate-950 sm:pt-8 lg:py-14">
      <div className="site-shell max-w-6xl">
        <motion.section
          initial="hidden"
          animate="show"
          variants={fadeUp}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="overflow-hidden rounded-[1.6rem] border border-[#ead8c0] bg-[#fffdf8] shadow-[0_24px_70px_rgba(67,20,7,0.10)] sm:rounded-3xl"
        >
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="bg-[linear-gradient(135deg,#fffdf8_0%,#fff7ed_100%)] px-4 py-5 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.05, duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-900 shadow-sm"
              >
                <Sparkles size={14} />
                Vipra Sewa Setu
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-5 max-w-3xl text-3xl font-black leading-[1.08] tracking-tight text-slate-950 sm:text-6xl"
              >
                समाज को जोड़ने वाला विश्वसनीय डिजिटल मंच
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ delay: 0.16, duration: 0.5 }}
                className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8"
              >
                A premium community platform for trusted services, employment, business visibility, and social support.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.22, duration: 0.45 }}
                className="mt-5 flex snap-x gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0"
              >
                {VALUES.map((value) => (
                  <span
                    key={value}
                    className="min-w-max snap-start rounded-full border border-amber-200 bg-white px-4 py-2 text-sm font-black text-red-950 shadow-sm"
                  >
                    {value}
                  </span>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.28, duration: 0.45 }}
                className="mt-6 grid grid-cols-3 overflow-hidden rounded-2xl border border-amber-200 bg-white text-center shadow-sm"
              >
                {STATS.map(([value, label], index) => (
                  <div key={label} className={`px-2 py-4 ${index < 2 ? 'border-r border-amber-100' : ''}`}>
                    <span className="block text-xl font-black text-red-900">{value}</span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500">{label}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.34, duration: 0.45 }}
                className="mt-6 rounded-2xl border border-red-100 bg-red-950 p-4 text-white shadow-[0_16px_40px_rgba(127,29,29,0.16)]"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300 text-red-950">
                    <BadgeCheck size={21} />
                  </div>
                  <div>
                    <p className="text-sm font-black">Premium trust experience</p>
                    <p className="mt-1 text-xs font-semibold leading-5 text-amber-50/78">
                      Clear identity, cultural belonging, and practical service access in one app-like flow.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-[#40120d] p-4 sm:p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.55, ease: 'easeOut' }}
                className="relative min-h-[340px] overflow-hidden rounded-[1.45rem] border border-amber-200/25 bg-[linear-gradient(180deg,#7f1d1d_0%,#431407_62%,#170a08_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:min-h-[460px] sm:rounded-3xl"
              >
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px]" />
                <div className="absolute left-4 top-4 z-10 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-amber-100 backdrop-blur">
                  Dharma | Seva | Samaj
                </div>
                <motion.img
                  src={parshuramHero}
                  alt="Bhagwan Parshuram"
                  initial={{ y: 14 }}
                  animate={{ y: [8, 0, 8] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute bottom-0 left-1/2 h-[335px] max-w-none -translate-x-1/2 object-contain drop-shadow-[0_28px_42px_rgba(0,0,0,0.36)] sm:h-[450px] lg:h-[500px]"
                />
                <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl border border-white/15 bg-slate-950/50 p-4 text-white backdrop-blur-md">
                  <p className="text-lg font-black leading-tight">परंपरा की जड़ें, डिजिटल सुविधा के साथ</p>
                  <p className="mt-1 text-xs font-semibold leading-5 text-white/76">
                    Built to feel respectful, reliable, and easy for every community member.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="mt-5 grid gap-3 sm:mt-8 md:grid-cols-3 md:gap-4">
          {TRUST_CARDS.map(({ title, text, icon: Icon }, index) => (
            <motion.article
              key={title}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
              transition={{ delay: index * 0.06, duration: 0.45 }}
              whileHover={{ y: -4 }}
              className="rounded-[1.35rem] border border-amber-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-6"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-red-900">
                <Icon size={23} />
              </div>
              <h2 className="mt-5 text-lg font-black text-slate-950">{title}</h2>
              <p className="mt-2 text-sm font-medium leading-6 text-slate-600">{text}</p>
            </motion.article>
          ))}
        </section>

        <section className="mt-5 grid gap-4 sm:mt-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="rounded-[1.4rem] border border-amber-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-950 text-amber-300">
                <ShieldCheck size={25} />
              </div>
              <div>
                <span className="text-xs font-black uppercase tracking-[0.18em] text-red-800">Our Mission</span>
                <h2 className="text-xl font-black text-slate-950">विश्वास से विकास तक</h2>
              </div>
            </div>

            <div className="mt-5 space-y-4 text-sm font-medium leading-7 text-slate-600 sm:text-base">
              <p>
                Vipra Sewa Setu समाज को डिजिटल रूप से जोड़ने की पहल है, जहां रोजगार, सेवा, व्यवसाय और सामाजिक सहयोग एक ही मंच पर मिलते हैं.
              </p>
              <p>
                हमारा उद्देश्य स्थानीय लोगों को भरोसेमंद पहचान देना, युवाओं को अवसरों से जोड़ना और परिवारों तक सही सहायता पहुंचाना है.
              </p>
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
                whileHover={{ y: -4 }}
                className="rounded-[1.35rem] border border-amber-100 bg-white p-5 shadow-sm sm:rounded-3xl"
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
          className="mt-5 overflow-hidden rounded-[1.4rem] border border-amber-100 bg-white shadow-sm sm:mt-8 sm:rounded-3xl"
        >
          <div className="border-b border-amber-100 bg-[#fffaf2] px-5 py-5 sm:px-7">
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
          className="mt-5 flex items-center gap-3 rounded-[1.35rem] border border-red-900 bg-red-950 p-4 text-white shadow-[0_18px_45px_rgba(127,29,29,0.16)] sm:mt-8 sm:p-5"
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
