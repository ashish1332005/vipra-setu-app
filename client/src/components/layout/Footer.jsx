import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Mail,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';

const FOOTER_LINKS = [
  {
    title: 'Explore',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Services', to: '/services' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Services',
    links: [
      { label: 'Home Services', to: '/category/Household%20Services' },
      { label: 'Education', to: '/category/Education' },
      { label: 'Events', to: '/category/Event%20Services' },
      { label: 'Business', to: '/services' },
    ],
  },
  {
    title: 'Community',
    links: [
      { label: 'Dharma', to: '/about' },
      { label: 'Seva', to: '/services' },
      { label: 'Samaj', to: '/about' },
      { label: 'Join Us', to: '/login' },
    ],
  },
];

const CONTACT_LINKS = [
  {
    label: 'Call',
    value: '+91 94628 74574',
    href: 'tel:+919462874574',
    icon: Phone,
  },
  {
    label: 'Email',
    value: 'support@viprasevasetu.com',
    href: 'mailto:support@viprasevasetu.com',
    icon: Mail,
  },
  {
    label: 'WhatsApp',
    value: 'Chat with us',
    href: 'https://wa.me/919462874574',
    icon: MessageCircle,
  },
];

const Footer = () => {
  return (
    <footer role="contentinfo" aria-label="Site footer" className="border-t border-slate-800 bg-slate-950 text-slate-100">
      <div className="site-shell py-12">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="space-y-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-sky-500 text-white shadow-lg shadow-sky-500/20">
                <ShieldCheck size={24} />
              </div>
              <div className="max-w-xl">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-sky-300">
                  Vipra Sena · BPF · Vipra Sewa Setu
                </p>
                <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                  A unified platform for social service, employment, and community growth.
                </h2>
              </div>
            </div>

            <p className="max-w-lg text-sm leading-7 text-slate-300">
              Create your account and connect with opportunities, services, and social support — all in one platform.
            </p>

            <div className="grid gap-3 sm:grid-cols-3">
              {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex min-w-0 items-center gap-3 rounded-3xl border border-slate-800/80 bg-slate-900/70 px-4 py-4 transition hover:border-slate-700 hover:bg-slate-900"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-3xl bg-sky-500 text-white">
                    <Icon size={20} />
                  </span>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-slate-500">
                      {label}
                    </span>
                    <span className="mt-1 block truncate text-sm font-black text-slate-100">
                      {value}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-3">
            {FOOTER_LINKS.map(({ title, links }) => (
              <nav key={title} aria-label={`${title} links`}>
                <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-100/90">{title}</h4>
                <ul className="mt-4 space-y-3 text-sm text-slate-400">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="inline-flex items-center gap-2 font-semibold transition-colors hover:text-sky-300"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight size={13} className="opacity-0 transition-opacity group-hover:opacity-100" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 border-t border-slate-800/80 pt-6 text-sm text-slate-500 md:flex md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Vipra Seva Setu. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="transition-colors hover:text-sky-300">
              Privacy
            </a>
            <a href="#" className="transition-colors hover:text-sky-300">
              Terms
            </a>
            <a href="#" className="transition-colors hover:text-sky-300">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
