import { useEffect, useState } from 'react';
import { Check, MessageSquarePlus, Play, PlusCircle, X } from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const ProviderRequests = () => {
  const [assigned, setAssigned] = useState([]);
  const [open, setOpen] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => Promise.all([
    api.get('/providers/me/requests'),
    api.get('/providers/me/open-requests'),
  ]).then(([assignedRes, openRes]) => {
    setAssigned(assignedRes.data.requests);
    setOpen(openRes.data.requests);
  });

  useEffect(() => {
    load().catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load requests')));
  }, []);

  const claim = async (id) => {
    await api.patch(`/providers/me/open-requests/${id}/claim`);
    setMessage('Request claimed.');
    load();
  };

  const updateStatus = async (id, status) => {
    await api.patch(`/providers/me/requests/${id}/status`, { status });
    load();
  };

  const addNote = async (id) => {
    const note = window.prompt('Add internal CRM note');
    if (!note) return;
    await api.patch(`/providers/me/requests/${id}/pipeline`, { note, pipelineStage: 'contacted' });
    setMessage('CRM note added.');
    load();
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <RequestColumn title="Open Leads" subtitle="Requests matching your city and category.">
        {open.map((request) => (
          <RequestCard key={request._id} request={request}>
            <button onClick={() => claim(request._id)} className="inline-flex items-center gap-2 rounded-full bg-orange-600 px-4 py-2 text-sm font-black text-white hover:bg-orange-700">
              <PlusCircle size={16} />
              Claim
            </button>
          </RequestCard>
        ))}
        {open.length === 0 && <Empty text="No matching open leads right now." />}
      </RequestColumn>

      <RequestColumn title="Assigned Work" subtitle="Move requests from assigned to completed.">
        {message && <p className="rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{message}</p>}
        {assigned.map((request) => (
          <RequestCard key={request._id} request={request}>
            <div className="flex flex-wrap gap-2">
              <Action onClick={() => updateStatus(request._id, 'in_progress')} icon={Play} label="Start" />
              <Action onClick={() => updateStatus(request._id, 'completed')} icon={Check} label="Complete" />
              <Action onClick={() => addNote(request._id)} icon={MessageSquarePlus} label="Note" />
              <Action onClick={() => updateStatus(request._id, 'cancelled')} icon={X} label="Cancel" danger />
            </div>
          </RequestCard>
        ))}
        {assigned.length === 0 && <Empty text="No assigned work yet." />}
      </RequestColumn>
    </div>
  );
};

const RequestColumn = ({ title, subtitle, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h2 className="text-2xl font-black text-slate-950">{title}</h2>
    <p className="mt-2 text-sm font-medium text-slate-500">{subtitle}</p>
    <div className="mt-6 space-y-4">{children}</div>
  </section>
);

const RequestCard = ({ request, children }) => (
  <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="font-black text-slate-950">{request.title}</h3>
        <p className="mt-1 text-sm font-bold text-orange-700">{request.category} · {request.city}</p>
        <p className="mt-2 text-sm font-medium text-slate-600">{request.description}</p>
        <p className="mt-3 text-xs font-bold text-slate-500">
          By {request.serviceTaker?.name || 'Service taker'} · {request.serviceTaker?.phone || 'Phone hidden'}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-slate-700 ring-1 ring-slate-200">
            Stage: {(request.pipelineStage || 'new').replace('_', ' ')}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-slate-700 ring-1 ring-slate-200">
            Priority: {request.priority || 'normal'}
          </span>
          <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
            Quote: {request.quote?.status || 'not_sent'}
          </span>
        </div>
        {request.internalNotes?.length > 0 && (
          <p className="mt-3 rounded-xl bg-white px-3 py-2 text-xs font-bold text-slate-500">
            Last note: {request.internalNotes[request.internalNotes.length - 1]?.note}
          </p>
        )}
      </div>
      <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">{request.status}</span>
    </div>
    <div className="mt-4">{children}</div>
  </article>
);

const Action = ({ onClick, icon: Icon, label, danger }) => (
  <button onClick={onClick} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${danger ? 'bg-red-50 text-red-700 hover:bg-red-100' : 'bg-slate-950 text-white hover:bg-orange-700'}`}>
    <Icon size={15} />
    {label}
  </button>
);

const Empty = ({ text }) => <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm font-bold text-slate-500">{text}</p>;

export default ProviderRequests;
