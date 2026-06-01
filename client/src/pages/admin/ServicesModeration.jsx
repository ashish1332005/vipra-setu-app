import { useEffect, useState } from 'react';
import { BadgeCheck, Star, XCircle } from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const ServicesModeration = () => {
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    api.get('/admin/services')
      .then(({ data }) => setServices(data.services))
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load services')));
  };

  useEffect(load, []);

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

export default ServicesModeration;
