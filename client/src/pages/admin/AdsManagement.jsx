import { ImagePlus, Link as LinkIcon, Megaphone, Pause, Play, Plus, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useGlobalContext } from '../../context/GlobalContext';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';
import { getMediaUrl } from '../../utils/media';

const emptyForm = {
  title: '',
  type: 'Home Rail',
  imageUrl: '',
  targetUrl: '',
  placement: 'all',
  status: 'Active',
  imageFile: null,
  audienceRole: 'all',
  providerProfile: '',
  subtitle: '',
  ctaLabel: 'Know More',
};

const AdsManagement = () => {
  const { ads, adsLoading, loadAds, createAd, toggleAdStatus } = useGlobalContext();
  const [form, setForm] = useState(emptyForm);
  const [uploadMode, setUploadMode] = useState('upload');
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [providerProfiles, setProviderProfiles] = useState([]);

  useEffect(() => {
    loadAds({ admin: true });
    api.get('/admin/providers')
      .then(({ data }) => setProviderProfiles(data.profiles || []))
      .catch(() => setProviderProfiles([]));
  }, [loadAds]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      setForm((current) => ({
        ...current,
        imageUrl: '',
        imageFile: { name: file.name, dataUrl },
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const payload = {
      ...form,
      imageFile: uploadMode === 'upload' ? form.imageFile : null,
      imageUrl: uploadMode === 'url' ? form.imageUrl : '',
      providerProfile: form.audienceRole === 'service_provider' ? form.providerProfile : '',
    };

    try {
      await createAd(payload);
      setForm(emptyForm);
      setPreview('');
      setUploadMode('upload');
      setMessage('Ad added successfully.');
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Unable to add ad'));
    }
  };

  const handleToggle = async (adId) => {
    try {
      await toggleAdStatus(adId);
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Unable to update ad'));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Sponsored placements</p>
        <h1 className="mt-2 text-2xl font-black text-slate-900">Ads Control Panel</h1>
        <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
          Create professional banner ads for home, services, or all public marketplace pages. Upload a photo or use an image URL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
            <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              {preview || form.imageUrl ? (
                <img src={preview || form.imageUrl} alt="Ad preview" className="h-64 w-full object-cover" />
              ) : (
                <div className="flex h-64 flex-col items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#eef6ff_100%)] text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                    <ImagePlus size={26} />
                  </div>
                  <p className="mt-4 text-sm font-black text-slate-700">Ad preview</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">Upload image or paste URL</p>
                </div>
              )}
              <div className="absolute bottom-3 left-3 right-3 rounded-xl bg-slate-950/72 px-4 py-3 text-white backdrop-blur">
                <p className="text-xs font-black uppercase tracking-[0.16em] text-amber-200">{form.placement || 'all'} placement</p>
                <h2 className="mt-1 truncate text-lg font-black">{form.title || 'Sponsored service provider'}</h2>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                placeholder="Ad title"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:col-span-2"
                required
              />
              <select
                value={form.type}
                onChange={(event) => setForm({ ...form, type: event.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option>Home Rail</option>
                <option>Category Banner</option>
                <option>Sidebar</option>
              </select>
              <select
                value={form.placement}
                onChange={(event) => setForm({ ...form, placement: event.target.value })}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="all">All pages</option>
                <option value="home">Home top</option>
                <option value="services">Services top</option>
              </select>

              <select
                value={form.audienceRole}
                onChange={(event) => setForm({ ...form, audienceRole: event.target.value, providerProfile: '' })}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="all">Show to all accounts</option>
                <option value="service_taker">Service taker accounts</option>
                <option value="service_provider">Service provider accounts</option>
              </select>
              <select
                value={form.providerProfile}
                onChange={(event) => setForm({ ...form, providerProfile: event.target.value })}
                disabled={form.audienceRole !== 'service_provider'}
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="">No specific provider</option>
                {providerProfiles.map((profile) => (
                  <option key={profile._id} value={profile._id}>
                    {(profile.businessName || profile.user?.name || 'Provider')} - {profile.category} - {profile.city}
                  </option>
                ))}
              </select>

              <input
                value={form.subtitle}
                onChange={(event) => setForm({ ...form, subtitle: event.target.value })}
                placeholder="Short ad subtitle / offer line"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
              <input
                value={form.ctaLabel}
                onChange={(event) => setForm({ ...form, ctaLabel: event.target.value })}
                placeholder="CTA label"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />

              <div className="sm:col-span-2">
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => setUploadMode('upload')}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-black transition ${
                      uploadMode === 'upload' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <UploadCloud size={17} />
                    Upload
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-black transition ${
                      uploadMode === 'url' ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    <LinkIcon size={17} />
                    Image URL
                  </button>
                </div>
              </div>

              {uploadMode === 'upload' ? (
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50 px-4 py-5 text-sm font-black text-sky-700 sm:col-span-2">
                  <UploadCloud size={20} />
                  Choose ad photo
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <input
                  value={form.imageUrl}
                  onChange={(event) => {
                    setForm({ ...form, imageUrl: event.target.value, imageFile: null });
                    setPreview('');
                  }}
                  placeholder="https://example.com/ad-photo.jpg"
                  className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:col-span-2"
                  required={uploadMode === 'url'}
                />
              )}

              <input
                value={form.targetUrl}
                onChange={(event) => setForm({ ...form, targetUrl: event.target.value })}
                placeholder="Target URL / provider page / phone link"
                className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100 sm:col-span-2"
              />
            </div>

            <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-sky-700">
              <Plus size={16} />
              Publish Ad
            </button>
            {message && <p className="mt-3 text-sm font-bold text-sky-700">{message}</p>}
          </div>
        </div>
      </form>

      <section className="grid gap-4 xl:grid-cols-2">
        {adsLoading && <p className="text-sm font-bold text-slate-500">Loading ads...</p>}
        {!adsLoading && ads.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Megaphone size={26} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">No ads added yet</h2>
          </div>
        )}
        {ads.map((ad) => (
          <article key={ad._id || ad.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <img src={getMediaUrl(ad.imageUrl)} alt={ad.title} className="h-44 w-full object-cover" />
            <div className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-black text-slate-950">{ad.title}</h2>
                  <p className="mt-1 text-xs font-bold text-slate-500">{ad.type} - {ad.placement} - {ad.audienceRole || 'all'}</p>
                  {ad.providerProfile && (
                    <p className="mt-1 text-xs font-bold text-emerald-700">
                      Provider: {ad.providerProfile.businessName || ad.providerUser?.name} | {ad.providerProfile.category}
                    </p>
                  )}
                  {ad.targetUrl && <p className="mt-1 truncate text-xs font-semibold text-sky-700">{ad.targetUrl}</p>}
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-black ${ad.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                  {ad.status}
                </span>
              </div>
              <button onClick={() => handleToggle(ad._id || ad.id)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200">
                {ad.status === 'Active' ? <Pause size={15} /> : <Play size={15} />}
                {ad.status === 'Active' ? 'Pause' : 'Activate'}
              </button>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
};

export default AdsManagement;
