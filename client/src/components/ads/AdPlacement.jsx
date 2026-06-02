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
    const seenAds = new Set();

    return (ads.length > 0 ? ads : fallbackAds)
      .filter((ad) => {
        const adPlacement = (ad.placement || 'all').toLowerCase();
        const targetCategory = (ad.targetCategory || 'all').toLowerCase();
        const matchesPlacement = adPlacement === 'all' || adPlacement === currentPlacement;
        const matchesCategory = !currentCategory || targetCategory === 'all' || targetCategory === currentCategory;

        return ad.status === 'Active' && matchesPlacement && matchesCategory;
      })
      .filter((ad) => {
        const uniqueKey = [
          ad.title,
          ad.subtitle,
          ad.targetUrl,
          ad.targetCategory,
          ad.audienceRole,
        ].map((value) => String(value || '').trim().toLowerCase()).join('|');

        if (seenAds.has(uniqueKey)) return false;
        seenAds.add(uniqueKey);
        return true;
      })
      .slice(0, limit);
  }, [ads, category, fallbackAds, limit, placement]);

  if (visibleAds.length === 0) return null;

  return (
    <section className="grid gap-4">
      {visibleAds.map((ad) => {
        const href = ad.targetUrl || '#';
        const hasTarget = Boolean(ad.targetUrl);
        const CardTag = hasTarget ? 'a' : 'article';
        const label = placementLabels[(ad.placement || placement).toLowerCase()] || 'Sponsored';

        return (
          <CardTag
            key={ad._id || ad.id}
            href={hasTarget ? href : undefined}
            target={hasTarget ? '_blank' : undefined}
            rel={hasTarget ? 'noreferrer' : undefined}
            className={`group grid overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-[0_16px_44px_rgba(67,20,7,0.08)] transition hover:border-amber-200 hover:shadow-[0_20px_54px_rgba(67,20,7,0.12)] ${
              compact ? 'grid-cols-[104px_1fr]' : 'lg:grid-cols-[minmax(240px,0.36fr)_1fr]'
            }`}
          >
            <div className={`flex items-center justify-center bg-slate-950 ${compact ? 'min-h-28 p-1.5' : 'min-h-56 p-3'}`}>
              <img
                src={getMediaUrl(ad.imageUrl)}
                alt={ad.title}
                className="max-h-full w-full object-contain"
              />
            </div>
            <div className={`flex min-w-0 flex-col justify-center ${compact ? 'p-4' : 'p-5 sm:p-6'}`}>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-red-900">
                  <Megaphone size={13} />
                  {label}
                </span>
                {ad.targetCategory && ad.targetCategory !== 'all' && (
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-slate-500">
                    {ad.targetCategory}
                  </span>
                )}
              </div>
              <h3 className={`${compact ? 'mt-2 text-base' : 'mt-4 text-2xl'} line-clamp-2 font-black leading-tight text-slate-950`}>
                {ad.title}
              </h3>
              {ad.subtitle && (
                <p className={`${compact ? 'mt-1 text-sm leading-5' : 'mt-3 text-base leading-7'} line-clamp-2 font-semibold text-slate-500`}>
                  {ad.subtitle}
                </p>
              )}
              <span className={`${compact ? 'mt-3' : 'mt-5'} inline-flex w-fit items-center gap-2 rounded-xl bg-red-950 px-4 py-2.5 text-sm font-black text-white transition group-hover:bg-amber-700`}>
                {ad.ctaLabel || 'Know More'}
                {hasTarget && <ExternalLink size={15} className="transition-transform group-hover:translate-x-0.5" />}
              </span>
            </div>
          </CardTag>
        );
      })}
    </section>
  );
};

export default AdPlacement;
