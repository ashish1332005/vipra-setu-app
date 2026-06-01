import { useEffect, useState } from 'react';
import { BadgeCheck, FileCheck2, XCircle } from 'lucide-react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const ProvidersModeration = () => {
  const [profiles, setProfiles] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    api.get('/admin/providers')
      .then(({ data }) => setProfiles(data.profiles))
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load providers')));
  };

  useEffect(load, []);

  const action = async (path, body = {}) => {
    try {
      await api.patch(path, body);
      setMessage('Provider updated.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to update provider'));
    }
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Provider Approval & KYC</h1>
        <p className="mt-1 text-slate-500">Approve/reject providers, verify KYC, and review subscription status.</p>
      </div>
      {message && <p className="mb-4 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</p>}
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <article key={profile._id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
              <div>
                <h2 className="text-lg font-black text-slate-950">{profile.businessName || profile.user?.name}</h2>
                <p className="mt-1 text-sm font-bold text-orange-700">{profile.category} | {profile.city}</p>
                <p className="mt-2 text-sm text-slate-500">{profile.user?.email} | {profile.user?.phone}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Badge label={profile.isApproved ? 'Approved' : 'Pending approval'} tone={profile.isApproved ? 'green' : 'amber'} />
                  <Badge label={`KYC: ${profile.kyc?.status || 'not_submitted'}`} tone="blue" />
                  <Badge label={`Plan: ${profile.subscription?.status || 'inactive'}`} tone="slate" />
                  <Badge label={`${profile.subscription?.leadCredits || 0} credits`} tone="slate" />
                </div>
                {profile.kyc?.documentNumber && (
                  <p className="mt-3 text-xs font-bold text-slate-500">
                    {profile.kyc.documentType}: {profile.kyc.documentNumber}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => action(`/admin/providers/${profile.user?._id}/approve`, { note: 'Approved by admin' })} className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-black text-white">
                  <BadgeCheck size={16} />
                  Approve
                </button>
                <button onClick={() => action(`/admin/providers/${profile.user?._id}/reject`, { note: 'Please complete profile/KYC details' })} className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-black text-red-700">
                  <XCircle size={16} />
                  Reject
                </button>
                <button onClick={() => action(`/admin/providers/${profile.user?._id}/kyc`, { status: 'verified', note: 'KYC verified' })} className="inline-flex items-center gap-2 rounded-xl bg-blue-50 px-4 py-2 text-sm font-black text-blue-700">
                  <FileCheck2 size={16} />
                  Verify KYC
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

const Badge = ({ label, tone }) => {
  const tones = {
    green: 'bg-emerald-100 text-emerald-800',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
    slate: 'bg-slate-100 text-slate-700',
  };
  return <span className={`rounded-full px-3 py-1 text-xs font-black ${tones[tone]}`}>{label}</span>;
};

export default ProvidersModeration;
