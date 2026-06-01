import { motion } from 'framer-motion';

const ADS = [
  'Verified local service providers for every family need',
  'Community support, employment, and business visibility in one place',
  'Book home repair, events, education, health, property, and hospitality help',
  'Built on Dharma, Seva, and Samaj values',
  'Trusted Bhilwara network with fast discovery and clear categories',
];

const AdsRail = () => {
  return (
    <div className="relative z-20 flex overflow-hidden whitespace-nowrap bg-slate-950 py-2.5 text-amber-100 shadow-inner sm:py-3">
      <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-8 bg-gradient-to-r from-slate-950 to-transparent sm:w-12" />
      <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-8 bg-gradient-to-l from-slate-950 to-transparent sm:w-12" />

      <motion.div
        className="flex min-w-full cursor-default gap-8 sm:gap-12"
        animate={{ x: ['0%', '-50%'] }}
        transition={{ repeat: Infinity, ease: 'linear', duration: 28 }}
      >
        {[...ADS, ...ADS].map((ad, index) => (
          <span
            key={index}
            className="flex shrink-0 items-center gap-2 text-xs font-black tracking-wide sm:gap-3 sm:text-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-amber-300 sm:h-2 sm:w-2" />
            {ad}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AdsRail;
