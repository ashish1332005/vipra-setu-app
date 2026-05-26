import { motion } from 'framer-motion';

const ADS = [
  '⚡ FLASH SALE: 20% off all deep cleaning services this weekend only!',
  '🌟 Top Rated Event Planners available for Winter bookings.',
  '💼 Commercial Property Management starting at $199/mo.',
  '🎓 Ivy League tutors now accepting new students.',
  '✅ Fully vetted and verified professionals guaranteed.',
];

const AdsRail = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap bg-indigo-600 py-3 text-white shadow-inner flex relative">
      {/* Soft gradient edges to mask the scrolling text */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-indigo-600 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-indigo-600 to-transparent z-10 pointer-events-none"></div>

      <motion.div 
        className="flex min-w-full gap-16 cursor-default"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {/* We double the array so the infinite scroll loops seamlessly */}
        {[...ADS, ...ADS].map((ad, index) => (
          <span key={index} className="text-sm font-semibold tracking-wide flex-shrink-0 flex items-center">
            {ad}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default AdsRail;
