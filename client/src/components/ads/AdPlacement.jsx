import { useEffect, useMemo, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import api from '../../services/api';
import { getMediaUrl } from '../../utils/media';

const AdPlacement = ({ placement = 'all', category = '', limit = 10, compact = false }) => {
  const { ads, currentUser } = useGlobalContext();
  const [fallbackAds, setFallbackAds] = useState([]);

  useEffect(() => {
    if (ads.length > 0) return;

    api.get('/ads', {
      params: currentUser?.role ? { role: currentUser.role } : undefined,
    })
      .then(({ data }) => setFallbackAds(data.ads || []))
      .catch(() => setFallbackAds([]));
  }, [ads.length, currentUser?.role]);

  const visibleAds = useMemo(() => {
    const currentPlacement = placement.toLowerCase();
    const currentCategory = category.toLowerCase();

    return (ads.length > 0 ? ads : fallbackAds)
      .filter((ad) => {
        const adPlacement = (ad.placement || 'all').toLowerCase();
        const targetCategory = (ad.targetCategory || 'all').toLowerCase();
        const matchesPlacement = adPlacement === 'all' || adPlacement === currentPlacement;
        const matchesCategory = !currentCategory || targetCategory === 'all' || targetCategory === currentCategory;

        return ad.status === 'Active' && matchesPlacement && matchesCategory;
      })
      .slice(0, limit);
  }, [ads, category, fallbackAds, limit, placement]);

  if (visibleAds.length === 0) return null;

  return (
    <section className="overflow-hidden border-y border-amber-100 bg-[#fffaf2] py-2">
      <div className="flex snap-x gap-3 overflow-x-auto px-3 [scrollbar-width:none] sm:px-4 lg:px-6 [&::-webkit-scrollbar]:hidden">
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

export default AdPlacement;
