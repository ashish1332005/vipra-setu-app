import { useEffect, useMemo, useState } from 'react';
import { BadgeCheck, CheckCircle2, CircleAlert, ImagePlus, TrendingUp, UploadCloud } from 'lucide-react';
import api from '../../services/api';
import { useGlobalContext } from '../../context/GlobalContext';
import { getApiErrorMessage } from '../../utils/apiError';
import { getMediaUrl } from '../../utils/media';

const ProviderProfile = () => {
  const [form, setForm] = useState({
    businessName: '',
    category: 'Household',
    skills: '',
    city: 'Bhilwara',
    address: '',
    profileImageUrl: '',
    coverImageUrl: '',
    profileImageFile: null,
    coverImageFile: null,
    experienceYears: 0,
    rate: '',
    availability: 'Available today',
  });
  const [message, setMessage] = useState('');
  const { loadMarketplace, serviceCategories } = useGlobalContext();
  const profileTasks = useMemo(() => [
    { label: 'Business name', done: Boolean(form.businessName.trim()) },
    { label: 'Category selected', done: Boolean(form.category) },
    { label: 'City and address', done: Boolean(form.city.trim() && form.address.trim()) },
    { label: 'Profile image', done: Boolean(form.profileImageUrl || form.profileImageFile) },
    { label: 'Cover image', done: Boolean(form.coverImageUrl || form.coverImageFile) },
    { label: 'Clear pricing', done: Boolean(form.rate.trim()) },
    { label: 'Skills added', done: Boolean(form.skills.trim()) },
    { label: 'Availability visible', done: Boolean(form.availability.trim()) },
  ], [form]);
  const profileScore = Math.round((profileTasks.filter((task) => task.done).length / profileTasks.length) * 100);

  useEffect(() => {
    api.get('/providers/me').then(({ data }) => {
      if (!data.profile) return;
      setForm({
        businessName: data.profile.businessName || '',
        category: data.profile.category || 'Household',
        skills: (data.profile.skills || []).join(', '),
        city: data.profile.city || 'Bhilwara',
        address: data.profile.address || '',
        profileImageUrl: data.profile.profileImageUrl || '',
        coverImageUrl: data.profile.coverImageUrl || '',
        profileImageFile: null,
        coverImageFile: null,
        experienceYears: data.profile.experienceYears || 0,
        rate: data.profile.rate || '',
        availability: data.profile.availability || 'Available today',
      });
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const { data } = await api.put('/providers/me', {
        ...form,
        skills: form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      });
      if (data.profile) {
        setForm((current) => ({
          ...current,
          businessName: data.profile.businessName || '',
          category: data.profile.category || current.category,
          skills: (data.profile.skills || []).join(', '),
          city: data.profile.city || current.city,
          address: data.profile.address || '',
          profileImageUrl: data.profile.profileImageUrl || '',
          coverImageUrl: data.profile.coverImageUrl || '',
          profileImageFile: null,
          coverImageFile: null,
          experienceYears: data.profile.experienceYears || 0,
          rate: data.profile.rate || '',
          availability: data.profile.availability || 'Available today',
        }));
      }
      await loadMarketplace();
      setMessage('Profile saved successfully.');
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to save profile'));
    }
  };

  const handleImageFile = (field, fileField, event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        [field]: current[field],
        [fileField]: {
          name: file.name,
          type: file.type,
          dataUrl: reader.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  const profilePreview = form.profileImageFile?.dataUrl || form.profileImageUrl;
  const coverPreview = form.coverImageFile?.dataUrl || form.coverImageUrl;

  return (
    <div className="grid gap-6 xl:grid-cols-[0.72fr_0.28fr]">
      <DashboardCard title="Provider Profile" subtitle="This information appears in search and category pages after admin approval.">
        <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
              <div className="relative h-40 bg-slate-200">
                {coverPreview ? (
                  <img src={getMediaUrl(coverPreview)} alt="Business cover preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center bg-[linear-gradient(135deg,#fff7ed_0%,#e0f2fe_100%)] text-slate-500">
                    <ImagePlus size={30} />
                  </div>
                )}
                <div className="absolute -bottom-10 left-5 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-red-950 text-2xl font-black text-amber-200 shadow-lg">
                  {profilePreview ? (
                    <img src={getMediaUrl(profilePreview)} alt="Business profile preview" className="h-full w-full object-cover" />
                  ) : (
                    (form.businessName || 'SP').split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
                  )}
                </div>
              </div>
              <div className="grid gap-3 px-5 pb-5 pt-14 md:grid-cols-2">
                <ImageControl
                  label="Profile Image"
                  value={form.profileImageUrl}
                  fileName={form.profileImageFile?.name}
                  onUrlChange={(value) => setForm((current) => ({ ...current, profileImageUrl: value, profileImageFile: null }))}
                  onFileChange={(event) => handleImageFile('profileImageUrl', 'profileImageFile', event)}
                />
                <ImageControl
                  label="Cover Image"
                  value={form.coverImageUrl}
                  fileName={form.coverImageFile?.name}
                  onUrlChange={(value) => setForm((current) => ({ ...current, coverImageUrl: value, coverImageFile: null }))}
                  onFileChange={(event) => handleImageFile('coverImageUrl', 'coverImageFile', event)}
                />
              </div>
            </div>
          </div>
          <Input label="Business Name" name="businessName" value={form.businessName} onChange={setForm} />
          <label className="block">
            <span className="text-sm font-bold text-slate-600">Category</span>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-orange-500">
              {serviceCategories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </label>
          <Input label="City" name="city" value={form.city} onChange={setForm} />
          <Input label="Address" name="address" value={form.address} onChange={setForm} />
          <Input label="Experience Years" name="experienceYears" type="number" value={form.experienceYears} onChange={setForm} />
          <Input label="Rate" name="rate" value={form.rate} onChange={setForm} placeholder="Rs 500/visit" />
          <Input label="Availability" name="availability" value={form.availability} onChange={setForm} placeholder="Available today, weekends, 24x7" />
          <Input label="Skills" name="skills" value={form.skills} onChange={setForm} placeholder="Plumber, RO repair, Wiring" />
          {message && <p className="md:col-span-2 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{message}</p>}
          <button className="md:col-span-2 rounded-xl bg-slate-950 px-5 py-3 font-black text-white hover:bg-orange-700">Save Profile</button>
        </form>
      </DashboardCard>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-orange-700">Listing Quality</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">{profileScore}%</h2>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
            <TrendingUp size={23} />
          </span>
        </div>
        <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-orange-600" style={{ width: `${profileScore}%` }} />
        </div>
        <div className="mt-5 space-y-3">
          {profileTasks.map((task) => (
            <div key={task.label} className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2">
              {task.done ? <CheckCircle2 size={17} className="text-emerald-600" /> : <CircleAlert size={17} className="text-amber-600" />}
              <span className="text-sm font-bold text-slate-700">{task.label}</span>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
          <p className="flex items-center gap-2 text-sm font-black text-emerald-800">
            <BadgeCheck size={17} />
            Pro tip
          </p>
          <p className="mt-2 text-sm font-medium leading-6 text-emerald-800">
            Complete profile plus publish services to improve discovery and lead confidence.
          </p>
        </div>
      </section>
    </div>
  );
};

const Input = ({ label, name, value, onChange, type = 'text', placeholder = '' }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange((current) => ({ ...current, [name]: event.target.value }))}
      className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 font-semibold outline-none focus:border-orange-500"
    />
  </label>
);

const ImageControl = ({ label, value, fileName, onUrlChange, onFileChange }) => (
  <div>
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <div className="mt-2 grid gap-2">
      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-orange-200 bg-orange-50 px-4 py-3 text-sm font-black text-orange-700">
        <UploadCloud size={17} />
        {fileName || 'Upload image'}
        <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onFileChange} className="hidden" />
      </label>
      <input
        value={value}
        onChange={(event) => onUrlChange(event.target.value)}
        placeholder="Or paste image URL"
        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold outline-none focus:border-orange-500"
      />
    </div>
  </div>
);

const DashboardCard = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-2xl font-black text-slate-950">{title}</h2>
    <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
    <div className="mt-6">{children}</div>
  </section>
);

export default ProviderProfile;
