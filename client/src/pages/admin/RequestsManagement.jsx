import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const RequestsManagement = () => {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    api.get('/admin/requests')
      .then(({ data }) => setRequests(data.requests))
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load requests')));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/admin/requests/${id}/status`, { status });
    load();
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Service Requests</h1>
        <p className="mt-1 text-slate-500">Monitor service taker requests and operational status.</p>
      </div>
      {message && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-700">{message}</p>}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-sm font-bold text-slate-600">
              <tr>
                <th className="px-5 py-4">Request</th>
                <th className="px-5 py-4">Taker</th>
                <th className="px-5 py-4">Provider</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((request) => (
                <tr key={request._id}>
                  <td className="px-5 py-4">
                    <p className="font-bold text-slate-900">{request.title}</p>
                    <p className="text-xs font-medium text-slate-500">{request.category} · {request.city}</p>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{request.serviceTaker?.name || '-'}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{request.provider?.name || 'Unassigned'}</td>
                  <td className="px-5 py-4">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-black text-slate-700">{request.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <select value={request.status} onChange={(event) => updateStatus(request._id, event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold">
                      <option value="open">Open</option>
                      <option value="assigned">Assigned</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
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

export default RequestsManagement;
