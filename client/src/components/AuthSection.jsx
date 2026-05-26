import { useState } from 'react';
import { motion } from 'framer-motion';

const inputClassName =
  'w-full rounded-xl border border-primary/10 bg-white/60 px-4 py-3 outline-none transition-all placeholder:text-stone-400 focus:border-secondary focus:bg-white/90 focus:ring-2 focus:ring-secondary/30 backdrop-blur-sm shadow-inner';

const AuthSection = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(248,241,231,0.18),transparent_28%),linear-gradient(135deg,#5B121D_0%,#8B1E2D_42%,#B5525C_72%,#D4A373_100%)] px-4 py-24">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 left-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary/30 blur-[120px]"></div>
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/3 translate-y-1/3 rounded-full bg-primary-700/40 blur-[100px]"></div>

      <div className="container relative mx-auto flex flex-col items-center justify-center gap-16 md:flex-row">
        
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-light md:w-1/2 md:text-left"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 font-heading text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl"
          >
            Find the Best <br />
            <span className="text-secondary drop-shadow-md">Service Workers</span> <br />
            in Your City
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8 max-w-lg text-lg text-light/90 md:text-xl font-light"
          >
            Connect instantly with top-rated professionals for your household, events, educational needs, and more.
          </motion.p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="w-full max-w-md rounded-3xl border border-white/30 bg-white/10 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.2)] backdrop-blur-xl relative"
        >
          {/* Subtle inner border glow */}
          <div className="absolute inset-0 rounded-3xl border border-white/20 mix-blend-overlay pointer-events-none"></div>

          <h2 className="mb-6 text-center font-heading text-3xl font-bold text-white drop-shadow-sm">
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>

          <form className="relative z-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
            {!isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="mb-1.5 block text-sm font-medium text-white/90 drop-shadow-sm">Full Name</label>
                <input type="text" placeholder="Enter your name" className={inputClassName} />
              </motion.div>
            )}

            <div>
              <label className="mb-1.5 block text-sm font-medium text-white/90 drop-shadow-sm">Mobile No.</label>
              <input type="tel" placeholder="Enter 10-digit mobile number" className={inputClassName} />
            </div>

            {isLogin && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <label className="mb-1.5 block text-sm font-medium text-white/90 drop-shadow-sm">Password</label>
                <input type="password" placeholder="Enter your password" className={inputClassName} />
              </motion.div>
            )}

            <button className="mt-4 w-full rounded-xl bg-gradient-to-r from-secondary to-amber-500 py-3.5 font-bold text-ink shadow-[0_4px_14px_rgba(212,163,115,0.4)] transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_6px_20px_rgba(212,163,115,0.6)] active:scale-[0.98]">
              {isLogin ? 'Sign In' : 'Sign Up'}
            </button>
          </form>

          <div className="relative z-10 mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-sm font-medium text-white/80 transition-colors hover:text-white underline-offset-4 hover:underline"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AuthSection;
