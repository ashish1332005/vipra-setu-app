import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    title: 'Vipra Seva Setu',
    subtitle: 'समाज, सेवा और रोजगार को जोड़ने वाला आधुनिक डिजिटल मंच',
    badge: 'COMMUNITY FIRST',
    image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400&auto=format&fit=crop',
    color: 'from-[#431407]/95 via-[#7f1d1d]/85'
  },
  {
    id: 2,
    title: 'Local services, trusted people',
    subtitle: 'Apply, order and connect with the right provider.',
    badge: 'START NOW',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=1400&auto=format&fit=crop',
    color: 'from-slate-950/95 via-blue-950/80'
  }
];

const HeroCarousel = ({ slides = SLIDES }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="group relative h-full w-full overflow-hidden bg-slate-900">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === current ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-72"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.color} to-transparent`}></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(251,191,36,0.2),transparent_26%)]"></div>
          <div className="site-shell absolute inset-0 flex flex-col justify-center">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-amber-100/30 bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.22em] text-amber-50 backdrop-blur">
                {slide.badge}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-white drop-shadow-md sm:text-4xl md:text-5xl lg:text-6xl">
                {slide.title}
              </h1>
              {slide.subtitle && (
                <p className="mt-4 max-w-2xl text-base font-semibold leading-7 text-amber-50 md:text-xl">
                  {slide.subtitle}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
      
      {/* Navigation Arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-white/40 group-hover:opacity-100 md:flex"
        aria-label="Previous slide"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full bg-white/20 p-2 text-white opacity-0 backdrop-blur-sm transition-all hover:bg-white/40 group-hover:opacity-100 md:flex"
        aria-label="Next slide"
      >
        <ChevronRight size={24} />
      </button>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 space-x-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-2 w-2 rounded-full transition-all ${
              index === current ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
