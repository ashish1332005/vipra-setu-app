import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

import logo from '../assets/logo.jpeg';

const contactMethods = [
  {
    label: 'Call Us',
    value: '+91 94628 74574',
    hint: 'Best for urgent help',
    href: 'tel:+919462874574',
    icon: Phone,
    tone: 'bg-amber-300 text-red-950',
  },
  {
    label: 'WhatsApp',
    value: 'Chat with support',
    hint: 'Fast and simple',
    href: 'https://wa.me/919462874574',
    icon: MessageCircle,
    tone: 'bg-emerald-100 text-emerald-800',
  },
  {
    label: 'Email',
    value: 'support@viprasevasetu.com',
    hint: 'For detailed queries',
    href: 'mailto:support@viprasevasetu.com',
    icon: Mail,
    tone: 'bg-sky-100 text-sky-800',
  },
];

const trustItems = [
  'Service request guidance',
  'Provider listing support',
  'Local community help',
];

const quickTopics = ['Service request', 'Provider listing', 'Account help', 'Business visibility'];

const inputClass =
  'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-amber-300 focus:bg-white focus:ring-4 focus:ring-amber-100';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const [selectedTopic, setSelectedTopic] = useState(quickTopics[0]);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Thank you. Our team will contact you shortly.');
    setFormData({ name: '', phone: '', message: '' });
    setSelectedTopic(quickTopics[0]);
  };

  const handleChange = (event) => {
    setFormData((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-[#fffaf2] pb-10 text-slate-950">
      <section className="bg-[#fffaf2]">
        <div className="site-shell py-5 sm:py-10">
          <div className="grid gap-5 lg:grid-cols-[1fr_390px] lg:items-stretch">
            <div className="relative overflow-hidden rounded-2xl border border-red-950/10 bg-gradient-to-br from-[#3b0b07] via-[#7f1d1d] to-slate-950 p-4 text-white shadow-[0_28px_80px_rgba(67,20,7,0.22)] sm:p-7">
              <div className="culture-pattern absolute inset-0 opacity-40" />
              <div className="relative inline-flex max-w-full items-center gap-3 rounded-full border border-white/15 bg-white/12 py-1.5 pl-1.5 pr-4">
                <img src={logo} alt="Vipra Sewa Setu" className="h-10 w-10 rounded-full object-cover" />
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight">Vipra Sewa Setu</span>
                  <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-amber-200">
                    सहायता | सेवा | विश्वास
                  </span>
                </span>
              </div>

              <p className="relative mt-6 text-xs font-black uppercase tracking-[0.18em] text-amber-200">
                Contact support
              </p>
              <h1 className="relative mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-5xl">
                We are here to help.
              </h1>
              <p className="relative mt-3 max-w-2xl text-sm font-semibold leading-7 text-white/82 sm:text-base">
                Need help with a service, provider listing, account, or community support? Choose the fastest way to reach us.
              </p>

              <div className="relative mt-6 grid gap-3 sm:grid-cols-3 lg:max-w-3xl">
                {contactMethods.map(({ label, value, hint, href, icon: Icon, tone }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="group rounded-2xl border border-white/70 bg-white p-3 text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:shadow-[0_18px_38px_rgba(15,23,42,0.16)]"
                  >
                    <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone}`}>
                      <Icon size={20} />
                    </span>
                    <span className="mt-3 block text-sm font-black text-slate-950">{label}</span>
                    <span className="mt-1 block truncate text-xs font-bold text-slate-500">{value}</span>
                    <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-[0.08em] text-red-900">
                      {hint}
                      <ArrowRight size={13} className="transition group-hover:translate-x-0.5" />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-100 bg-white p-4 shadow-[0_22px_60px_rgba(67,20,7,0.14)] sm:p-5">
              <div className="flex items-start gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-900 text-amber-200">
                  <ShieldCheck size={23} />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-red-800">Trusted response</p>
                  <h2 className="mt-1 text-xl font-black leading-tight text-slate-950">Clear help, without confusion.</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    We guide users to the right service, provider, or support path.
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-2">
                {trustItems.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-3">
                    <CheckCircle2 size={17} className="shrink-0 text-emerald-600" />
                    <span className="text-sm font-bold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid gap-3 rounded-2xl bg-[#fff7ed] p-4 ring-1 ring-amber-100">
                <div className="flex items-start gap-3">
                  <Clock3 size={18} className="mt-0.5 shrink-0 text-red-900" />
                  <div>
                    <p className="text-sm font-black text-slate-950">Support hours</p>
                    <p className="text-xs font-semibold text-slate-500">Monday to Saturday, 10 AM - 7 PM</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={18} className="mt-0.5 shrink-0 text-red-900" />
                  <div>
                    <p className="text-sm font-black text-slate-950">Office</p>
                    <p className="text-xs font-semibold leading-5 text-slate-500">
                      MATHS Point, Near Fumes Flames, RK Colony, Bhilwara, Rajasthan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="site-shell">
        <section className="grid gap-5 lg:mt-2 lg:grid-cols-[0.82fr_1.18fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black uppercase tracking-[0.14em] text-red-900 ring-1 ring-amber-100">
              <Sparkles size={14} />
              Quick topics
            </span>
            <h2 className="mt-4 text-2xl font-black text-slate-950">What do you need help with?</h2>
            <div className="mt-4 grid gap-2">
              {quickTopics.map((topic) => {
                const isSelected = selectedTopic === topic;

                return (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setSelectedTopic(topic)}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-black transition ${
                      isSelected
                        ? 'bg-red-900 text-white shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-amber-50 hover:text-red-900'
                    }`}
                  >
                    {topic}
                    <ArrowRight size={16} />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <span className="text-xs font-black uppercase tracking-[0.16em] text-red-800">Send message</span>
              <h2 className="mt-1 text-2xl font-black text-slate-950">Tell us what you need</h2>
              <p className="mt-1 text-sm font-semibold text-slate-500">
                Selected topic: <span className="text-red-900">{selectedTopic}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
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
                className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-red-900 focus:outline-none focus:ring-4 focus:ring-amber-100"
              >
                Send Message
                <Send size={17} />
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
