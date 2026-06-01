import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, ShieldCheck, Sparkles, Star } from 'lucide-react';

import heroSlideOne from '../assets/hero-slide-1.jpg';
import heroSlideTwo from '../assets/hero-slide-2.jpg';
import heroSlideThree from '../assets/hero-slide-3.jpg';

const SLIDES = [
  {
    id: 1,
    title: 'Trusted seva, modern experience',
    text: 'Household, events, education, health, property, hospitality, and business support in one premium app.',
    image: heroSlideOne,
  },
  {
    id: 2,
    title: 'Culture-led community support',
    text: 'Built around dharma, seva, social trust, and practical help for everyday family needs.',
    image: heroSlideTwo,
  },
  {
    id: 3,
    title: 'Grow with verified connections',
    text: 'Providers can build visibility, earn better, and serve families with professional confidence.',
    image: heroSlideThree,
  },
];

const HERO_BADGES = [
  { icon: ShieldCheck, label: 'Verified' },
  { icon: Sparkles, label: 'Creative' },
  { icon: Star, label: 'Trusted' },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrent((prev) => (prev === 0 ? SLIDES.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrent((prev) => (prev === SLIDES.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="relative overflow-hidden rounded-[1.5rem] border border-amber-200/25 bg-white/10 p-1 shadow-[0_22px_60px_rgba(15,23,42,0.24)] backdrop-blur sm:rounded-[1.75rem] sm:p-2 lg:shadow-[0_34px_90px_rgba(15,23,42,0.35)]">
      <div className="relative min-h-[330px] overflow-hidden rounded-[1.3rem] bg-slate-950 sm:min-h-[520px] sm:rounded-[1.35rem]">
        <div className="culture-pattern absolute inset-0 z-10 opacity-35" />
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === current
                ? 'opacity-100 scale-100'
                : 'pointer-events-none opacity-0 scale-105'
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(251,191,36,0.2),transparent_32%),linear-gradient(180deg,rgba(15,23,42,0.05)_0%,rgba(67,20,7,0.18)_36%,rgba(15,23,42,0.9)_100%)]" />
          </div>
        ))}

        <div className="shine-sweep absolute left-3 top-3 z-20 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/18 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur sm:left-6 sm:top-6 sm:text-xs sm:tracking-[0.16em]">
          <MapPin size={15} />
          Bhilwara Network
        </div>

        <div className="absolute right-3 top-16 z-20 grid gap-2 sm:right-6 sm:top-6">
          {HERO_BADGES.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 rounded-full border border-white/15 bg-slate-950/38 px-3 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white backdrop-blur"
            >
              <Icon size={13} className="text-amber-200" />
              {label}
            </div>
          ))}
        </div>

        <div className="absolute bottom-12 left-3 right-3 z-20 sm:bottom-20 sm:left-6 sm:right-6">
          <div className="max-w-xl">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-300 px-3 py-1 text-[11px] font-black text-red-950 shadow-sm sm:mb-4 sm:text-xs">
              <Star size={14} className="fill-current" />
              4.9 community trust score
            </div>
            <h2 className="text-[1.75rem] font-black leading-tight text-white sm:text-4xl">
              {SLIDES[current].title}
            </h2>
            <p className="mt-1.5 max-w-lg text-xs font-semibold leading-5 text-white/82 sm:mt-3 sm:text-base sm:leading-7">
              {SLIDES[current].text}
            </p>
          </div>
        </div>

        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/25 bg-slate-950/35 text-white backdrop-blur-md transition hover:bg-slate-950/60 md:flex"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-xl border border-white/25 bg-slate-950/35 text-white backdrop-blur-md transition hover:bg-slate-950/60 md:flex"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        <div className="absolute bottom-3 left-3 z-20 flex items-center gap-2 rounded-full bg-white/16 px-3 py-2 backdrop-blur-md sm:bottom-5 sm:left-6">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                index === current
                  ? 'w-8 bg-amber-300'
                  : 'w-2.5 bg-white/55 hover:bg-white'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroCarousel;
