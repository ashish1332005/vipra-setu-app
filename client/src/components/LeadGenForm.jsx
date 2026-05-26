import { useState } from 'react';
import { Flame, ShieldCheck, Users, ArrowRight } from 'lucide-react';
import parshuramHero from '../assets/parshuram-hero.png';

const LeadGenForm = () => {
  const [isLogin, setIsLogin] = useState(false);

  const inputStyle =
    'w-full rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-amber-500 focus:bg-white focus:ring-4 focus:ring-amber-500/10';

  return (
    <section className="relative overflow-hidden rounded-[30px] border border-amber-200/50 bg-white p-3 shadow-[0_24px_70px_rgba(120,53,15,0.12)] sm:p-4 lg:p-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.28),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(127,29,29,0.18),transparent_35%)]" />

      <div className="relative grid overflow-hidden rounded-[28px] bg-gradient-to-br from-[#34110d] via-[#7f1d1d] to-[#111827] lg:grid-cols-[1.15fr_430px]">
        
        {/* LEFT CONTENT */}
        <div className="relative p-7 text-white sm:p-10 lg:p-12">
          <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-700/20 blur-3xl" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_280px] lg:items-end">
            <div>
              <span className="inline-flex rounded-full border border-amber-200/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] text-amber-100 backdrop-blur">
                Vipra Seva Setu
              </span>

              <h1 className="mt-6 max-w-2xl text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Sanskriti, Seva aur Samaj ko jodne wala digital platform.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-8 text-amber-50/85 sm:text-lg">
                Apne samaj ke verified professionals, seva providers aur local support ko ek trusted modern platform par connect karein.
              </p>

              <div className="mt-7 inline-flex items-center gap-3 rounded-2xl border border-amber-200/25 bg-white/10 px-5 py-3 text-sm font-bold text-amber-50 backdrop-blur">
                <Flame size={18} />
                समाज को जोड़ने वाला विश्वसनीय डिजिटल मंच
              </div>

              <div className="mt-8 grid gap-3 sm:max-w-xl">
                {[
                  [ShieldCheck, 'Verified Community Professionals'],
                  [Flame, 'Culture-rooted Service Network'],
                  [Users, 'Built for Samaj Connection'],
                ].map(([Icon, text]) => (
                  <div
                    key={text}
                    className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur"
                  >
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/15 text-amber-100">
                      <Icon size={20} />
                    </div>
                    <span className="text-sm font-semibold text-white/90">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative mx-auto w-full max-w-[260px] lg:max-w-none">
              <div className="absolute inset-x-8 bottom-3 h-28 rounded-full bg-amber-300/30 blur-3xl" />

              <div className="relative overflow-hidden rounded-[30px] border border-amber-100/25 bg-white/10 p-2 shadow-2xl backdrop-blur">
                <img
                  src={parshuramHero}
                  alt="Bhagwan Parshuram devotional artwork"
                  className="h-[300px] w-full rounded-[24px] object-cover object-top lg:h-[390px]"
                />
              </div>

              <div className="absolute -bottom-5 left-1/2 w-[90%] -translate-x-1/2 rounded-2xl border border-amber-200/30 bg-black/45 px-4 py-3 text-center text-xs font-extrabold tracking-wide text-amber-50 shadow-xl backdrop-blur">
                Dharma • Seva • Samaj
              </div>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="relative bg-white/95 p-6 sm:p-8 lg:p-10">
          <div className="mb-7">
            <p className="text-xs font-black uppercase tracking-[0.25em] text-amber-700">
              {isLogin ? 'Member Login' : 'Community Registration'}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              {isLogin
                ? 'Login to manage your services and profile.'
                : 'Join the trusted Vipra Seva Setu community.'}
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Full Name
                </label>
                <input type="text" placeholder="Enter your name" className={inputStyle} />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-700">
                Mobile No.
              </label>
              <input type="tel" placeholder="10-digit mobile number" className={inputStyle} />
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">Password</label>
                {isLogin && (
                  <button className="text-xs font-bold text-amber-700 hover:text-red-700">
                    Forgot password?
                  </button>
                )}
              </div>
              <input type="password" placeholder="Enter password" className={inputStyle} />
            </div>

            <button className="group mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-600 via-red-700 to-red-800 py-4 text-sm font-black text-white shadow-xl shadow-red-900/20 transition-all hover:-translate-y-0.5 hover:shadow-2xl">
              {isLogin ? 'Sign In' : 'Register Now'}
              <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <div className="mt-7 rounded-2xl bg-amber-50 px-4 py-4 text-center">
            <p className="text-sm text-slate-600">
              {isLogin ? "Don't have an account?" : 'Already registered?'}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 font-black text-red-700 hover:text-amber-700"
              >
                {isLogin ? 'Sign up' : 'Log in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LeadGenForm;
