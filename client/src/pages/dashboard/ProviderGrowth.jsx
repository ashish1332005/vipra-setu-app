import { useEffect, useState } from 'react';
import { BadgeCheck, FileCheck2, Rocket, Upload } from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const ProviderGrowth = () => {
  const [profile, setProfile] = useState(null);
  const [kyc, setKyc] = useState({ documentType: 'Aadhaar', documentNumber: '', documentUrl: '', documentFile: null });
  const [message, setMessage] = useState('');

  const load = () => {
    api.get('/providers/me')
      .then(({ data }) => setProfile(data.profile))
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load verification center')));
  };

  useEffect(load, []);

  const submitKyc = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/providers/me/kyc', kyc);
      setMessage('KYC submitted for admin review.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to submit KYC'));
    }
  };

  const handleKycFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setKyc((current) => ({
        ...current,
        documentFile: {
          name: file.name,
          type: file.type,
          dataUrl: reader.result,
        },
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-orange-700">
            <Rocket size={23} />
          </span>
          <div>
            <h2 className="text-2xl font-black text-slate-950">Provider Verification Center</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
              Complete KYC and keep your provider profile ready for admin approval.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <StatusTile label="Approval" value={profile?.isApproved ? 'Approved' : 'Pending'} icon={BadgeCheck} />
          <StatusTile label="KYC" value={profile?.kyc?.status || 'not_submitted'} icon={FileCheck2} />
        </div>

        {message && <p className="mt-5 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-700">{message}</p>}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-black text-slate-950">KYC / Document Verification</h3>
        <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
          Upload a valid document so admin can verify your provider account.
        </p>
        <form onSubmit={submitKyc} className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <select value={kyc.documentType} onChange={(event) => setKyc({ ...kyc, documentType: event.target.value })} className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none">
              <option>Aadhaar</option>
              <option>PAN</option>
              <option>Business License</option>
              <option>Other</option>
            </select>
            <input value={kyc.documentNumber} onChange={(event) => setKyc({ ...kyc, documentNumber: event.target.value })} placeholder="Document number" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none" />
            <input value={kyc.documentUrl} onChange={(event) => setKyc({ ...kyc, documentUrl: event.target.value })} placeholder="Document URL" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold outline-none" />
          </div>
          <label className="mt-3 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm font-bold text-slate-600">
            <span>{kyc.documentFile?.name || 'Upload JPG, PNG, WEBP, or PDF document'}</span>
            <input type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handleKycFile} className="sr-only" />
            <Upload size={16} />
          </label>
          <button className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-950 px-5 py-3 text-sm font-black text-white hover:bg-orange-700">
            <Upload size={16} />
            Submit KYC
          </button>
        </form>
      </section>
    </div>
  );
};

const StatusTile = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-sm font-bold text-slate-500">{label}</p>
      <Icon size={18} className="text-orange-600" />
    </div>
    <p className="mt-3 text-xl font-black capitalize text-slate-950">{value}</p>
  </div>
);

export default ProviderGrowth;
