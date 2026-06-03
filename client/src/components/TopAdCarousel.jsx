import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Megaphone } from 'lucide-react';
import { useGlobalContext } from '../context/GlobalContext';
import { adMatchesCategory, adMatchesPlacement } from '../utils/adTargeting';
import { getMediaUrl } from '../utils/media';

const TopAdCarousel = ({ placement = 'home', category = '' }) => {
  const { ads } = useGlobalContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeAds = useMemo(() => (
    ads.filter((ad) => {
      const isActive = ad.status === 'Active';
      const isBanner = ['Home Rail', 'Category Banner'].includes(ad.type);
      const matchesPlacement = adMatchesPlacement(ad, placement);
      const matchesCategory = adMatchesCategory(ad.targetCategory, category);
      return isActive && isBanner && matchesPlacement && matchesCategory;
    })
  ), [ads, category, placement]);

  useEffect(() => {
    setCurrentIndex(0);
  }, [activeAds.length, placement]);

  useEffect(() => {
    if (activeAds.length <= 1) return undefined;
    const timer = setInterval(() => {
      setCurrentIndex((current) => (current + 1) % activeAds.length);
    }, 5200);

    return () => clearInterval(timer);
  }, [activeAds.length]);

  if (activeAds.length === 0) return null;

  const ad = activeAds[currentIndex % activeAds.length];
  const imageUrl = getMediaUrl(ad.imageUrl);
  const hasTarget = Boolean(ad.targetUrl);
  const providerName = ad.providerProfile?.businessName || ad.providerUser?.name;
  const providerMeta = [
    ad.providerProfile?.category,
    ad.providerProfile?.city,
    ad.providerProfile?.rating ? `${ad.providerProfile.rating} rating` : null,
  ].filter(Boolean).join(' | ');

  const goPrev = () => setCurrentIndex((current) => (current - 1 + activeAds.length) % activeAds.length);
  const goNext = () => setCurrentIndex((current) => (current + 1) % activeAds.length);

  const content = (
    <div className="group relative overflow-hidden rounded-[1.35rem] border border-slate-200 bg-slate-950 shadow-[0_18px_55px_rgba(15,23,42,0.18)] sm:rounded-[1.6rem]">
      <div className="relative min-h-[185px] sm:min-h-[250px] lg:min-h-[280px]">
        <img
          src={imageUrl}
          alt={ad.title}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.88)_0%,rgba(15,23,42,0.52)_46%,rgba(15,23,42,0.08)_100%)]" />
        <div className="absolute inset-y-0 left-0 flex w-[76%] max-w-xl flex-col justify-center p-4 text-white sm:p-7">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/12 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-amber-200 backdrop-blur">
            <Megaphone size={14} />
            Sponsored
          </span>
          <h2 className="mt-3 text-2xl font-black leading-tight sm:text-4xl">{ad.title}</h2>
          <p className="mt-2 max-w-md text-sm font-semibold leading-6 text-white/78">
            {ad.subtitle || providerMeta || `${ad.placement || 'All pages'} placement`}
          </p>
          {providerName && (
            <span className="mt-3 inline-flex w-fit rounded-full border border-emerald-300/25 bg-emerald-400/15 px-3 py-1.5 text-xs font-black text-emerald-100 backdrop-blur">
              {providerName}{providerMeta ? ` | ${providerMeta}` : ''}
            </span>
          )}
          {hasTarget && (
            <span className="mt-4 inline-flex w-fit items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-sm font-black text-slate-950">
              {ad.ctaLabel || 'Open Ad'}
              <ArrowRight size={16} />
            </span>
          )}
        </div>
      </div>

      {activeAds.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              goPrev();
            }}
            className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-sm transition hover:bg-white sm:flex"
            aria-label="Previous ad"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault();
              goNext();
            }}
            className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-slate-950 shadow-sm transition hover:bg-white sm:flex"
            aria-label="Next ad"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-3 right-3 flex gap-1.5 rounded-full bg-slate-950/35 px-2.5 py-2 backdrop-blur">
            {activeAds.map((item, index) => (
              <button
                key={item._id || item.id || index}
                type="button"
                onClick={(event) => {
                  event.preventDefault();
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all ${index === currentIndex ? 'w-6 bg-amber-300' : 'w-2 bg-white/55'}`}
                aria-label={`Show ad ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );

  return (
    <section className="bg-white py-3 sm:py-5">
      <div className="site-shell">
        {hasTarget ? (
          <a href={ad.targetUrl} target="_blank" rel="noreferrer" className="block">
            {content}
          </a>
        ) : content}
      </div>
    </section>
  );
};

export default TopAdCarousel;
