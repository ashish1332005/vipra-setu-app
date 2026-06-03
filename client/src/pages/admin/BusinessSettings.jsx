import { useEffect, useState } from 'react';
import api from '../../services/api';
import { useGlobalContext } from '../../context/GlobalContext';
import { getApiErrorMessage } from '../../utils/apiError';

const BusinessSettings = () => {
  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', serviceTypes: '' });
  const [serviceDrafts, setServiceDrafts] = useState({});
  const [message, setMessage] = useState('');
  const { serviceCategories, loadMarketplace } = useGlobalContext();
  const displayedCategories = serviceCategories;

  const load = () => {
    api.get('/admin/categories')
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load settings')));
  };

  useEffect(load, []);

  const saveCategory = async (event) => {
    event.preventDefault();
    await api.post('/admin/categories', {
      ...categoryForm,
      serviceTypes: categoryForm.serviceTypes.split(',').map((item) => item.trim()).filter(Boolean),
    });
    setMessage('Category saved.');
    setCategoryForm({ name: '', description: '', serviceTypes: '' });
    load();
    await loadMarketplace();
  };

  const addServiceToCategory = async (category) => {
    const draftKey = category._id || category.name;
    const serviceName = serviceDrafts[draftKey]?.trim();
    if (!serviceName) return;

    const currentServices = getCategoryServices(category);
    const nextServiceTypes = [...new Set([...currentServices, serviceName])];
    await api.post('/admin/categories', {
      name: category.name,
      description: category.description,
      serviceTypes: nextServiceTypes,
      isActive: category.isActive,
    });
    setServiceDrafts((current) => ({ ...current, [draftKey]: '' }));
    setMessage('Service added to category.');
    load();
    await loadMarketplace();
  };

  return (
    <div className="grid gap-6">
      {message && <p className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</p>}

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Categories & Service Types</h1>
        <p className="mt-1 text-sm font-semibold text-slate-500">New category banayein, ya existing category me new service add karein.</p>
        <form onSubmit={saveCategory} className="mt-5 grid gap-3">
          <Input label="Category Name" value={categoryForm.name} onChange={(value) => setCategoryForm({ ...categoryForm, name: value })} />
          <Input label="Description" value={categoryForm.description} onChange={(value) => setCategoryForm({ ...categoryForm, description: value })} />
          <Input label="Service Types" value={categoryForm.serviceTypes} onChange={(value) => setCategoryForm({ ...categoryForm, serviceTypes: value })} placeholder="Plumber, Electrician, AC repair" />
          <button className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">Save Category</button>
        </form>
        <div className="mt-6 space-y-2">
          {displayedCategories.map((category) => {
            const draftKey = category._id || category.name;
            const services = getCategoryServices(category);

            return (
              <div key={draftKey} className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-sm font-black text-slate-900">{category.name}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {services.map((service) => (
                    <span key={service} className="rounded-lg bg-white px-2.5 py-1 text-xs font-black text-slate-600 ring-1 ring-slate-200">
                      {service}
                    </span>
                  ))}
                  {services.length === 0 && (
                    <span className="text-xs font-medium text-slate-500">No service types</span>
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  <input
                    value={serviceDrafts[draftKey] || ''}
                    onChange={(event) => setServiceDrafts((current) => ({ ...current, [draftKey]: event.target.value }))}
                    placeholder={`Add service in ${category.name}`}
                    className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold outline-none focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => addServiceToCategory(category)}
                    className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-black text-white"
                  >
                    Add
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const Input = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none" />
  </label>
);

const getCategoryServices = (category = {}) => {
  if (Array.isArray(category.serviceTypes)) return category.serviceTypes.filter(Boolean);
  if (Array.isArray(category.workTypes)) return category.workTypes.filter(Boolean);
  return [];
};

export default BusinessSettings;
