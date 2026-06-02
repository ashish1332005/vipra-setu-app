import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, CalendarClock, CheckCircle2, ClipboardCheck, MapPin, Search, ShieldCheck, Sparkles } from 'lucide-react';
import api from '../../services/api';
import { useGlobalContext } from '../../context/GlobalContext';
import { getApiErrorMessage } from '../../utils/apiError';

const initialForm = {
  category: 'Household',
  title: '',
  description: '',
  city: 'Bhilwara',
  address: '',
  preferredDate: '',
  preferredTimeSlot: 'Morning',
  budgetLabel: '',
  urgency: 'normal',
  provider: '',
};

const REQUEST_TEMPLATES = {
  Household: [
    'AC repair or service',
    'Plumbing leakage',
    'Electrical wiring or fan repair',
    'RO water purifier service',
  ],
  Event: [
    'Tent, light and decoration',
    'Photography for function',
    'Catering and halwai booking',
    'Pandit ji for puja',
  ],
  Education: [
    'Home tutor required',
    'Computer classes enquiry',
    'Coaching center admission',
    'Spoken English classes',
  ],
  Hospital: [
    'Home care attendant',
    'Physiotherapy session',
    'Diagnostic or medical support',
    'Ambulance or hospital help',
  ],
  'Property and Rent': [
    'Rental house search',
    'Shop or office rent',
    'Property dealer support',
    'Room or PG enquiry',
  ],
  'Hotels and Restaurant': [
    'Tiffin service',
    'Catering support',
    'Hotel room enquiry',
    'Chef booking',
  ],
  'Other Services': [
    'Job placement support',
    'Loan or insurance guidance',
    'Construction site visit',
    'Interior design enquiry',
  ],
};

const TakerBookingAssistant = () => {
  const [form, setForm] = useState(initialForm);
  const [providers, setProviders] = useState([]);
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const { serviceCategories } = useGlobalContext();

  useEffect(() => {
    api.get('/providers').then(({ data }) => setProviders(data.providers || []));
  }, []);

  const matchingProviders = useMemo(() => providers
    .filter((provider) => provider.category === form.category && (!form.city || provider.city?.toLowerCase().includes(form.city.toLowerCase())))
    .sort((left, right) => (right.rating || 0) - (left.rating || 0))
    .slice(0, 6), [form.category, form.city, providers]);
  const selectedProvider = matchingProviders.find((provider) => provider.user?._id === form.provider);
  const selectedCategoryConfig = serviceCategories.find((category) => category.name === form.category);
  const requestTemplates = REQUEST_TEMPLATES[form.category] || selectedCategoryConfig?.workTypes || [];
  const canContinueDetails = form.title.trim().length > 2;
  const canSubmit = Boolean(form.title.trim() || form.description.trim() || selectedProvider);

  const applyTemplate = (template) => {
    setForm((current) => ({
      ...current,
      title: template,
      description: current.description || `Need help for ${template}. Please share availability, quote and expected completion time.`,
    }));
  };

  const submit = async () => {
    setMessage('');

    try {
      await api.post('/service-takers/me/requests', {
        ...form,
        provider: form.provider || undefined,
        title: form.title || `${form.category} service request`,
        description: `${form.description}\nUrgency: ${form.urgency}`,
      });
      setMessage('Booking request created. Track it from My Requests.');
      setForm(initialForm);
      setStep(1);
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to create booking request'));
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-amber-100 bg-white shadow-sm">
        <div className="bg-gradient-to-br from-[#3b0b07] via-[#7f1d1d] to-slate-950 px-6 py-8 text-white">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-amber-200">Smart Booking Assistant</p>
          <h2 className="mt-3 text-3xl font-black">Book local help in 3 simple steps.</h2>
          <p className="mt-3 max-w-2xl text-sm font-semibold leading-6 text-white/78">
            Select service, describe work, compare providers, choose time and create a trackable request.
          </p>
        </div>
      </section>

      {message && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm font-bold text-red-900">{message}</p>}

      <section className="grid gap-6 lg:grid-cols-[0.72fr_0.28fr]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 grid grid-cols-3 gap-2">
            {['Service', 'Details', 'Provider'].map((label, index) => (
              <button key={label} onClick={() => setStep(index + 1)} className={`rounded-xl px-3 py-2 text-xs font-black ${step === index + 1 ? 'bg-slate-950 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {index + 1}. {label}
              </button>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-950">What service do you need?</h3>
              <select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none">
                {serviceCategories.map((category) => <option key={category.id} value={category.name}>{category.name}</option>)}
              </select>
              <div className="grid gap-2 sm:grid-cols-2">
                {requestTemplates.map((template) => (
                  <button
                    key={template}
                    type="button"
                    onClick={() => applyTemplate(template)}
                    className={`rounded-xl border px-4 py-3 text-left text-sm font-black transition ${form.title === template ? 'border-amber-300 bg-amber-50 text-red-900' : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-white'}`}
                  >
                    {template}
                  </button>
                ))}
              </div>
              <Input label="Service Title" value={form.title} onChange={(value) => setForm({ ...form, title: value })} placeholder="Example: AC not cooling, need repair" />
              <button disabled={!canContinueDetails} onClick={() => setStep(2)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:bg-slate-300">
                Continue
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-slate-950">Add location, time and requirement</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="City" value={form.city} onChange={(value) => setForm({ ...form, city: value })} />
                <Input label="Address" value={form.address} onChange={(value) => setForm({ ...form, address: value })} />
                <Input label="Preferred Date" type="date" value={form.preferredDate} onChange={(value) => setForm({ ...form, preferredDate: value })} />
                <Input label="Budget" value={form.budgetLabel} onChange={(value) => setForm({ ...form, budgetLabel: value })} placeholder="Rs 500-1000 or open quote" />
                <label className="block">
                  <span className="text-sm font-bold text-slate-600">Time Slot</span>
                  <select value={form.preferredTimeSlot} onChange={(event) => setForm({ ...form, preferredTimeSlot: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none">
                    <option>Morning</option>
                    <option>Afternoon</option>
                    <option>Evening</option>
                    <option>Any time</option>
                  </select>
                </label>
                <label className="block">
                  <span className="text-sm font-bold text-slate-600">Urgency</span>
                  <select value={form.urgency} onChange={(event) => setForm({ ...form, urgency: event.target.value })} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-bold outline-none">
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                    <option value="emergency">Emergency</option>
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="text-sm font-bold text-slate-600">Requirement</span>
                <textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows={5} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none" placeholder="Describe the problem, size, timing, and any special requirement." />
              </label>
              <button onClick={() => setStep(3)} className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white">
                Compare Providers
                <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-2xl font-black text-slate-950">Compare matching providers</h3>
              <div className="mt-5 grid gap-3 md:grid-cols-2">
                {matchingProviders.map((provider) => (
                  <button key={provider._id} onClick={() => setForm({ ...form, provider: provider.user?._id })} className={`rounded-2xl border p-4 text-left ${form.provider === provider.user?._id ? 'border-amber-400 bg-amber-50' : 'border-slate-200 bg-slate-50'}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="font-black text-slate-950">{provider.businessName || provider.user?.name}</h4>
                        <p className="mt-1 text-sm font-bold text-red-900">{provider.category} | {provider.city}</p>
                      </div>
                      {form.provider === provider.user?._id && <CheckCircle2 size={20} className="text-red-900" />}
                    </div>
                    <p className="mt-3 text-sm font-medium text-slate-600">{provider.skills?.join(', ') || 'Trusted professional'}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge icon={ShieldCheck} text={provider.isApproved ? 'Verified' : 'Pending'} />
                      <Badge icon={Sparkles} text={provider.rating ? `${provider.rating}/5` : 'New'} />
                      <Badge icon={MapPin} text={provider.rate || 'Custom quote'} />
                      <Badge icon={CalendarClock} text={provider.responseTimeLabel || '24h response'} />
                    </div>
                  </button>
                ))}
                {matchingProviders.length === 0 && <p className="rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm font-bold text-slate-500">No exact provider match. Submit as open request.</p>}
              </div>
              <button disabled={!canSubmit} onClick={submit} className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-950 px-5 py-3 text-sm font-black text-white hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                <ClipboardCheck size={17} />
                Create Trackable Booking Request
              </button>
            </div>
          )}
        </div>

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-black text-slate-950">Booking Summary</h3>
          <div className="mt-5 space-y-3">
            <Summary icon={Search} label="Service" value={form.title || form.category} />
            <Summary icon={MapPin} label="Location" value={`${form.city}${form.address ? `, ${form.address}` : ''}`} />
            <Summary icon={CalendarClock} label="Schedule" value={`${form.preferredDate || 'Flexible'} | ${form.preferredTimeSlot}`} />
            <Summary icon={Sparkles} label="Budget" value={form.budgetLabel || 'Open quote'} />
            <Summary icon={ShieldCheck} label="Provider" value={selectedProvider ? (selectedProvider.businessName || selectedProvider.user?.name) : 'Open to matching providers'} />
          </div>
        </aside>
      </section>
    </div>
  );
};

const Input = ({ label, value, onChange, type = 'text', placeholder = '' }) => (
  <label className="block">
    <span className="text-sm font-bold text-slate-600">{label}</span>
    <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 font-semibold outline-none" />
  </label>
);

const Badge = ({ icon: Icon, text }) => (
  <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-black text-slate-700 ring-1 ring-slate-200">
    <Icon size={13} />
    {text}
  </span>
);

const Summary = ({ icon: Icon, label, value }) => (
  <div className="rounded-2xl bg-slate-50 p-4">
    <p className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-slate-400">
      <Icon size={14} />
      {label}
    </p>
    <p className="mt-2 text-sm font-black text-slate-900">{value || '-'}</p>
  </div>
);

export default TakerBookingAssistant;
