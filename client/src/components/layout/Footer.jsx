import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import logo from '../../assets/logo.jpeg';

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
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="border-t border-slate-200 bg-[#f6f7f4] text-slate-700"
    >
      <div className="site-shell py-10 lg:pb-10">
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-5 border-b border-slate-200 bg-slate-950 p-6 text-white sm:p-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-400/12 text-emerald-200">
                <ShieldCheck size={24} />
              </span>
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                  Trusted community support
                </p>
                <h2 className="mt-2 text-2xl font-black leading-tight sm:text-3xl">
                  Need a service or want to list your work?
                </h2>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Vipra Seva Setu helps members connect with local services, providers, and community support.
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-slate-950 transition-colors hover:bg-emerald-50"
            >
              Contact team
              <ArrowRight size={17} />
            </Link>
          </div>

          <div className="grid gap-8 p-5 sm:p-8 lg:grid-cols-[1.25fr_1.45fr]">
            <div>
              <Link to="/" className="inline-flex items-center gap-3">
                <img
                  src={logo}
                  alt="Vipra Seva Setu Logo"
                  className="h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-2xl border border-slate-200 object-cover shadow-sm"
                />
                <span>
                  <span className="block text-2xl font-black leading-7 tracking-tight text-slate-950">
                    Vipra Seva Setu
                  </span>
                  <span className="mt-1 block text-xs font-extrabold uppercase tracking-[0.18em] text-emerald-700">
                    Dharma • Seva • Samaj
                  </span>
                </span>
              </Link>

              <p className="mt-5 max-w-md text-sm leading-6 text-slate-600">
                A local-first digital platform for services, employment, business visibility, and social support.
              </p>

              <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm">
                  <MapPin size={17} />
                </span>
                <p className="text-sm font-semibold leading-6 text-slate-600">
                  MATHS Point, Near Fumes Flames, RK Colony, Bhilwara, Rajasthan
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              {FOOTER_LINKS.map(({ title, links }) => (
                <nav key={title} aria-label={`${title} links`}>
                  <h4 className="text-sm font-black uppercase tracking-[0.18em] text-slate-950">
                    {title}
                  </h4>
                  <ul className="mt-4 space-y-3 text-sm text-slate-600">
                    {links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="group inline-flex items-center gap-2 font-semibold transition-colors hover:text-emerald-800"
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

          <div className="grid gap-3 border-t border-slate-200 bg-slate-50 p-5 sm:grid-cols-3 sm:p-6">
            {CONTACT_LINKS.map(({ label, value, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="w-full sm:w-auto flex min-w-0 items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm transition-colors hover:text-emerald-800"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[11px] font-black uppercase tracking-[0.16em] text-slate-400">
                    {label}
                  </span>
                  <span className="mt-0.5 block truncate text-sm font-black text-slate-800">
                    {value}
                  </span>
                </span>
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-4 border-t border-slate-200 px-5 py-5 text-xs text-slate-500 sm:px-8 md:flex-row md:items-center md:justify-between">
            <p>&copy; {new Date().getFullYear()} Vipra Seva Setu. All rights reserved.</p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="transition-colors hover:text-emerald-800">Privacy</a>
              <a href="#" className="transition-colors hover:text-emerald-800">Terms</a>
              <a href="#" className="transition-colors hover:text-emerald-800">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
