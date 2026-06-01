import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
} from 'lucide-react';

import logo from '../assets/logo.jpeg';
import parshuramHero from '../assets/parshuram-hero.png';
import { useGlobalContext } from '../context/GlobalContext';

const TRUST_ITEMS = [
  'Verified member access',
  'Provider and service dashboards',
  'Saved requests and leads',
];

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'service_taker',
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, register, verifyEmail, resendVerification, authLoading, authError } = useGlobalContext();
  const hasVerifiedLink = useRef(false);

  const navigateByRole = useCallback((user) => {
    if (user.role === 'admin') navigate('/admin', { replace: true });
    else navigate('/', { replace: true });
  }, [navigate]);

  useEffect(() => {
    if (searchParams.get('mode') === 'signup') {
      setIsLogin(false);
    }

    const token = searchParams.get('verifyToken');
    if (!token || hasVerifiedLink.current) return;

    hasVerifiedLink.current = true;
    setMessage('Verifying your email...');

    verifyEmail(token)
      .then((user) => {
        setMessage('Email verified successfully.');
        navigateByRole(user);
      })
      .catch((error) => {
        setMessage(error.message);
      });
  }, [navigateByRole, searchParams, verifyEmail]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const user = isLogin ? await login(formData) : await register(formData);
      navigateByRole(user);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleVerifyFromLink = async () => {
    const token = searchParams.get('verifyToken');
    if (!token) {
      setMessage('Verification token not found in URL.');
      return;
    }

    try {
      const user = await verifyEmail(token);
      setMessage('Email verified successfully.');
      navigateByRole(user);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleResend = async () => {
    if (!formData.email) {
      setMessage('Enter your email first, then resend verification.');
      return;
    }

    try {
      const data = await resendVerification(formData.email);
      setMessage(data.verificationToken ? `Verification sent. Dev token: ${data.verificationToken}` : data.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 pl-11 text-sm font-semibold text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:py-3.5';

  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#fff7ed_0%,#ffffff_42%,#eef6ff_100%)] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,0.75fr)]">
        <section className="relative hidden overflow-hidden bg-slate-950 text-white lg:block">
          <img
            src={parshuramHero}
            alt="Vipra Seva Setu"
            className="absolute inset-0 h-full w-full object-cover object-top opacity-80"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.92)_0%,rgba(67,20,7,0.78)_50%,rgba(67,20,7,0.3)_100%)]" />

          <div className="relative flex min-h-screen flex-col justify-between p-10 xl:p-14">
            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur transition hover:bg-white/15"
            >
              <ArrowLeft size={17} />
              Back to home
            </Link>

            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 p-2 pr-5 backdrop-blur-md">
                <img src={logo} alt="Vipra Seva Setu logo" className="h-12 w-12 rounded-xl object-cover" />
                <span>
                  <span className="block text-lg font-black leading-tight">Vipra Seva Setu</span>
                  <span className="block text-xs font-bold uppercase tracking-[0.2em] text-amber-200">
                    Premium member access
                  </span>
                </span>
              </div>

              <h1 className="mt-8 max-w-xl text-5xl font-black leading-tight tracking-tight xl:text-6xl">
                Create your profile to enter the app.
              </h1>
              <p className="mt-5 max-w-lg text-base font-semibold leading-8 text-white/78">
                Account setup keeps requests, providers, leads, and dashboard access connected to one trusted member profile.
              </p>

              <div className="mt-8 grid max-w-xl gap-3">
                {TRUST_ITEMS.map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-xl border border-white/12 bg-white/10 px-4 py-3 backdrop-blur">
                    <CheckCircle2 size={19} className="text-emerald-300" />
                    <span className="text-sm font-bold text-white/88">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm font-bold text-white/70">
              <ShieldCheck size={18} className="text-amber-200" />
              Dharma | Seva | Samaj
            </div>
          </div>
        </section>

        <section className="flex min-h-screen flex-col bg-[linear-gradient(180deg,#fff7ed_0%,#ffffff_42%,#f8fafc_100%)] px-4 pb-5 sm:px-6 lg:bg-transparent lg:px-8 lg:py-5">
          <div className="relative -mx-4 overflow-hidden rounded-b-[2rem] bg-slate-950 px-4 pb-20 pt-5 text-white shadow-[0_24px_70px_rgba(15,23,42,0.25)] sm:-mx-6 sm:px-6 lg:hidden">
            <img
              src={parshuramHero}
              alt="Vipra Seva Setu"
              className="absolute inset-0 h-full w-full object-cover object-top opacity-70"
            />
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.94)_0%,rgba(67,20,7,0.82)_54%,rgba(15,23,42,0.5)_100%)]" />

            <div className="relative flex items-center justify-between gap-3">
              <Link
                to="/"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/15"
                aria-label="Back to home"
              >
                <ArrowLeft size={18} />
              </Link>

              <Link to="/" className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/12 py-1.5 pl-1.5 pr-3 backdrop-blur">
                <img src={logo} alt="Vipra Seva Setu logo" className="h-9 w-9 rounded-full object-cover shadow-sm" />
                <span>
                  <span className="block text-sm font-black leading-tight">Vipra Seva Setu</span>
                  <span className="block text-[9px] font-black uppercase tracking-[0.16em] text-amber-200">
                    Member Access
                  </span>
                </span>
              </Link>
            </div>

            <div className="relative mt-8 max-w-sm">
              <p className="inline-flex rounded-full bg-amber-300 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-red-950">
                Premium community app
              </p>
              <h1 className="mt-3 text-3xl font-black leading-tight">
                Create your account first.
              </h1>
              <p className="mt-3 text-sm font-semibold leading-6 text-white/78">
                Complete member setup to access services, requests, leads, and trusted local connections.
              </p>
            </div>
          </div>

          <div className="flex flex-1 items-start justify-center pb-4 pt-0 lg:items-center lg:py-7">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 -mt-14 w-full max-w-md lg:mt-0"
            >
              <div className="rounded-[1.35rem] border border-white/70 bg-white/95 p-4 shadow-[0_24px_80px_rgba(15,23,42,0.16)] backdrop-blur-xl sm:p-6 lg:rounded-[1.5rem] lg:border-slate-200 lg:bg-white lg:shadow-[0_24px_80px_rgba(15,23,42,0.1)]">
                <div className="mb-6 hidden items-center gap-3 lg:flex">
                  <img src={logo} alt="Vipra Seva Setu logo" className="h-12 w-12 rounded-xl object-cover shadow-sm" />
                  <div>
                    <p className="text-lg font-black leading-tight text-slate-950">Vipra Seva Setu</p>
                    <p className="text-[11px] font-black uppercase tracking-[0.18em] text-amber-700">
                      Member access
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage('');
                      setIsLogin(false);
                    }}
                    className={`rounded-lg px-3 py-2.5 text-sm font-black transition sm:py-3 ${
                      !isLogin ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    Create Account
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMessage('');
                      setIsLogin(true);
                    }}
                    className={`rounded-lg px-3 py-2.5 text-sm font-black transition sm:py-3 ${
                      isLogin ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-950'
                    }`}
                  >
                    Login
                  </button>
                </div>

                <div className="mt-5 sm:mt-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-amber-800">
                    <Sparkles size={14} />
                    {isLogin ? 'Welcome back' : 'Start here'}
                  </div>
                  <h2 className="mt-3 text-[1.65rem] font-black leading-tight text-slate-950 sm:text-3xl">
                    {isLogin ? 'Login to your dashboard' : 'Create your member profile'}
                  </h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-500">
                    {isLogin
                      ? 'Continue managing requests, leads, and service activity.'
                      : 'Complete this step first to enter the professional app experience.'}
                  </p>
                </div>

                <form className="mt-5 space-y-3.5 sm:mt-6 sm:space-y-4" onSubmit={handleSubmit}>
                  {searchParams.get('verifyToken') && (
                    <button
                      type="button"
                      onClick={handleVerifyFromLink}
                      className="w-full rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700"
                    >
                      Verify Email From Link
                    </button>
                  )}

                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                      <label className="mb-2 block text-sm font-bold text-slate-700">Full Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-700" />
                        <input
                          name="name"
                          type="text"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required={!isLogin}
                          className={inputClass}
                        />
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Email</label>
                    <div className="relative">
                      <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-700" />
                      <input
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {!isLogin && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-4">
                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Mobile Number</label>
                        <div className="relative">
                          <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-700" />
                          <input
                            name="phone"
                            type="tel"
                            placeholder="Enter mobile number"
                            value={formData.phone}
                            onChange={handleChange}
                            required={!isLogin}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-bold text-slate-700">Account Type</label>
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                        >
                          <option value="service_taker">Service Taker</option>
                          <option value="service_provider">Service Provider</option>
                        </select>
                      </div>
                    </motion.div>
                  )}

                  <div>
                    <label className="mb-2 block text-sm font-bold text-slate-700">Password</label>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-sky-700" />
                      <input
                        name="password"
                        type="password"
                        placeholder="Enter password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {(message || authError) && (
                    <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">
                      {message || authError}
                    </p>
                  )}

                  <button
                    disabled={authLoading}
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-5 py-3.5 text-sm font-black text-white shadow-[0_16px_40px_rgba(14,165,233,0.24)] transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {authLoading ? 'Please wait...' : isLogin ? 'Login Now' : 'Create Account'}
                    <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setMessage('');
                      setIsLogin(!isLogin);
                    }}
                    className="text-sm font-bold text-slate-500 transition hover:text-sky-700"
                  >
                    {isLogin ? "Don't have an account? Create one" : 'Already have an account? Login'}
                  </button>
                  <button
                    type="button"
                    onClick={handleResend}
                    className="mt-3 block w-full text-xs font-bold text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-sky-700"
                  >
                    Resend email verification
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default LoginPage;
