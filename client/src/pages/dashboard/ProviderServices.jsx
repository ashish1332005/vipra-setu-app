import { useEffect, useState } from 'react';
import { BadgeCheck, Plus, Power, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { SERVICE_CATEGORIES } from '../../data/marketplace';
import { getApiErrorMessage } from '../../utils/apiError';

const initialForm = {
  title: '',
  category: 'Household',
  description: '',
  priceLabel: '',
  durationLabel: '',
  packageType: 'standard',
  includes: '',
};

const ProviderServices = () => {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const loadServices = () => {
    api.get('/providers/me/services').then(({ data }) => setServices(data.services));
  };

  useEffect(loadServices, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/providers/me/services', {
        ...form,
        includes: form.includes.split(',').map((item) => item.trim()).filter(Boolean),
      });
      setForm(initialForm);
      setMessage('Service published.');
      loadServices();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to publish service'));
    }
  };

  const toggleActive = async (service) => {
    await api.patch(`/providers/me/services/${service._id}`, { isActive: !service.isActive });
    loadServices();
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
            <Sparkles size={21} />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Add Service</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
              Write a clear title, price and result-focused description so customers know exactly what they can request.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Service Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} placeholder="AC repair and servicing" required />
          <label className="block">
            <span className="text-sm font-bold text-slate-600">Category</span>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-500">
              {SERVICE_CATEGORIES.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </label>
          <Field label="Price Label" value={form.priceLabel} onChange={(value) => setForm({ ...form, priceLabel: value })} placeholder="Rs 500/visit or Custom quote" />
          <Field label="Duration" value={form.durationLabel} onChange={(value) => setForm({ ...form, durationLabel: value })} placeholder="2 hours, same day, monthly" />
          <label className="block">
            <span className="text-sm font-bold text-slate-600">Package Type</span>
            <select value={form.packageType} onChange={(event) => setForm({ ...form, packageType: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-500">
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="inspection">Inspection</option>
              <option value="custom">Custom</option>
            </select>
          </label>
          <Field label="Includes" value={form.includes} onChange={(value) => setForm({ ...form, includes: value })} placeholder="Visit, inspection, labour, basic material" />
          <label className="block">
            <span className="text-sm font-bold text-slate-600">Description</span>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required rows={5} placeholder="Mention coverage area, what is included, timing and special expertise." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-500" />
          </label>
          {message && <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{message}</p>}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-black text-white hover:bg-orange-700">
            <Plus size={18} />
            Publish Service
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-950">My Services</h2>
            <p className="mt-1 text-sm font-medium text-slate-500">Live services appear on public category pages.</p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-600">{services.length} total</span>
        </div>
        <div className="mt-6 space-y-4">
          {services.map((service) => (
            <article key={service._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">{service.title}</h3>
                  <p className="mt-1 text-sm font-bold text-orange-700">{service.category} | {service.priceLabel || 'Custom quote'}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">{service.description}</p>
                  <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-xs font-black text-emerald-700">
                    <BadgeCheck size={14} />
                    Marketplace ready
                  </p>
                </div>
                <button onClick={() => toggleActive(service)} className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-black ${service.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                  <Power size={14} />
                  {service.isActive ? 'Live' : 'Paused'}
                </button>
              </div>
            </article>
          ))}
          {services.length === 0 && <p className="text-sm font-medium text-slate-500">No services published yet.</p>}
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, required, placeholder = '' }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <input value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-orange-500" />
  </label>
);

export default ProviderServices;
