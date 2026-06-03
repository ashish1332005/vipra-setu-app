import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGlobalContext } from '../../context/GlobalContext';
import { adMatchesCategory, adMatchesPlacement } from '../../utils/adTargeting';
import { getMediaUrl } from '../../utils/media';

const CategoryBannerAd = ({ categoryName = '' }) => {
  const { ads } = useGlobalContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Only show active banner ads
  const activeAds = useMemo(
    () => ads.filter((ad) => {
      const matchesCategory = adMatchesCategory(ad.targetCategory, categoryName);
      const matchesPlacement = adMatchesPlacement(ad, 'category');

      return ad.status === 'Active' && ad.type === 'Category Banner' && matchesPlacement && matchesCategory;
    }),
    [ads, categoryName]
  );

  const nextAd = useCallback(() => {
    if (activeAds.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % activeAds.length);
    }
  }, [activeAds.length]);

  const prevAd = () => {
    if (activeAds.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + activeAds.length) % activeAds.length);
    }
  };

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (activeAds.length <= 1) return; // Don't scroll if only 1 ad
    const timer = setInterval(nextAd, 5000);
    return () => clearInterval(timer);
  }, [activeAds.length, nextAd]);

  if (activeAds.length === 0) {
    return null; // Don't render banner if no active ads
  }

  // Ensure index is within bounds if ads are removed
  const ad = activeAds[currentIndex % activeAds.length];
  const mainImage = getMediaUrl(ad.mainImage || ad.imageUrl);
  const sideImage = getMediaUrl(ad.img1 || ad.imageUrl);
  const secondSideImage = getMediaUrl(ad.img2 || ad.imageUrl);
  const brandColor = ad.brandColor || '#1d4ed8';
  const textColor = ad.textColor || '#334155';

  return (
    <div className="relative w-full bg-[#f8f6f0] border-b border-slate-200 overflow-hidden group">
      <div className="site-shell max-w-7xl mx-auto py-2 px-8 md:px-12">
        <div className="flex flex-col md:flex-row items-stretch justify-between bg-white overflow-hidden shadow-sm border border-slate-200 rounded-sm relative">
          
          {/* Left Exterior Image */}
          <div className="relative w-full md:w-[30%] h-32 md:h-28 shrink-0">
            <img 
              key={`main-${ad._id || ad.id}`}
              src={mainImage} 
              alt={ad.title} 
              className="w-full h-full object-cover animate-fade-in"
            />
            {/* Dark label overlay */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 px-3 py-1 text-xs text-white border border-white/20 rounded-sm shadow-md">
              {ad.title}
            </div>
          </div>

          {/* Center Details */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
            <h4 className="text-sm font-serif tracking-wider mb-1 transition-colors" style={{ color: textColor }}>{ad.categoryLabel || ad.placement || 'Sponsored'}</h4>
            <div className="w-48 h-px mb-2 transition-colors" style={{ backgroundColor: brandColor }}></div>
            <h2 className="text-3xl font-extrabold tracking-tight mb-2 transition-colors" style={{ color: brandColor }}>{ad.title}</h2>
            <div className="flex items-center gap-6">
              <p className="text-sm font-bold transition-colors" style={{ color: textColor }}>{ad.targetUrl || 'Sponsored listing'}</p>
              <button 
                className="text-white text-xs font-bold px-4 py-1.5 rounded shadow-sm hover:brightness-110 transition-all"
                style={{ backgroundColor: brandColor }}
              >
                Know More &gt;
              </button>
            </div>
          </div>

          {/* Right Interior Images with curved masks */}
          <div className="relative w-full md:w-[40%] h-32 md:h-28 shrink-0 hidden md:flex">
            {/* First curved image */}
            <div className="absolute left-0 top-0 bottom-0 w-3/5 rounded-l-full overflow-hidden border-4 border-white shadow-[-10px_0_15px_rgba(0,0,0,0.1)] z-10 -ml-12">
               <img 
                key={`img1-${ad._id || ad.id}`}
                src={sideImage} 
                alt="Interior 1" 
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
            {/* Second curved image */}
            <div className="absolute right-0 top-0 bottom-0 w-3/5 rounded-l-full overflow-hidden border-4 border-white shadow-[-10px_0_15px_rgba(0,0,0,0.1)] z-20">
               <img 
                key={`img2-${ad._id || ad.id}`}
                src={secondSideImage} 
                alt="Interior 2" 
                className="w-full h-full object-cover animate-fade-in"
              />
            </div>
          </div>
          
        </div>
      </div>

      {/* Navigation Buttons */}
      {activeAds.length > 1 && (
        <>
          <button 
            onClick={prevAd}
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white border border-slate-200"
          >
            <ChevronLeft size={18} />
          </button>
          
          <button 
            onClick={nextAd}
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white border border-slate-200"
          >
            <ChevronRight size={18} />
          </button>
        </>
      )}

    </div>
  );
};

export default CategoryBannerAd;
