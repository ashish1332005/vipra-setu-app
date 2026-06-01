import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const contactMethods = [
  {
    label: 'Call',
    value: '+91 94628 74574',
    href: 'tel:+919462874574',
    icon: Phone,
    tone: 'bg-sky-50 text-sky-800',
  },
  {
    label: 'WhatsApp',
    value: 'Chat with support',
    href: 'https://wa.me/919462874574',
    icon: MessageCircle,
    tone: 'bg-emerald-50 text-emerald-800',
  },
  {
    label: 'Email',
    value: 'support@viprasevasetu.com',
    href: 'mailto:support@viprasevasetu.com',
    icon: Mail,
    tone: 'bg-amber-50 text-amber-800',
  },
];

const supportNotes = [
  'Fast response for service requests',
  'Local support around Bhilwara',
  'Guidance for providers and members',
];

const quickTopics = ['Service request', 'Provider listing', 'Community help', 'Business visibility'];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0 },
};

const inputClass =
  'w-full rounded-2xl border border-amber-100 bg-[#fffaf2] px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-400 focus:bg-white focus:ring-4 focus:ring-amber-100';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Thank you for your message. We will get back to you shortly.');
    setFormData({ name: '', phone: '', message: '' });
  };

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

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
          <div className="grid lg:grid-cols-[1fr_0.95fr]">
            <div className="bg-[linear-gradient(135deg,#fffdf8_0%,#fff7ed_100%)] px-4 py-5 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.05, duration: 0.45 }}
                className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.18em] text-red-900 shadow-sm"
              >
                <Sparkles size={14} />
                Contact Vipra Sewa Setu
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
                भरोसेमंद सहायता, सही समय पर
              </motion.h1>

              <motion.p
                variants={fadeUp}
                transition={{ delay: 0.16, duration: 0.5 }}
                className="mt-4 max-w-2xl text-sm font-semibold leading-7 text-slate-600 sm:text-lg sm:leading-8"
              >
                Service request, provider listing, community support ya general query ke liye humse connect karein.
              </motion.p>

              <motion.div
                variants={fadeUp}
                transition={{ delay: 0.22, duration: 0.45 }}
                className="mt-6 grid gap-3 sm:grid-cols-3 lg:grid-cols-1"
              >
                {contactMethods.map(({ label, value, href, icon: Icon, tone }, index) => (
                  <motion.a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    whileHover={{ y: -3 }}
                    transition={{ delay: index * 0.05 }}
                    className="group flex min-w-0 items-center gap-4 rounded-2xl border border-amber-100 bg-white p-4 shadow-sm transition hover:border-amber-200 hover:shadow-[0_18px_40px_rgba(127,29,29,0.10)]"
                  >
                    <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${tone}`}>
                      <Icon size={22} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</span>
                      <span className="mt-1 block truncate text-sm font-black text-slate-950 group-hover:text-red-900">
                        {value}
                      </span>
                    </span>
                    <ArrowRight size={17} className="shrink-0 text-slate-300 transition group-hover:translate-x-1 group-hover:text-red-900" />
                  </motion.a>
                ))}
              </motion.div>
            </div>

            <div className="bg-[#40120d] p-4 sm:p-8 lg:p-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.55, ease: 'easeOut' }}
                className="relative flex h-full min-h-[360px] flex-col justify-between overflow-hidden rounded-[1.45rem] border border-amber-200/25 bg-[linear-gradient(180deg,#7f1d1d_0%,#431407_62%,#170a08_100%)] p-5 text-white shadow-[0_24px_60px_rgba(0,0,0,0.28)] sm:rounded-3xl"
              >
                <div className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(90deg,#fff_1px,transparent_1px),linear-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px]" />
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-300 text-red-950">
                    <ShieldCheck size={28} />
                  </div>
                  <h2 className="mt-6 text-3xl font-black leading-tight">Local support, trusted response</h2>
                  <p className="mt-3 text-sm font-semibold leading-6 text-amber-50/78">
                    Hum aapki requirement samajhkar right service, provider ya support direction tak pahunchane me help karte hain.
                  </p>
                </div>

                <div className="relative mt-8 grid gap-3">
                  {supportNotes.map((note, index) => (
                    <motion.div
                      key={note}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.28 + index * 0.08, duration: 0.4 }}
                      className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-semibold text-white backdrop-blur"
                    >
                      <CheckCircle2 size={17} className="shrink-0 text-amber-300" />
                      <span>{note}</span>
                    </motion.div>
                  ))}
                </div>

                <div className="relative mt-8 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur">
                  <MapPin size={19} className="mt-1 shrink-0 text-amber-300" />
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">Office</p>
                    <p className="mt-1 text-sm font-semibold leading-6 text-white">
                      MATHS Point, Near Fumes Flames, RK Colony, Bhilwara, Rajasthan
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        <section className="mt-5 grid gap-5 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="grid gap-4">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
              transition={{ duration: 0.45 }}
              className="rounded-[1.35rem] border border-amber-100 bg-white p-5 shadow-sm sm:rounded-3xl"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-red-900">
                  <Clock size={23} />
                </span>
                <div>
                  <h2 className="text-lg font-black text-slate-950">Support hours</h2>
                  <p className="mt-1 text-sm font-medium text-slate-500">Monday to Saturday, 10 AM - 7 PM</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.35 }}
              variants={fadeUp}
              transition={{ delay: 0.06, duration: 0.45 }}
              className="rounded-[1.35rem] border border-amber-100 bg-white p-5 shadow-sm sm:rounded-3xl"
            >
              <h2 className="text-lg font-black text-slate-950">Best for</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickTopics.map((item) => (
                  <span key={item} className="rounded-full bg-[#fff7ed] px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-amber-100">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            transition={{ duration: 0.45 }}
            className="rounded-[1.4rem] border border-amber-100 bg-white p-5 shadow-sm sm:rounded-3xl sm:p-7"
          >
            <div className="mb-6">
              <span className="text-xs font-black uppercase tracking-[0.18em] text-red-800">Send message</span>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Tell us what you need</h2>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-black text-slate-700">Full name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-black text-slate-700">Mobile number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className={inputClass}
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-sm font-black text-slate-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className={`${inputClass} resize-none`}
                  placeholder="How can we help you?"
                />
              </div>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-950 px-6 py-4 text-sm font-black text-white transition hover:bg-amber-700 focus:outline-none focus:ring-4 focus:ring-amber-100"
              >
                Send Message
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default ContactPage;
