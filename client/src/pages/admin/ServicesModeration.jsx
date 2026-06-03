import { useEffect, useState } from 'react';
import { BadgeCheck, PackagePlus, Star, XCircle } from 'lucide-react';
import api from '../../services/api';
import { useGlobalContext } from '../../context/GlobalContext';
import { getApiErrorMessage } from '../../utils/apiError';

const initialForm = {
  provider: '',
  title: '',
  category: '',
  description: '',
  priceLabel: '',
  durationLabel: '',
  packageType: 'standard',
  includes: '',
  moderationStatus: 'approved',
  isFeatured: false,
  isActive: true,
};

const ServicesModeration = () => {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');
  const [creating, setCreating] = useState(false);
  const { serviceCategories } = useGlobalContext();

  const load = () => {
    Promise.all([api.get('/admin/services'), api.get('/admin/providers')])
      .then(([servicesRes, providersRes]) => {
        setServices(servicesRes.data.services || []);
        const providerProfiles = Array.isArray(providersRes.data.profiles) ? providersRes.data.profiles : [];
        const activeProviders = providerProfiles.filter((profile) => profile?.user?._id);
        setProviders(activeProviders);
        setForm((current) => ({
          ...current,
          provider: current.provider || activeProviders[0]?.user?._id || '',
          category: current.category || serviceCategories[0]?.name || '',
        }));
      })
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load services')));
  };

  useEffect(load, []);

  useEffect(() => {
    setForm((current) => ({
      ...current,
      category: current.category || serviceCategories[0]?.name || '',
    }));
  }, [serviceCategories]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }));
  };

  const createService = async (event) => {
    event.preventDefault();
    setCreating(true);
    setMessage('');

    try {
      await api.post('/admin/services', {
        ...form,
        includes: form.includes.split(',').map((item) => item.trim()).filter(Boolean),
      });
      setForm((current) => ({
        ...initialForm,
        provider: current.provider,
        category: current.category,
      }));
      setMessage('Service created.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to create service'));
    } finally {
      setCreating(false);
    }
  };

  const moderate = async (service, body) => {
    try {
      await api.patch(`/admin/services/${service._id}/moderation`, body);
      setMessage('Service updated.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to update service'));
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Service Moderation</h1>
        <p className="mt-1 text-slate-500">Approve, reject, feature and inspect provider service packages.</p>
      </div>
      {message && <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</p>}

      <form onSubmit={createService} className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <PackagePlus size={21} />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-950">Create Service In Category</h2>
            <p className="text-sm font-semibold text-slate-500">Admin selected category ke andar provider service package add karein.</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Provider
            <select name="provider" value={form.provider} onChange={handleChange} className={inputClass} required>
              {providers.map((profile) => (
                <option key={profile.user._id} value={profile.user._id}>
                  {profile.businessName || profile.user.name}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Category
            <select name="category" value={form.category} onChange={handleChange} className={inputClass} required>
              {serviceCategories.map((category) => (
                <option key={category.id || category.name} value={category.name}>{category.name}</option>
              ))}
            </select>
          </label>
          <Field label="Service Title" name="title" value={form.title} onChange={handleChange} required />
          <Field label="Price Label" name="priceLabel" value={form.priceLabel} onChange={handleChange} placeholder="Rs 499 onwards" />
          <Field label="Duration" name="durationLabel" value={form.durationLabel} onChange={handleChange} placeholder="2-3 hours" />
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Package Type
            <select name="packageType" value={form.packageType} onChange={handleChange} className={inputClass}>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="inspection">Inspection</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <Field label="Includes" name="includes" value={form.includes} onChange={handleChange} placeholder="Visit, repair, cleanup" />
          <label className="grid gap-1.5 text-sm font-bold text-slate-700">
            Status
            <select name="moderationStatus" value={form.moderationStatus} onChange={handleChange} className={inputClass}>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </label>
          <label className="grid gap-1.5 text-sm font-bold text-slate-700 md:col-span-2 xl:col-span-4">
            Description
            <textarea name="description" value={form.description} onChange={handleChange} className={`${inputClass} min-h-24 resize-y`} required />
          </label>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-4">
            <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" />
              Featured
            </label>
            <label className="inline-flex items-center gap-2 text-sm font-bold text-slate-700">
              <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} className="h-4 w-4 rounded border-slate-300" />
              Active
            </label>
          </div>
          <button disabled={creating || !providers.length || !serviceCategories.length} className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60">
            <PackagePlus size={17} />
            {creating ? 'Creating...' : 'Create Service'}
          </button>
        </div>
      </form>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-600">
              <tr>
                <th className="px-5 py-4">Service</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Package</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {services.map((service) => (
                <tr key={service._id}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{service.title}</p>
                    <p className="text-xs font-medium text-slate-500">{service.category} | {service.priceLabel || 'Custom quote'}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{service.provider?.name || '-'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{service.packageType || 'standard'}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{service.moderationStatus}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-2">
                      <Action icon={BadgeCheck} label="Approve" onClick={() => moderate(service, { moderationStatus: 'approved', moderationNote: 'Approved by admin' })} />
                      <Action icon={XCircle} label="Reject" danger onClick={() => moderate(service, { moderationStatus: 'rejected', moderationNote: 'Needs better details' })} />
                      <Action icon={Star} label={service.isFeatured ? 'Unfeature' : 'Feature'} onClick={() => moderate(service, { isFeatured: !service.isFeatured })} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

const Action = ({ icon: Icon, label, onClick, danger }) => (
  <button onClick={onClick} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-black ${danger ? 'bg-red-50 text-red-700' : 'bg-slate-950 text-white'}`}>
    <Icon size={14} />
    {label}
  </button>
);

const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-950 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100';

const Field = ({ label, ...props }) => (
  <label className="grid gap-1.5 text-sm font-bold text-slate-700">
    {label}
    <input {...props} className={inputClass} />
  </label>
);

export default ServicesModeration;
