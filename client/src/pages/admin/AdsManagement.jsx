import {
  ImagePlus,
  Link as LinkIcon,
  Megaphone,
  Pause,
  Pencil,
  Play,
  Plus,
  RotateCcw,
  Save,
  Trash2,
  UploadCloud,
  X,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
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
  placements: ['all'],
  targetCategory: 'all',
  status: 'Active',
  imageFile: null,
  audienceRole: 'all',
  providerProfile: '',
  subtitle: '',
  ctaLabel: 'Know More',
};

const PLACEMENT_OPTIONS = [
  { value: 'all', label: 'All pages' },
  { value: 'home', label: 'Home' },
  { value: 'services', label: 'Services' },
  { value: 'category', label: 'Category pages' },
  { value: 'dashboard', label: 'User dashboards' },
];

const TYPE_OPTIONS = ['Home Rail', 'Category Banner', 'Sidebar'];
const AUDIENCE_OPTIONS = [
  { value: 'all', label: 'All accounts' },
  { value: 'service_taker', label: 'Service takers' },
  { value: 'service_provider', label: 'Service providers' },
];

const formatPlacements = (placements = ['all']) => {
  const labels = PLACEMENT_OPTIONS.reduce((items, option) => {
    items[option.value] = option.label;
    return items;
  }, {});

  return normalizePlacements(placements).map((placement) => labels[placement] || placement || 'All pages').join(', ');
};

const normalizePlacements = (placements = ['all']) => {
  const values = Array.isArray(placements) && placements.length > 0 ? placements : ['all'];
  if (values.includes('all')) return ['all'];
  return values.filter(Boolean);
};

const getAdId = (ad) => ad?._id || ad?.id;

const getProviderProfileId = (providerProfile) => {
  if (!providerProfile) return '';
  if (typeof providerProfile === 'string') return providerProfile;
  return providerProfile._id || '';
};

const AdsManagement = () => {
  const {
    ads,
    adsLoading,
    loadAds,
    createAd,
    updateAd,
    toggleAdStatus,
    deleteAd,
    serviceCategories,
  } = useGlobalContext();
  const [form, setForm] = useState(emptyForm);
  const [editingAdId, setEditingAdId] = useState('');
  const [uploadMode, setUploadMode] = useState('upload');
  const [preview, setPreview] = useState('');
  const [message, setMessage] = useState('');
  const [providerProfiles, setProviderProfiles] = useState([]);
  const [busyAdId, setBusyAdId] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAds({ admin: true });
    api.get('/admin/providers')
      .then(({ data }) => setProviderProfiles(data.profiles || []))
      .catch(() => setProviderProfiles([]));
  }, [loadAds]);

  const filteredAds = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return ads.filter((ad) => {
      const matchesStatus = statusFilter === 'all' || ad.status === statusFilter;
      const matchesType = typeFilter === 'all' || ad.type === typeFilter;
      const searchable = [
        ad.title,
        ad.subtitle,
        ad.type,
        ad.targetCategory,
        ad.audienceRole,
        ad.providerProfile?.businessName,
        ad.providerUser?.name,
      ].filter(Boolean).join(' ').toLowerCase();
      const matchesSearch = !normalizedSearch || searchable.includes(normalizedSearch);

      return matchesStatus && matchesType && matchesSearch;
    });
  }, [ads, search, statusFilter, typeFilter]);

  const stats = useMemo(() => ({
    total: ads.length,
    active: ads.filter((ad) => ad.status === 'Active').length,
    paused: ads.filter((ad) => ad.status === 'Paused').length,
    sidebar: ads.filter((ad) => ad.type === 'Sidebar').length,
  }), [ads]);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingAdId('');
    setUploadMode('upload');
    setPreview('');
    setMessage('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);
      setForm((current) => ({
        ...current,
        imageUrl: current.imageUrl,
        imageFile: { name: file.name, dataUrl },
      }));
    };
    reader.readAsDataURL(file);
  };

  const buildPayload = () => {
    const placements = normalizePlacements(form.placements);
    const imageUrl = uploadMode === 'url' ? form.imageUrl.trim() : form.imageUrl;

    return {
      ...form,
      title: form.title.trim(),
      subtitle: form.subtitle.trim(),
      ctaLabel: form.ctaLabel.trim() || 'Know More',
      targetUrl: form.targetUrl.trim(),
      imageUrl,
      placement: placements[0] || 'all',
      placements,
      imageFile: uploadMode === 'upload' ? form.imageFile : null,
      providerProfile: form.providerProfile,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    const payload = buildPayload();

    if (!payload.title) {
      setMessage('Ad title is required.');
      return;
    }

    if (!payload.imageUrl && !payload.imageFile?.dataUrl) {
      setMessage('Please upload an image or provide an image URL.');
      return;
    }

    try {
      if (editingAdId) {
        setBusyAdId(editingAdId);
        await updateAd(editingAdId, payload);
        setMessage('Ad updated successfully.');
      } else {
        await createAd(payload);
        setMessage('Ad published successfully.');
      }

      await loadAds({ admin: true });
      resetForm();
    } catch (error) {
      setMessage(getApiErrorMessage(error, editingAdId ? 'Unable to update ad' : 'Unable to add ad'));
    } finally {
      setBusyAdId('');
    }
  };

  const togglePlacement = (placement) => {
    setForm((current) => {
      if (placement === 'all') {
        return { ...current, placement: 'all', placements: ['all'] };
      }

      const currentPlacements = normalizePlacements(current.placements).filter((item) => item !== 'all');
      const nextPlacements = currentPlacements.includes(placement)
        ? currentPlacements.filter((item) => item !== placement)
        : [...currentPlacements, placement];
      const safePlacements = nextPlacements.length > 0 ? nextPlacements : ['all'];

      return {
        ...current,
        placement: safePlacements[0],
        placements: safePlacements,
      };
    });
  };

  const handleEdit = (ad) => {
    const adId = getAdId(ad);
    setEditingAdId(adId);
    setForm({
      ...emptyForm,
      title: ad.title || '',
      type: ad.type || 'Home Rail',
      imageUrl: ad.imageUrl || '',
      targetUrl: ad.targetUrl || '',
      placement: ad.placement || 'all',
      placements: normalizePlacements(ad.placements || [ad.placement || 'all']),
      targetCategory: ad.targetCategory || 'all',
      status: ad.status || 'Active',
      imageFile: null,
      audienceRole: ad.audienceRole || 'all',
      providerProfile: getProviderProfileId(ad.providerProfile),
      subtitle: ad.subtitle || '',
      ctaLabel: ad.ctaLabel || 'Know More',
    });
    setUploadMode('url');
    setPreview('');
    setMessage('Editing selected ad.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggle = async (adId) => {
    try {
      setBusyAdId(adId);
      setMessage('');
      await toggleAdStatus(adId);
      await loadAds({ admin: true });
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Unable to update ad'));
    } finally {
      setBusyAdId('');
    }
  };

  const handleDelete = async (adId) => {
    const confirmed = window.confirm('Delete this ad permanently?');
    if (!confirmed) return;

    try {
      setBusyAdId(adId);
      setMessage('');
      await deleteAd(adId);
      if (editingAdId === adId) resetForm();
      setMessage('Ad deleted successfully.');
    } catch (error) {
      setMessage(getApiErrorMessage(error, 'Unable to delete ad'));
    } finally {
      setBusyAdId('');
    }
  };

  const previewSrc = preview || form.imageUrl;
  const isEditing = Boolean(editingAdId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.18em] text-sky-700">Sponsored placements</p>
          <h1 className="mt-2 text-2xl font-black text-slate-900">Ads Control Panel</h1>
          <p className="mt-1 max-w-2xl text-sm font-semibold leading-6 text-slate-500">
            Create, edit, target, pause, and remove marketplace ads from one campaign manager.
          </p>
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-black text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <RotateCcw size={16} />
          New Ad
        </button>
      </div>

      <section className="grid gap-3 md:grid-cols-4">
        <Stat label="Total ads" value={stats.total} />
        <Stat label="Active" value={stats.active} tone="green" />
        <Stat label="Paused" value={stats.paused} tone="slate" />
        <Stat label="Sidebar" value={stats.sidebar} tone="amber" />
      </section>

      <form onSubmit={handleSubmit} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950">{isEditing ? 'Edit ad campaign' : 'Publish new ad'}</h2>
              <p className="text-sm font-semibold text-slate-500">{isEditing ? 'Update creative, sponsor, targeting, and status.' : 'Build a targeted sponsored placement.'}</p>
            </div>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-xs font-black text-slate-600 ring-1 ring-slate-200 hover:bg-slate-100"
              >
                <X size={14} />
                Cancel edit
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
          <div className="border-b border-slate-200 bg-slate-50 p-5 lg:border-b-0 lg:border-r">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className={form.type === 'Sidebar' ? 'aspect-[4/5] bg-slate-50' : 'aspect-[20/8] bg-slate-50'}>
                {previewSrc ? (
                  <img src={getMediaUrl(previewSrc)} alt="Ad preview" className="h-full w-full object-contain" />
                ) : (
                  <div className="flex h-full min-h-64 flex-col items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#eef6ff_100%)] text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-sky-700 shadow-sm">
                      <ImagePlus size={26} />
                    </div>
                    <p className="mt-4 text-sm font-black text-slate-700">Ad preview</p>
                    <p className="mt-1 text-xs font-semibold text-slate-500">Upload image or paste URL</p>
                  </div>
                )}
              </div>
              <div className="border-t border-slate-200 p-4">
                <p className="text-xs font-black uppercase tracking-[0.14em] text-sky-700">{form.type}</p>
                <h3 className="mt-1 truncate text-lg font-black text-slate-950">{form.title || 'Sponsored service provider'}</h3>
                <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-500">
                  {form.subtitle || `${formatPlacements(form.placements)} | ${form.targetCategory || 'all categories'}`}
                </p>
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={form.title}
                onChange={(value) => setForm({ ...form, title: value })}
                placeholder="Ad title"
                className="sm:col-span-2"
                required
              />

              <Select value={form.type} onChange={(value) => setForm({ ...form, type: value })}>
                {TYPE_OPTIONS.map((type) => <option key={type}>{type}</option>)}
              </Select>

              <Select value={form.status} onChange={(value) => setForm({ ...form, status: value })}>
                <option>Active</option>
                <option>Paused</option>
              </Select>

              <div className="sm:col-span-2">
                <p className="mb-2 text-xs font-black uppercase tracking-[0.14em] text-slate-500">Show on pages</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {PLACEMENT_OPTIONS.map((option) => {
                    const checked = normalizePlacements(form.placements).includes(option.value);

                    return (
                      <label
                        key={option.value}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-black transition ${
                          checked
                            ? 'border-sky-200 bg-sky-50 text-sky-800'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => togglePlacement(option.value)}
                          className="h-4 w-4 accent-sky-600"
                        />
                        {option.label}
                      </label>
                    );
                  })}
                </div>
              </div>

              <Select value={form.targetCategory} onChange={(value) => setForm({ ...form, targetCategory: value })}>
                <option value="all">All service categories</option>
                {serviceCategories.map((category) => (
                  <option key={category.id} value={category.name}>
                    Only {category.name}
                  </option>
                ))}
              </Select>

              <Select value={form.audienceRole} onChange={(value) => setForm({ ...form, audienceRole: value, providerProfile: '' })}>
                {AUDIENCE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </Select>

              <Select value={form.providerProfile} onChange={(value) => setForm({ ...form, providerProfile: value })} className="sm:col-span-2">
                <option value="">No specific provider sponsor</option>
                {providerProfiles.map((profile) => (
                  <option key={profile._id} value={profile._id}>
                    {(profile.businessName || profile.user?.name || 'Provider')} - {profile.category} - {profile.city}
                  </option>
                ))}
              </Select>

              <Input value={form.subtitle} onChange={(value) => setForm({ ...form, subtitle: value })} placeholder="Short ad subtitle / offer line" />
              <Input value={form.ctaLabel} onChange={(value) => setForm({ ...form, ctaLabel: value })} placeholder="CTA label" />

              <div className="sm:col-span-2">
                <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 p-1">
                  <ModeButton active={uploadMode === 'upload'} onClick={() => setUploadMode('upload')} icon={UploadCloud} label="Upload" />
                  <ModeButton active={uploadMode === 'url'} onClick={() => setUploadMode('url')} icon={LinkIcon} label="Image URL" />
                </div>
              </div>

              {uploadMode === 'upload' ? (
                <label className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border border-dashed border-sky-200 bg-sky-50 px-4 py-5 text-sm font-black text-sky-700 sm:col-span-2">
                  <UploadCloud size={20} />
                  {form.imageFile?.name || (form.imageUrl ? 'Replace current image' : 'Choose ad photo')}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <Input
                  value={form.imageUrl}
                  onChange={(value) => {
                    setForm({ ...form, imageUrl: value, imageFile: null });
                    setPreview('');
                  }}
                  placeholder="https://example.com/ad-photo.jpg"
                  className="sm:col-span-2"
                />
              )}

              <Input value={form.targetUrl} onChange={(value) => setForm({ ...form, targetUrl: value })} placeholder="Target URL / provider page / phone link" className="sm:col-span-2" />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                disabled={Boolean(busyAdId)}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isEditing ? <Save size={16} /> : <Plus size={16} />}
                {isEditing ? 'Save Changes' : 'Publish Ad'}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 hover:bg-slate-200"
                >
                  <X size={16} />
                  Cancel
                </button>
              )}
            </div>
            {message && <p className="mt-3 rounded-xl bg-sky-50 px-4 py-3 text-sm font-bold text-sky-700">{message}</p>}
          </div>
        </div>
      </form>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search ads, providers, category..."
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
          <Select value={statusFilter} onChange={setStatusFilter}>
            <option value="all">All statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
          </Select>
          <Select value={typeFilter} onChange={setTypeFilter}>
            <option value="all">All formats</option>
            {TYPE_OPTIONS.map((type) => <option key={type}>{type}</option>)}
          </Select>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {adsLoading && <p className="text-sm font-bold text-slate-500">Loading ads...</p>}
        {!adsLoading && filteredAds.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm xl:col-span-2">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Megaphone size={26} />
            </div>
            <h2 className="mt-4 text-xl font-bold text-slate-900">No ads found</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Create a new ad or clear your filters.</p>
          </div>
        )}
        {filteredAds.map((ad) => {
          const adId = getAdId(ad);
          const isBusy = busyAdId === adId;
          const isSelected = editingAdId === adId;

          return (
            <article key={adId} className={`overflow-hidden rounded-xl border bg-white shadow-sm ${isSelected ? 'border-sky-300 ring-4 ring-sky-50' : 'border-slate-200'}`}>
              <div className={ad.type === 'Sidebar' ? 'aspect-[4/2] bg-slate-50' : 'aspect-[20/7] bg-slate-50'}>
                <img src={getMediaUrl(ad.imageUrl)} alt={ad.title} className="h-full w-full object-contain" />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-black text-slate-950">{ad.title}</h2>
                    <p className="mt-1 text-xs font-bold text-slate-500">
                      {ad.type} | {formatPlacements(ad.placements || [ad.placement])} | {ad.targetCategory || 'all categories'} | {ad.audienceRole || 'all'}
                    </p>
                    {ad.providerProfile && (
                      <p className="mt-1 text-xs font-bold text-emerald-700">
                        Provider: {ad.providerProfile.businessName || ad.providerUser?.name} | {ad.providerProfile.category}
                      </p>
                    )}
                    {ad.subtitle && <p className="mt-1 line-clamp-2 text-xs font-semibold text-slate-500">{ad.subtitle}</p>}
                    {ad.targetUrl && <p className="mt-1 truncate text-xs font-semibold text-sky-700">{ad.targetUrl}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-black ${ad.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                    {ad.status}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(ad)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-2 text-sm font-black text-sky-700 hover:bg-sky-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggle(adId)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-2 text-sm font-black text-slate-700 hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {ad.status === 'Active' ? <Pause size={15} /> : <Play size={15} />}
                    {ad.status === 'Active' ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(adId)}
                    disabled={isBusy}
                    className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

const Stat = ({ label, value, tone = 'sky' }) => {
  const tones = {
    sky: 'bg-sky-50 text-sky-700',
    green: 'bg-emerald-50 text-emerald-700',
    slate: 'bg-slate-100 text-slate-700',
    amber: 'bg-amber-50 text-amber-700',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-xs font-black uppercase tracking-[0.14em] text-slate-500">{label}</p>
      <p className={`mt-3 inline-flex rounded-xl px-3 py-1 text-2xl font-black ${tones[tone]}`}>{value}</p>
    </div>
  );
};

const inputClass = 'rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

const Input = ({ value, onChange, className = '', ...props }) => (
  <input
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={`${inputClass} ${className}`}
    {...props}
  />
);

const Select = ({ value, onChange, children, className = '' }) => (
  <select
    value={value}
    onChange={(event) => onChange(event.target.value)}
    className={`${inputClass} ${className}`}
  >
    {children}
  </select>
);

const ModeButton = ({ active, onClick, icon: Icon, label }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-black transition ${
      active ? 'bg-sky-500 text-white shadow-sm' : 'text-slate-500'
    }`}
  >
    <Icon size={17} />
    {label}
  </button>
);

export default AdsManagement;
