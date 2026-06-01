import { useEffect, useState } from 'react';
import api from '../../services/api';
import { getApiErrorMessage } from '../../utils/apiError';

const TrustManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [reports, setReports] = useState([]);
  const [message, setMessage] = useState('');

  const load = () => {
    Promise.all([api.get('/admin/reviews'), api.get('/admin/reports')])
      .then(([reviewRes, reportRes]) => {
        setReviews(reviewRes.data.reviews);
        setReports(reportRes.data.reports);
      })
      .catch((err) => setMessage(getApiErrorMessage(err, 'Unable to load trust center')));
  };

  useEffect(load, []);

  const patch = async (url, body) => {
    try {
      await api.patch(url, body);
      setMessage('Updated.');
      load();
    } catch (err) {
      setMessage(getApiErrorMessage(err, 'Unable to update'));
    }
  };

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {message && <p className="xl:col-span-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700">{message}</p>}
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Review Moderation</h1>
        <div className="mt-5 space-y-3">
          {reviews.map((review) => (
            <article key={review._id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{review.rating}/5 · {review.provider?.name}</p>
                  <p className="mt-1 text-sm text-slate-600">{review.comment || 'No comment'}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">By {review.serviceTaker?.name || '-'}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black">{review.status}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => patch(`/admin/reviews/${review._id}/moderation`, { status: 'approved' })} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white">Approve</button>
                <button onClick={() => patch(`/admin/reviews/${review._id}/moderation`, { status: 'rejected', adminNote: 'Rejected by admin' })} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700">Reject</button>
              </div>
            </article>
          ))}
          {reviews.length === 0 && <p className="text-sm text-slate-500">No reviews yet.</p>}
        </div>
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Reports & Disputes</h1>
        <div className="mt-5 space-y-3">
          {reports.map((report) => (
            <article key={report._id} className="rounded-xl bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-bold text-slate-900">{report.reason}</p>
                  <p className="mt-1 text-sm text-slate-600">{report.details || 'No details'}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">Reporter: {report.reporter?.name || '-'}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-black">{report.status}</span>
              </div>
              <div className="mt-3 flex gap-2">
                <button onClick={() => patch(`/admin/reports/${report._id}`, { status: 'reviewing' })} className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-black text-white">Reviewing</button>
                <button onClick={() => patch(`/admin/reports/${report._id}`, { status: 'resolved', adminNote: 'Resolved by admin' })} className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-black text-white">Resolve</button>
                <button onClick={() => patch(`/admin/reports/${report._id}`, { status: 'dismissed' })} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-black text-red-700">Dismiss</button>
              </div>
            </article>
          ))}
          {reports.length === 0 && <p className="text-sm text-slate-500">No reports yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default TrustManagement;
