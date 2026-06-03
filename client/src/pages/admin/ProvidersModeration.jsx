import { useEffect, useState } from 'react';
import { BadgeCheck, FileCheck2, ImagePlus, Pencil, Plus, RotateCcw, Save, UploadCloud, UserPlus, XCircle } from 'lucide-react';
import api from '../../services/api';
import { useGlobalContext } from '../../context/GlobalContext';
import { getApiErrorMessage } from '../../utils/apiError';
import { prepareImageUpload } from '../../utils/imageUpload';
import { getMediaUrl } from '../../utils/media';

const initialForm = {
  name: '',
  phone: '',
  password: '',
  businessName: '',
  category: 'Household',
  city: 'Bhilwara',
  address: '',
  profileImageUrl: '',
  coverImageUrl: '',
  profileImageFile: null,
  coverImageFile: null,
  skills: '',
  experienceYears: '',
  rate: '',
  availability: 'Available',
  isApproved: true,
};

const ProvidersModeration = () => {
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState(initialForm);
  const [creating, setCreating] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState('');
  const { loadMarketplace, serviceCategories } = useGlobalContext();

  const load = () => {
    api.get('/admin/providers')
      .then(({ data }) => setProfiles(Array.isArray(data.profiles) ? data.profiles.filter(Boolean) : []))
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load providers')));
  };

  useEffect(load, []);

  const action = async (path, body = {}) => {
    try {
      await api.patch(path, body);
      setMessage('Provider updated.');
      load();
      await loadMarketplace();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to update provider'));
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageFile = async (urlField, fileField, event, options) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageFile = await prepareImageUpload(file, options);
      setForm((current) => ({
        ...current,
        [urlField]: imageFile.dataUrl,
        [fileField]: imageFile,
      }));
    } catch (error) {
      setMessage(error.message);
    } finally {
      event.target.value = '';
    }
  };

  const startEdit = (profile) => {
    setEditingProfileId(profile._id);
    setMessage('');
    setForm({
      name: profile.user?.name || '',
      phone: profile.user?.phone || '',
      password: '',
      businessName: profile.businessName || '',
      category: profile.category || serviceCategories[0]?.name || 'Household',
      city: profile.city || 'Bhilwara',
      address: profile.address || '',
      profileImageUrl: profile.profileImageUrl || '',
      coverImageUrl: profile.coverImageUrl || '',
      profileImageFile: null,
      coverImageFile: null,
      skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
      experienceYears: profile.experienceYears || '',
      rate: profile.rate || '',
      availability: profile.availability || 'Available',
      isApproved: Boolean(profile.isApproved),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingProfileId('');
  };

  const handleSubmitProvider = async (event) => {
    event.preventDefault();
    setCreating(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        experienceYears: Number(form.experienceYears || 0),
        skills: form.skills,
      };

      if (!payload.password) delete payload.password;

      if (editingProfileId) {
        const { data } = await api.put(`/admin/providers/${editingProfileId}`, payload);
        if (data.profile) {
          setProfiles((current) => current.map((profile) => (
            profile._id === data.profile._id ? data.profile : profile
          )));
        }
        setMessage('Provider profile updated.');
      } else {
        const { data } = await api.post('/admin/providers', payload);
        if (data.profile) {
          setProfiles((current) => [data.profile, ...current]);
        }
        setMessage('Provider account created.');
      }

      resetForm();
      load();
      await loadMarketplace();
    } catch (err) {
      setMessage(getApiErrorMessage(err, editingProfileId ? 'Unable to update provider profile' : 'Unable to create provider account'));
    } finally {
      setCreating(false);
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Provider Approval & KYC</h1>
        <p className="mt-1 text-slate-500">Approve/reject providers and verify KYC documents.</p>
      </div>
      {message && <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</p>}

      <form onSubmit={handleSubmitProvider} className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
            {editingProfileId ? <Pencil size={21} /> : <UserPlus size={21} />}
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-950">{editingProfileId ? 'Edit Seva Provider' : 'Create Seva Provider'}</h2>
            <p className="text-sm font-semibold text-slate-500">
              {editingProfileId ? 'Existing provider details, category, approval, aur images update karein.' : 'Admin se provider account aur profile ek saath banayein.'}
            </p>
          </div>
        </div>

        <div className="mb-5 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="relative h-36 bg-slate-200">
            {form.coverImageUrl ? (
              <img src={getMediaUrl(form.coverImageUrl)} alt="Cover preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#e0f2fe_100%)] text-slate-500">
                <ImagePlus size={28} />
              </div>
            )}
            <div className="absolute -bottom-9 left-5 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-red-950 text-xl font-black text-amber-200 shadow-lg">
              {form.profileImageUrl ? (
                <img src={getMediaUrl(form.profileImageUrl)} alt="Profile preview" className="h-full w-full object-cover" />
              ) : (
                (form.businessName || form.name || 'SP').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
              )}
            </div>
          </div>
          <div className="grid gap-3 px-5 pb-5 pt-12 md:grid-cols-2">
            <ImageUploadButton label="Upload Profile Image" onChange={(event) => handleImageFile('profileImageUrl', 'profileImageFile', event, { maxWidth: 700, maxHeight: 700, quality: 0.82 })} />
            <ImageUploadButton label="Upload Cover Image" onChange={(event) => handleImageFile('coverImageUrl', 'coverImageFile', event, { maxWidth: 1600, maxHeight: 700, quality: 0.84 })} />
            <Field label="Profile Image URL" name="profileImageUrl" value={form.profileImageUrl} onChange={handleChange} placeholder="https://example.com/profile.jpg" />
            <Field label="Cover Image URL" name="coverImageUrl" value={form.coverImageUrl} onChange={handleChange} placeholder="https://example.com/cover.jpg" />
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <Field label="Provider Name" name="name" value={form.name} onChange={handleChange} required />
          <Field label="Mobile Number" name="phone" type="tel" value={form.phone} onChange={handleChange} required />
          <Field label={editingProfileId ? 'New Password (optional)' : 'Password'} name="password" type="password" value={form.password} onChange={handleChange} required={!editingProfileId} minLength={6} />
          <Field label="Business Name" name="businessName" value={form.businessName} onChange={handleChange} />

          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Category
            <select name="category" value={form.category} onChange={handleChange} className={inputClass}>
              {serviceCategories.map((category) => (
                <option key={category.id} value={category.name}>{category.name}</option>
              ))}
            </select>
          </label>

          <Field label="City" name="city" value={form.city} onChange={handleChange} required />
          <Field label="Skills" name="skills" value={form.skills} onChange={handleChange} placeholder="Plumber, Electrician" />
          <Field label="Experience Years" name="experienceYears" type="number" value={form.experienceYears} onChange={handleChange} min="0" />
          <Field label="Rate" name="rate" value={form.rate} onChange={handleChange} placeholder="Custom quote" />
          <Field label="Availability" name="availability" value={form.availability} onChange={handleChange} />
          <label className="grid gap-1.5 text-sm font-bold text-slate-700 md:col-span-2">
            Address
            <input name="address" value={form.address} onChange={handleChange} className={inputClass} placeholder="Area / full address" />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" name="isApproved" checked={form.isApproved} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" />
            {editingProfileId ? 'Approved provider' : 'Create as approved provider'}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            {editingProfileId && (
              <button type="button" onClick={resetForm} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-200">
                <RotateCcw size={17} />
                Cancel Edit
              </button>
            )}
            <button disabled={creating} className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
              {editingProfileId ? <Save size={17} /> : <Plus size={17} />}
              {creating ? 'Saving...' : editingProfileId ? 'Save Provider' : 'Create Provider'}
            </button>
          </div>
        </div>
      </form>

      <div className="grid gap-4">
        {profiles.filter(Boolean).map((profile) => (
          <article key={profile._id || profile.user?._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div className="flex gap-4">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-slate-200">
                  {profile.profileImageUrl ? (
                    <img src={getMediaUrl(profile.profileImageUrl)} alt={profile.businessName || profile.user?.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-red-950 text-lg font-black text-amber-200">
                      {(profile.businessName || profile.user?.name || 'SP').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <h2 className="text-lg font-black text-slate-950">{profile.businessName || profile.user?.name}</h2>
                  <p className="mt-1 text-sm font-bold text-orange-700">{profile.category} | {profile.city}</p>
                  <p className="mt-2 text-sm text-slate-500">{formatContact(profile.user)}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Badge label={profile.isApproved ? 'Approved' : 'Pending approval'} tone={profile.isApproved ? 'green' : 'amber'} />
                    <Badge label={`KYC: ${profile.kyc?.status || 'not_submitted'}`} tone="blue" />
                    <Badge label={profile.coverImageUrl ? 'Cover added' : 'No cover'} tone="slate" />
                  </div>
                  {profile.kyc?.documentNumber && (
                    <p className="mt-3 text-xs font-bold text-slate-500">
                      {profile.kyc.documentType}: {profile.kyc.documentNumber}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => startEdit(profile)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-black text-white">
                  <Pencil size={16} />
                  Edit
                </button>
                <button onClick={() => action(`/admin/providers/${profile.user?._id}/approve`, { note: 'Approved by admin' })} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white">
                  <BadgeCheck size={16} />
                  Approve
                </button>
                <button onClick={() => action(`/admin/providers/${profile.user?._id}/reject`, { note: 'Please complete profile/KYC details' })} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700">
                  <XCircle size={16} />
                  Reject
                </button>
                <button onClick={() => action(`/admin/providers/${profile.user?._id}/kyc`, { status: 'verified', note: 'KYC verified' })} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                  <FileCheck2 size={16} />
                  Verify KYC
                </button>
              </div>
            </div>
          </article>
        ))}
        {profiles.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
            <h2 className="text-lg font-black text-slate-900">No providers found</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">Create a seva provider from the form above.</p>
          </div>
        )}
      </div>
    </section>
  );
};

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const ImageUploadButton = ({ label, onChange }) => (
  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-emerald-300 bg-emerald-50 px-3 py-3 text-sm font-black text-emerald-800 transition hover:bg-emerald-100">
    <UploadCloud size={17} />
    {label}
    <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onChange} className="sr-only" />
  </label>
);

const Field = ({ label, ...props }) => (
  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
    {label}
    <input {...props} className={inputClass} />
  </label>
);

const formatContact = (user) => {
  const email = user?.email?.endsWith('@mobile.local') ? '' : user?.email;
  return [email, user?.phone].filter(Boolean).join(' | ') || 'Contact not available';
};

const Badge = ({ label, tone }) => {
  const tones = {
    green: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
    slate: 'bg-slate-100 text-slate-700',
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[tone]}`}>{label}</span>;
};

export default ProvidersModeration;
