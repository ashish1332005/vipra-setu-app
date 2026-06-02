import { ExternalLink, Megaphone } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import api from '../../services/api';
import { getMediaUrl } from '../../utils/media';

const placementLabels = {
  all: 'Sponsored',
  home: 'Featured on home',
  services: 'Service sponsor',
  category: 'Category sponsor',
  dashboard: 'Dashboard sponsor',
};

const AdPlacement = ({ placement = 'all', category = '', limit = 2, compact = false }) => {
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
    <section className={`grid gap-3 ${visibleAds.length > 1 ? 'md:grid-cols-2' : ''}`}>
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
            className={`group grid overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm transition hover:border-amber-200 hover:shadow-md ${
              compact ? 'grid-cols-[112px_1fr]' : 'sm:grid-cols-[180px_1fr]'
            }`}
          >
            <div className={compact ? 'h-full min-h-28' : 'h-40 sm:h-full'}>
              <img src={getMediaUrl(ad.imageUrl)} alt={ad.title} className="h-full w-full object-cover" />
            </div>
            <div className={compact ? 'p-4' : 'p-5'}>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-red-900">
                <Megaphone size={13} />
                {placementLabels[(ad.placement || placement).toLowerCase()] || 'Sponsored'}
              </div>
              <h3 className="mt-3 line-clamp-2 text-lg font-black leading-tight text-slate-950">
                {ad.title}
              </h3>
              {ad.subtitle && (
                <p className="mt-2 line-clamp-2 text-sm font-semibold leading-6 text-slate-500">
                  {ad.subtitle}
                </p>
              )}
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-red-900">
                {ad.ctaLabel || 'Know More'}
                <ExternalLink size={15} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </CardTag>
        );
      })}
    </section>
  );
};

export default AdPlacement;
