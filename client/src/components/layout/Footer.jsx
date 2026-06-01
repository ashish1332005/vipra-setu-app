import { Link } from 'react-router-dom';
import {
  BriefcaseBusiness,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';

import logo from '../../assets/logo.jpeg';

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
];

const CONTACT_LINKS = [
  {
    label: 'Call',
    value: '+91 94628 74574',
    href: 'tel:+919462874574',
    icon: Phone,
  },
  {
    label: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://wa.me/919462874574',
    icon: MessageCircle,
  },
  {
    label: 'Email',
    value: 'support@viprasevasetu.com',
    href: 'mailto:support@viprasevasetu.com',
    icon: Mail,
  },
];

const Footer = () => {
  return (
    <footer role="contentinfo" aria-label="Site footer" className="border-t border-slate-800 bg-slate-950 text-slate-100">
      <div className="site-shell pb-36 pt-9 lg:pb-9">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <img src={logo} alt="Vipra Sewa Setu" className="h-12 w-12 rounded-2xl object-cover ring-1 ring-white/10" />
              <div>
                <p className="text-lg font-black leading-tight">Vipra Sewa Setu</p>
                <p className="text-[11px] font-black uppercase tracking-[0.14em] text-amber-300">Service | Community | Trust</p>
              </div>
            </div>
            <h2 className="mt-5 text-2xl font-black leading-tight sm:text-3xl">
              A simple, trusted service platform for the community.
            </h2>
            <p className="mt-3 text-sm font-semibold leading-7 text-slate-400">
              Search verified local providers, send requests, and track your work easily.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:w-[420px]">
            <Link
              to="/services"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-300/40 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-300 text-red-950">
                <BriefcaseBusiness size={19} />
              </span>
              <span>
                <span className="block text-sm font-black text-white">View Services</span>
                <span className="text-xs font-semibold text-slate-400">Open categories</span>
              </span>
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-amber-300/40 hover:bg-white/10"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-900 text-amber-200">
                <ShieldCheck size={19} />
              </span>
              <span>
                <span className="block text-sm font-black text-white">Join Now</span>
                <span className="text-xs font-semibold text-slate-400">Create member account</span>
              </span>
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-5 border-t border-white/10 pt-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="flex flex-wrap gap-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-xl bg-white/5 px-3 py-2 text-sm font-bold text-slate-300 transition hover:bg-white/10 hover:text-amber-200"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="grid gap-2 sm:grid-cols-3">
            {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="flex min-w-0 items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm transition hover:bg-white/10"
              >
                <Icon size={16} className="shrink-0 text-amber-300" />
                <span className="truncate font-bold text-slate-300">{value}</span>
              </a>
            ))}
          </div>
        </div>

        <p className="mt-6 text-xs font-semibold text-slate-500">
          (c) {new Date().getFullYear()} Vipra Sewa Setu. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
