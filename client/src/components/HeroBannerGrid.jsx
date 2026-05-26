import { ChevronRight } from 'lucide-react';

const PROMO_CARDS = [
  {
    id: 1,
    title: 'B2B',
    subtitle: 'Quick Quotes',
    color: 'bg-blue-600',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 2,
    title: 'REPAIRS & SERVICES',
    subtitle: 'Get Nearest Vendor',
    color: 'bg-indigo-700',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 3,
    title: 'REAL ESTATE',
    subtitle: 'Finest Agents',
    color: 'bg-violet-600',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=300&auto=format&fit=crop'
  },
  {
    id: 4,
    title: 'DOCTORS',
    subtitle: 'Book Now',
    color: 'bg-emerald-600',
    image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?q=80&w=300&auto=format&fit=crop'
  }
];

const HeroBannerGrid = () => {
  return (
    <div className="grid h-full grid-cols-2 gap-3 md:grid-cols-4">
      {PROMO_CARDS.map((card) => (
        <div key={card.id} className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl ${card.color} transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg`}>
          <div className="p-4 z-10 relative">
            <h3 className="font-heading text-lg font-bold leading-tight text-white">{card.title}</h3>
            <p className="mt-1 text-sm text-white/90">{card.subtitle}</p>
          </div>
          
          <div className="mt-auto h-3/5 w-full relative z-0">
            <img 
              src={card.image} 
              alt={card.title} 
              className="absolute inset-0 h-full w-full object-cover object-top opacity-90 transition-opacity group-hover:opacity-100"
            />
            {/* Gradient to smooth image transition */}
            <div className={`absolute inset-0 bg-gradient-to-t ${card.color} from-transparent to-100% opacity-50`}></div>
          </div>

          <button className="absolute bottom-3 left-3 z-20 flex h-7 w-7 items-center justify-center rounded bg-black/30 text-white backdrop-blur-sm transition-colors group-hover:bg-black/50">
            <ChevronRight size={16} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default HeroBannerGrid;
