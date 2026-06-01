import { useEffect, useState } from 'react';
import { CalendarClock, CheckCircle2, IndianRupee, Plus, Star, X } from 'lucide-react';
import api from '../../services/api';
import { SERVICE_CATEGORIES } from '../../data/marketplace';
import { getApiErrorMessage } from '../../utils/apiError';

const initialForm = {
  category: 'Household',
  title: '',
  description: '',
  city: 'Bhilwara',
  address: '',
  preferredDate: '',
  preferredTimeSlot: '',
  budgetLabel: '',
};

const TakerRequests = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const loadRequests = () => {
    api.get('/service-takers/me/requests').then(({ data }) => setRequests(data.requests));
  };

  useEffect(loadRequests, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/service-takers/me/requests', form);
      setForm(initialForm);
      setMessage('Request created. Providers can now claim it.');
      loadRequests();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to create request'));
    }
  };

  const cancelRequest = async (id) => {
    await api.put(`/service-takers/me/requests/${id}`, { status: 'cancelled' });
    loadRequests();
  };

  const respondToQuote = async (id, status) => {
    try {
      await api.patch(`/service-takers/me/requests/${id}/quote`, { status });
      setMessage(`Quote ${status}.`);
      loadRequests();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to update quote'));
    }
  };

  const submitReview = async (request, rating) => {
    try {
      await api.post('/service-takers/me/reviews', {
        request: request._id,
        rating,
        comment: `Rated ${rating} stars from customer dashboard.`,
      });
      setMessage('Review submitted.');
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to submit review'));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <CalendarClock size={21} />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Create Request</h2>
            <p className="mt-1 text-sm font-medium leading-6 text-slate-500">
              Add clear details so providers can respond with accurate quotes and timing.
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Field label="Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} placeholder="Need electrician for wiring" required />
          <label className="block">
            <span className="text-sm font-bold text-slate-600">Category</span>
            <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-indigo-500">
              {SERVICE_CATEGORIES.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
            </select>
          </label>
          <Field label="City" value={form.city} onChange={(value) => setForm({ ...form, city: value })} required />
          <Field label="Address" value={form.address} onChange={(value) => setForm({ ...form, address: value })} />
          <Field label="Preferred Date" type="date" value={form.preferredDate} onChange={(value) => setForm({ ...form, preferredDate: value })} />
          <Field label="Preferred Time Slot" value={form.preferredTimeSlot} onChange={(value) => setForm({ ...form, preferredTimeSlot: value })} placeholder="Morning, afternoon, evening" />
          <Field label="Budget" value={form.budgetLabel} onChange={(value) => setForm({ ...form, budgetLabel: value })} placeholder="Rs 500-1000 or open quote" />
          <label className="block">
            <span className="text-sm font-bold text-slate-600">Description</span>
            <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} required rows={5} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-indigo-500" />
          </label>
          {message && <p className="rounded-xl bg-indigo-50 px-4 py-3 text-sm font-bold text-indigo-700">{message}</p>}
          <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 font-black text-white hover:bg-indigo-700">
            <Plus size={18} />
            Create Request
          </button>
        </form>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">My Requests</h2>
        <div className="mt-6 space-y-4">
          {requests.map((request) => (
            <article key={request._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-black text-slate-950">{request.title}</h3>
                  <p className="mt-1 text-sm font-bold text-indigo-700">{request.category} · {request.city}</p>
                  <p className="mt-2 text-sm font-medium text-slate-600">{request.description}</p>
                  <p className="mt-3 text-xs font-bold text-slate-500">
                    Provider: {request.provider?.name || 'Not assigned yet'}
                  </p>
                  {request.quote?.status && request.quote.status !== 'not_sent' && (
                    <div className="mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
                      <p className="flex items-center gap-2 text-sm font-black text-slate-950">
                        <IndianRupee size={16} className="text-amber-700" />
                        Provider Quote
                      </p>
                      <p className="mt-2 text-sm font-bold text-amber-800">
                        {request.quote.priceLabel || `Rs ${request.quote.amount || 0}`}
                      </p>
                      {request.quote.scope && <p className="mt-2 text-sm font-medium text-slate-600">{request.quote.scope}</p>}
                      <p className="mt-2 text-xs font-bold capitalize text-slate-500">Status: {request.quote.status}</p>
                      {request.quote.status === 'sent' && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => respondToQuote(request._id, 'accepted')} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-black text-white">
                            <CheckCircle2 size={14} />
                            Accept Quote
                          </button>
                          <button onClick={() => respondToQuote(request._id, 'rejected')} className="inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-xs font-black text-red-700">
                            <X size={14} />
                            Reject Quote
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="mt-4 border-t border-slate-200 pt-4">
                    <p className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-500">
                      <CalendarClock size={14} />
                      Timeline
                    </p>
                    <div className="space-y-2">
                      {(request.statusHistory || [{ status: request.status, changedAt: request.createdAt }]).map((item, index) => (
                        <div key={`${item.status}-${index}`} className="flex gap-3 text-xs font-bold text-slate-600">
                          <span className="mt-1 h-2 w-2 rounded-full bg-indigo-600" />
                          <span className="capitalize">{item.status.replace('_', ' ')} · {item.changedAt ? new Date(item.changedAt).toLocaleString() : 'Now'}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-slate-600">{request.status}</span>
              </div>
              {request.status === 'completed' && request.provider && (
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-sm font-black text-slate-700">Rate work:</span>
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <button key={rating} onClick={() => submitReview(request, rating)} className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1.5 text-xs font-black text-amber-700 hover:bg-amber-100">
                      <Star size={13} className="fill-current" />
                      {rating}
                    </button>
                  ))}
                </div>
              )}
              {!['completed', 'cancelled'].includes(request.status) && (
                <button onClick={() => cancelRequest(request._id)} className="mt-4 inline-flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-black text-red-700 hover:bg-red-100">
                  <X size={15} />
                  Cancel
                </button>
              )}
            </article>
          ))}
          {requests.length === 0 && <p className="text-sm font-medium text-slate-500">No requests yet.</p>}
        </div>
      </section>
    </div>
  );
};

const Field = ({ label, value, onChange, type = 'text', placeholder = '', required }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} required={required} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none focus:border-indigo-500" />
  </label>
);

export default TakerRequests;
