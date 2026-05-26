import React from 'react';
import { Plus, Eye, MousePointerClick, IndianRupee } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';

const AdsManagement = () => {
  const { ads, toggleAdStatus, createAd } = useGlobalContext();

  const handleCreateAd = () => {
    const newAd = {
      id: `A00${ads.length + 1}`,
      title: 'New Sponsored Listing',
      type: 'Category Banner',
      location: 'Event',
      status: 'Paused',
      clicks: 0,
      impressions: 0,
      revenue: 0,
      categoryLabel: "Custom Ad",
      phone: "000 000 000",
      mainImage: "https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=800",
      img1: "https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=800",
      img2: "https://images.unsplash.com/photo-1542314831-c53cd3816002?q=80&w=800",
      brandColor: "#000000",
      textColor: "#333333"
    };
    createAd(newAd);
  };

  return (
    <div>
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Ads Control Panel</h1>
          <p className="text-slate-500 mt-1">Manage platform advertisements, banners, and sponsored listings.</p>
        </div>
        
        <button 
          onClick={handleCreateAd}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={18} />
          Create New Ad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ads.map((ad) => (
          <div key={ad.id} className={`bg-white rounded-xl border p-6 shadow-sm flex flex-col transition-colors ${ad.status === 'Paused' ? 'border-dashed border-slate-300 opacity-80' : 'border-slate-200'}`}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded mb-2 uppercase tracking-wider">
                  {ad.type}
                </span>
                <h3 className="text-lg font-bold text-slate-900">{ad.title}</h3>
                <p className="text-sm text-slate-500 mt-0.5">Location: {ad.location}</p>
              </div>
              <div className="flex items-center">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={ad.status === 'Active'} 
                    onChange={() => toggleAdStatus(ad.id)} 
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                </label>
              </div>
            </div>

            <div className="mt-auto grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
              <div>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <Eye size={14} /> Impressions
                </p>
                <p className="text-lg font-bold text-slate-800">{ad.impressions.toLocaleString()}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <MousePointerClick size={14} /> Clicks
                </p>
                <p className="text-lg font-bold text-slate-800">{ad.clicks.toLocaleString()}</p>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <IndianRupee size={14} /> Revenue
                </p>
                <p className="text-lg font-bold text-emerald-600">₹{ad.revenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdsManagement;
