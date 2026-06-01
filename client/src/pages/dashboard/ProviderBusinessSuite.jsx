import { useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  IndianRupee,
  MessageSquareQuote,
  Save,
  Settings2,
  Star,
} from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const stages = ['new', 'contacted', 'quoted', 'scheduled', 'won', 'lost'];
const priorities = ['low', 'normal', 'high', 'urgent'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const ProviderBusinessSuite = () => {
  const [analytics, setAnalytics] = useState(null);
  const [requests, setRequests] = useState([]);
  const [selectedLeadId, setSelectedLeadId] = useState('');
  const [quote, setQuote] = useState({ amount: '', priceLabel: '', scope: '', validUntil: '' });
  const [settings, setSettings] = useState({
    autoReply: '',
    serviceAreaKm: 15,
    acceptsEmergency: false,
    weeklyAvailability: days.map((day) => ({ day, isOpen: true, startTime: '09:00', endTime: '18:00' })),
  });
  const [message, setMessage] = useState('');
  const [savingLeadId, setSavingLeadId] = useState('');

  const selectedLead = useMemo(
    () => requests.find((request) => request._id === selectedLeadId) || requests[0],
    [requests, selectedLeadId]
  );

  const load = () => {
    Promise.all([
      api.get('/providers/me/analytics'),
      api.get('/providers/me/requests'),
      api.get('/providers/me'),
    ])
      .then(([analyticsRes, requestsRes, profileRes]) => {
        setAnalytics(analyticsRes.data.analytics);
        setRequests(requestsRes.data.requests);
        const profile = profileRes.data.profile;
        setSettings({
          autoReply: profile?.businessSettings?.autoReply || 'Thanks for your request. I will contact you shortly.',
          serviceAreaKm: profile?.businessSettings?.serviceAreaKm || 15,
          acceptsEmergency: Boolean(profile?.businessSettings?.acceptsEmergency),
          weeklyAvailability: profile?.weeklyAvailability?.length
            ? profile.weeklyAvailability
            : days.map((day) => ({ day, isOpen: true, startTime: '09:00', endTime: '18:00' })),
        });
      })
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load business suite')));
  };

  useEffect(load, []);

  const updatePipeline = async (lead, patch) => {
    const previousRequests = requests;
    setSavingLeadId(lead._id);
    setMessage('');
    setRequests((current) =>
      current.map((request) =>
        request._id === lead._id ? { ...request, ...patch } : request
      )
    );

    try {
      const { data } = await api.patch(`/providers/me/requests/${lead._id}/pipeline`, patch);
      setRequests((current) =>
        current.map((request) =>
          request._id === lead._id ? data.request : request
        )
      );
      setMessage('Lead updated.');
    } catch (err) {
      setRequests(previousRequests);
      setMessage(getApiErrorMessage(err, 'Unable to update lead'));
    } finally {
      setSavingLeadId('');
    }
  };

  const sendQuote = async (event) => {
    event.preventDefault();
    if (!selectedLead) return;

    try {
      await api.post(`/providers/me/requests/${selectedLead._id}/quote`, {
        ...quote,
        amount: quote.amount ? Number(quote.amount) : undefined,
      });
      setQuote({ amount: '', priceLabel: '', scope: '', validUntil: '' });
      setMessage('Professional quote sent to customer.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to send quote'));
    }
  };

  const saveSettings = async (event) => {
    event.preventDefault();

    try {
      await api.put('/providers/me', {
        businessSettings: {
          autoReply: settings.autoReply,
          serviceAreaKm: Number(settings.serviceAreaKm),
          acceptsEmergency: settings.acceptsEmergency,
        },
        weeklyAvailability: settings.weeklyAvailability,
      });
      setMessage('Business settings saved.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to save settings'));
    }
  };

  const updateDay = (day, patch) => {
    setSettings((current) => ({
      ...current,
      weeklyAvailability: current.weeklyAvailability.map((item) =>
        item.day === day ? { ...item, ...patch } : item
      ),
    }));
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="bg-[linear-gradient(135deg,#0f172a,#1e40af_52%,#ea580c)] px-6 py-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-blue-100">Provider Business Suite</p>
          <h2 className="mt-3 text-3xl font-black">CRM, quotes, availability and performance in one workspace.</h2>
          <p className="mt-3 max-w-2xl text-sm font-medium text-blue-50">
            Built for yearly paid service providers who need company-level control over leads and customer follow-up.
          </p>
        </div>
        {message && <p className="border-t border-blue-100 bg-blue-50 px-6 py-3 text-sm font-bold text-blue-700">{message}</p>}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Metric icon={ClipboardList} label="Total Leads" value={analytics?.totalLeads || 0} />
        <Metric icon={MessageSquareQuote} label="Quoted Leads" value={analytics?.quoted || 0} />
        <Metric icon={CheckCircle2} label="Conversion" value={`${analytics?.conversionRate || 0}%`} />
        <Metric icon={IndianRupee} label="Quote Value" value={`Rs ${analytics?.totalQuoteValue || 0}`} />
        <Metric icon={CalendarClock} label="Follow-ups Due" value={analytics?.pendingFollowUps || 0} />
        <Metric icon={Star} label="Rating" value={analytics?.rating || 'New'} />
        <Metric icon={BarChart3} label="Live Services" value={analytics?.liveServices || 0} />
        <Metric icon={Settings2} label="Lead Credits" value={analytics?.leadCredits || 0} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-black text-slate-950">Lead CRM Pipeline</h2>
              <p className="mt-2 text-sm font-medium text-slate-500">Track every customer from new lead to won job.</p>
            </div>
            <select value={selectedLead?._id || ''} onChange={(event) => setSelectedLeadId(event.target.value)} className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold outline-none">
              {requests.map((request) => <option key={request._id} value={request._id}>{request.title}</option>)}
            </select>
          </div>

          <div className="mt-6 grid gap-3">
            {requests.map((request) => (
              <article key={request._id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-start">
                  <div>
                    <h3 className="font-black text-slate-950">{request.title}</h3>
                    <p className="mt-1 text-sm font-bold text-orange-700">{request.category} | {request.city}</p>
                    <p className="mt-2 text-sm font-medium text-slate-600">{request.description}</p>
                    <p className="mt-2 text-xs font-bold text-slate-500">
                      Customer: {request.serviceTaker?.name || '-'} | {request.serviceTaker?.phone || 'Phone hidden'}
                    </p>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2 lg:w-80">
                    <select value={request.pipelineStage || 'new'} onChange={(event) => updatePipeline(request, { pipelineStage: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black outline-none">
                      {stages.map((stage) => <option key={stage} value={stage}>{stage}</option>)}
                    </select>
                    <select value={request.priority || 'normal'} onChange={(event) => updatePipeline(request, { priority: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black outline-none">
                      {priorities.map((priority) => <option key={priority} value={priority}>{priority}</option>)}
                    </select>
                    <input type="datetime-local" value={request.nextFollowUpAt ? request.nextFollowUpAt.slice(0, 16) : ''} onChange={(event) => updatePipeline(request, { nextFollowUpAt: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-black outline-none sm:col-span-2" />
                    {savingLeadId === request._id && (
                      <p className="text-xs font-black text-blue-700 sm:col-span-2">Saving CRM update...</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge label={request.status} />
                  <Badge label={`Quote: ${request.quote?.status || 'not_sent'}`} />
                  <Badge label={`Priority: ${request.priority || 'normal'}`} />
                </div>
              </article>
            ))}
            {requests.length === 0 && <Empty text="No assigned leads yet. Claim leads from Requests tab." />}
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-2xl font-black text-slate-950">Professional Quote Builder</h2>
          <p className="mt-2 text-sm font-medium text-slate-500">Send structured quotes that customers can track in their request timeline.</p>
          <form onSubmit={sendQuote} className="mt-6 space-y-4">
            <Input label="Quote Amount" type="number" value={quote.amount} onChange={(value) => setQuote({ ...quote, amount: value })} placeholder="2500" />
            <Input label="Price Label" value={quote.priceLabel} onChange={(value) => setQuote({ ...quote, priceLabel: value })} placeholder="Rs 2500 including visit and labour" />
            <Input label="Valid Until" type="date" value={quote.validUntil} onChange={(value) => setQuote({ ...quote, validUntil: value })} />
            <label className="block">
              <span className="text-sm font-bold text-slate-600">Scope of Work</span>
              <textarea value={quote.scope} onChange={(event) => setQuote({ ...quote, scope: event.target.value })} rows={5} placeholder="What is included, timeline, warranty, exclusions..." className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500" />
            </label>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-blue-700">
              <MessageSquareQuote size={17} />
              Send Quote
            </button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Availability & Business Settings</h2>
        <form onSubmit={saveSettings} className="mt-6 grid gap-5 xl:grid-cols-[1fr_0.9fr]">
          <div className="grid gap-3 md:grid-cols-2">
            {settings.weeklyAvailability.map((item) => (
              <div key={item.day} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <label className="flex items-center justify-between gap-3 text-sm font-black text-slate-800">
                  {item.day}
                  <input type="checkbox" checked={item.isOpen} onChange={(event) => updateDay(item.day, { isOpen: event.target.checked })} />
                </label>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <input type="time" value={item.startTime} onChange={(event) => updateDay(item.day, { startTime: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold" />
                  <input type="time" value={item.endTime} onChange={(event) => updateDay(item.day, { endTime: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold" />
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <Input label="Service Area Radius (km)" type="number" value={settings.serviceAreaKm} onChange={(value) => setSettings({ ...settings, serviceAreaKm: value })} />
            <label className="block">
              <span className="text-sm font-bold text-slate-600">Auto Reply</span>
              <textarea value={settings.autoReply} onChange={(event) => setSettings({ ...settings, autoReply: event.target.value })} rows={5} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500" />
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-black text-slate-700">
              <input type="checkbox" checked={settings.acceptsEmergency} onChange={(event) => setSettings({ ...settings, acceptsEmergency: event.target.checked })} />
              Accept emergency / urgent work
            </label>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-blue-700">
              <Save size={17} />
              Save Business Settings
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

const Metric = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="flex items-center justify-between">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <Icon size={20} className="text-blue-700" />
    </div>
    <p className="mt-4 text-2xl font-black text-slate-950">{value}</p>
  </div>
);

const Badge = ({ label }) => (
  <span className="rounded-full bg-white px-3 py-1 text-xs font-black capitalize text-slate-700 ring-1 ring-slate-200">
    {String(label).replace('_', ' ')}
  </span>
);

const Input = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold outline-none focus:border-blue-500" />
  </label>
);

const Empty = ({ text }) => <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm font-bold text-slate-500">{text}</p>;

export default ProviderBusinessSuite;
