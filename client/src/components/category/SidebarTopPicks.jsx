import { Star, Phone, MessageSquare, ThumbsUp } from 'lucide-react';

const SidebarTopPicks = ({ categoryName }) => {
  const topPicks = [
    { id: 1, name: 'Royal Service', rating: 4.3, reviews: 82, location: 'Kurla West', image: 'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=400&q=80' },
    { id: 2, name: 'Akshay Experts', rating: 4.1, reviews: 72, location: 'Andheri East', image: 'https://images.unsplash.com/photo-1551882547-ff40c0d129df?w=400&q=80' },
    { id: 3, name: 'Sai Solutions', rating: 4.2, reviews: 172, location: 'Sakinaka', image: 'https://images.unsplash.com/photo-1560067174-c5a3a8f37060?w=400&q=80' },
    { id: 4, name: 'Amazing Care', rating: 4.1, reviews: 72, location: 'Andheri East', image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&q=80' },
  ];

  return (
    <div className="mt-6">
      <h3 className="text-xl font-bold text-slate-900">Customers "Top Picks"</h3>
      <p className="mt-1 text-sm font-medium text-slate-800 mb-4">{categoryName} in Bhilwara</p>

      <div className="grid grid-cols-2 gap-3">
        {topPicks.map((pick) => (
          <div key={pick.id} className="flex flex-col">
            <div className="relative h-28 w-full overflow-hidden rounded-lg">
              <img src={pick.image} alt={pick.name} className="h-full w-full object-cover" />
            </div>
            
            <div className="mt-2 flex-1">
              <div className="flex items-center gap-1.5">
                <div className="flex h-4 w-4 items-center justify-center rounded-full bg-slate-800 text-white">
                  <ThumbsUp size={8} className="fill-current" />
                </div>
                <h4 className="truncate text-sm font-bold text-slate-900">{pick.name}</h4>
              </div>
              
              <div className="mt-1 flex items-center gap-1 text-xs">
                <span className="font-bold text-slate-900">{pick.rating}</span>
                <Star size={10} className="fill-orange-500 text-orange-500" />
                <span className="text-slate-500">{pick.reviews} Ratings</span>
              </div>
              
              <p className="mt-0.5 text-xs text-slate-600 truncate">{pick.location}</p>
            </div>

            <div className="mt-3 flex flex-col gap-1.5">
              <button className="flex items-center justify-center gap-1.5 rounded bg-green-600 py-1.5 text-xs font-bold text-white transition-colors hover:bg-green-700">
                <Phone size={12} className="fill-current" />
                Call Now
              </button>
              <button className="flex items-center justify-center gap-1.5 rounded border border-slate-300 bg-white py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50">
                <MessageSquare size={12} className="text-green-600" />
                WhatsApp
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SidebarTopPicks;
