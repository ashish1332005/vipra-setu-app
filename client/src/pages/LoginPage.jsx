import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex min-h-screen bg-surface-light">
      
      {/* Left Form Section */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-24 xl:px-32 relative z-10">
        
        <Link to="/" className="absolute top-8 left-8 flex items-center text-sm font-medium text-slate-500 hover:text-brand-600 transition-colors">
          <ArrowLeft size={16} className="mr-2" /> Back to home
        </Link>

        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-sm mx-auto"
        >
          <div className="mb-10 text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-heading font-extrabold tracking-tight mb-8">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-white">
                <Sparkles size={18} />
              </div>
              <span className="text-ink">Service<span className="text-brand-600">Hub</span></span>
            </Link>
            
            <h1 className="text-3xl font-heading font-bold text-ink">
              {isLogin ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="mt-2 text-slate-500">
              {isLogin ? 'Please enter your details to sign in.' : 'Start finding top professionals today.'}
            </p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">Full Name</label>
                <input 
                  type="text" 
                  placeholder="Enter your name" 
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" 
                />
              </motion.div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">Mobile No.</label>
              <input 
                type="tel" 
                placeholder="Enter 10-digit mobile number" 
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" 
              />
            </div>

            {isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="block text-sm font-medium text-slate-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-brand-600 hover:text-brand-700">Forgot password?</a>
                </div>
                <input 
                  type="password" 
                  placeholder="Enter your password" 
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20" 
                />
              </motion.div>
            )}

            <button className="mt-6 w-full rounded-xl bg-brand-600 py-3.5 font-bold text-white shadow-lg shadow-brand-500/30 transition-transform hover:scale-[1.02] active:scale-[0.98]">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button 
                onClick={() => setIsLogin(!isLogin)} 
                className="font-semibold text-brand-600 hover:text-brand-700 transition-colors"
              >
                {isLogin ? "Sign up" : 'Log in'}
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Right Image Section */}
      <div className="hidden w-1/2 relative md:block">
        <div className="absolute inset-0 bg-brand-900 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=1200&auto=format&fit=crop" 
            alt="Professionals" 
            className="absolute inset-0 h-full w-full object-cover object-center opacity-40 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900 to-transparent"></div>
          
          <div className="absolute bottom-16 left-16 right-16">
            <h2 className="font-heading text-4xl font-bold text-white leading-tight mb-4">
              "The best platform for finding reliable, vetted professionals instantly."
            </h2>
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center font-bold text-brand-900 text-xl">
                J
              </div>
              <div>
                <p className="font-bold text-white">Jessica Wong</p>
                <p className="text-brand-200 text-sm">Property Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;
