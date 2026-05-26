import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone } from 'lucide-react';

const FOOTER_LINKS = {
  Company: ['About Us', 'How It Works', 'Careers', 'Press'],
  Services: ['Home Services', 'Business Services', 'Education', 'Events'],
  Support: ['Help Center', 'Customer Care', 'Safety Tips', 'Contact Us'],
};

const Footer = () => {
  return (
    <footer
      role="contentinfo"
      aria-label="Site footer"
      className="relative overflow-hidden bg-slate-950 text-slate-200"
    >
      <div
        className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(249,115,22,0.16),transparent_28%)]"
        aria-hidden="true"
      />

      <div className="site-shell relative py-12 z-10">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-md">
            <Link to="/" className="inline-flex items-center text-3xl font-extrabold tracking-tight">
              <span className="rainbow-logo">Vipra Seva Setu</span>
            </Link>

            <p className="mt-4 text-sm leading-6 text-slate-300">
              A modern community service platform built to help people discover trusted experts, compare choices quickly, and connect with confidence.
            </p>

            <div className="mt-5 grid gap-3 text-sm text-slate-300">
              <p className="inline-flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-blue-300">
                  <Phone size={16} />
                </span>
                <a href="tel:+919462874574" className="hover:text-white">+91 94628 74574</a>
              </p>
              <p className="inline-flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/8 text-orange-300">
                  <Mail size={16} />
                </span>
                <a href="mailto:support@viprasevasetu.com" className="hover:text-white">support@viprasevasetu.com</a>
              </p>
              <p className="flex items-start gap-3">
                <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/8 text-emerald-300">
                  <MapPin size={16} />
                </span>
                <span>MATHS Point, Near Fumes Flames, RK Colony, Bhilwara, Rajasthan</span>
              </p>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <nav key={title} aria-label={`${title} links`}>
              <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-white">{title}</h4>
              <ul className="mt-4 space-y-2.5 text-sm text-slate-300">
                {links.map((link) => {
                  const to = `/${link.toLowerCase().replace(/\s+/g, '-')}`;
                  return (
                    <li key={link}>
                      <Link to={to} className="transition-colors hover:text-white">
                        {link}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-3 text-xs text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>&copy; {new Date().getFullYear()} Vipra Seva Setu. All rights reserved.</p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="transition-colors hover:text-slate-300">Privacy</a>
            <a href="#" className="transition-colors hover:text-slate-300">Terms</a>
            <a href="#" className="transition-colors hover:text-slate-300">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
