import { useEffect, useMemo, useRef, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import api from '../../services/api';
import { adMatchesCategory, adMatchesPlacement } from '../../utils/adTargeting';
import { getMediaUrl } from '../../utils/media';

const AdPlacement = ({ placement = 'all', pagePlacement, category = '', limit = 10, compact = false, className = '' }) => {
  const { ads, currentUser } = useGlobalContext();
  const [fallbackAds, setFallbackAds] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const railRef = useRef(null);

  useEffect(() => {
    if (ads.length > 0 && !category) return;

    const params = {};
    const targetPlacement = pagePlacement || placement;
    if (currentUser?.role) params.role = currentUser.role;
    if (category) params.category = category;
    if (targetPlacement && targetPlacement !== 'all') params.placement = targetPlacement;

    api.get('/ads', {
      params: Object.keys(params).length > 0 ? params : undefined,
    })
      .then(({ data }) => setFallbackAds(data.ads || []))
      .catch(() => setFallbackAds([]));
  }, [ads.length, category, currentUser?.role, pagePlacement, placement]);

  const visibleAds = useMemo(() => {
    const currentPlacement = placement.toLowerCase();
    const isSidebarSlot = currentPlacement === 'sidebar';
    const targetPlacement = pagePlacement || placement;
    const sourceAds = category
      ? dedupeAds([...ads, ...fallbackAds])
      : (ads.length > 0 ? ads : fallbackAds);

    return sourceAds
      .filter((ad) => {
        const adType = ad.type || '';
        const matchesType = isSidebarSlot ? adType === 'Sidebar' : adType !== 'Sidebar';
        const matchesPlacement = adMatchesPlacement(ad, targetPlacement);
        const matchesCategory = adMatchesCategory(ad.targetCategory, category);

        return ad.status === 'Active' && matchesType && matchesPlacement && matchesCategory;
      })
      .slice(0, limit);
  }, [ads, category, fallbackAds, limit, pagePlacement, placement]);

  useEffect(() => {
    setIsVisible(false);
    if (visibleAds.length === 0) return undefined;

    const timer = window.setTimeout(() => setIsVisible(true), 220);
    return () => window.clearTimeout(timer);
  }, [visibleAds.length, placement, category]);

  useEffect(() => {
    if (placement.toLowerCase() === 'sidebar' || visibleAds.length <= 1) return undefined;

    const rail = railRef.current;
    if (!rail) return undefined;

    const timer = window.setInterval(() => {
      const maxScrollLeft = rail.scrollWidth - rail.clientWidth;

      if (maxScrollLeft <= 0) return;

      if (rail.scrollLeft >= maxScrollLeft - 8) {
        rail.scrollTo({ left: 0, behavior: 'smooth' });
        return;
      }

      rail.scrollBy({
        left: Math.min(rail.clientWidth * 0.82, 520),
        behavior: 'smooth',
      });
    }, 3600);

    return () => window.clearInterval(timer);
  }, [placement, visibleAds.length]);

  if (visibleAds.length === 0) return null;

  if (placement.toLowerCase() === 'sidebar') {
    return (
      <aside className={`space-y-3 transition-all duration-500 ease-out ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-3 opacity-0'} ${className}`}>
        {visibleAds.map((ad) => {
          const href = ad.targetUrl || '#';
          const hasTarget = Boolean(ad.targetUrl);
          const CardTag = hasTarget ? 'a' : 'article';
          const providerName = ad.providerProfile?.businessName || ad.providerUser?.name;

          return (
            <CardTag
              key={ad._id || ad.id}
              href={hasTarget ? href : undefined}
              target={hasTarget ? '_blank' : undefined}
              rel={hasTarget ? 'noreferrer' : undefined}
              className="block overflow-hidden rounded-md border border-slate-200 bg-white shadow-[0_14px_34px_rgba(15,23,42,0.12)] transition hover:border-amber-300 hover:shadow-[0_18px_42px_rgba(15,23,42,0.16)]"
            >
              <div className="aspect-[4/5] bg-slate-50">
                <img
                  src={getMediaUrl(ad.imageUrl)}
                  alt={ad.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-black leading-5 text-slate-950">{ad.title}</p>
                {(ad.subtitle || providerName) && (
                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-4 text-slate-500">
                    {ad.subtitle || providerName}
                  </p>
                )}
              </div>
            </CardTag>
          );
        })}
      </aside>
    );
  }

  return (
    <section className={`overflow-hidden border-y border-amber-100 bg-[#fffaf2] py-2 transition-all duration-500 ease-out ${isVisible ? 'max-h-56 opacity-100 translate-y-0' : 'max-h-0 -translate-y-2 opacity-0'} ${className}`}>
      <div
        ref={railRef}
        className="flex snap-x gap-3 overflow-x-auto px-3 scroll-smooth [scrollbar-width:none] sm:px-4 lg:px-6 [&::-webkit-scrollbar]:hidden"
      >
      {visibleAds.map((ad) => {
        const href = ad.targetUrl || '#';
        const hasTarget = Boolean(ad.targetUrl);
        const CardTag = hasTarget ? 'a' : 'article';

        return (
          <CardTag
            key={ad._id || ad.id}
            href={hasTarget ? href : undefined}
            target={hasTarget ? '_blank' : undefined}
            rel={hasTarget ? 'noreferrer' : undefined}
            className={`block shrink-0 snap-start overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:border-amber-300 hover:shadow-md ${
              compact
                ? 'w-[min(86vw,380px)]'
                : 'w-[min(92vw,520px)] sm:w-[520px]'
            }`}
          >
            <div className={compact ? 'aspect-[20/7]' : 'aspect-[20/7]'}>
              <img
                src={getMediaUrl(ad.imageUrl)}
                alt={ad.title}
                className="h-full w-full object-contain"
              />
            </div>
          </CardTag>
        );
      })}
      </div>
    </section>
  );
};

const dedupeAds = (items = []) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = item?._id || item?.id;
    if (!key) return true;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export default AdPlacement;
