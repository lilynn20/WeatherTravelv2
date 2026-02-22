import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import LoadingSpinner from '../components/LoadingSpinner';

const SharedTrip = () => {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchShared = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/trips/shared/${token}`);
        setTrip(res.data);
      } catch (err) {
        setError(err.response?.data?.error || 'Trip not found or link revoked.');
      } finally {
        setLoading(false);
      }
    };
    fetchShared();
  }, [token]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner /></div>;

  if (error) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Link not found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">{error}</p>
        <Link to="/" className="px-6 py-2 bg-primary text-white rounded-lg font-semibold">Go home</Link>
      </div>
    </div>
  );

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const legs = trip.legs?.length > 0 ? trip.legs : (trip.city ? [{ city: trip.city, startDate: trip.startDate, endDate: trip.endDate, notes: trip.notes }] : []);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400 mb-2">
            <span className="h-1 w-4 rounded-full bg-fuchsia-300/80 inline-block" />
            Shared Trip
          </div>
          <h1 className="text-4xl md:text-5xl brand-script text-slate-900 dark:text-slate-100 mb-1">{trip.title}</h1>
          {trip.notes && <p className="text-slate-600 dark:text-slate-400 mt-2">{trip.notes}</p>}
        </div>

        <div className="space-y-4">
          {legs.map((leg, i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-sm font-bold flex items-center justify-center">{i + 1}</span>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  <Link to={`/city/${leg.city}`} className="hover:text-primary transition">{leg.city}</Link>
                </h2>
              </div>
              {(leg.startDate || leg.endDate) && (
                <p className="text-slate-500 dark:text-slate-400 text-sm ml-10">
                  {formatDate(leg.startDate)} {leg.endDate ? `→ ${formatDate(leg.endDate)}` : ''}
                </p>
              )}
              {leg.notes && <p className="text-slate-600 dark:text-slate-400 text-sm ml-10 mt-1">{leg.notes}</p>}
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link to="/" className="text-primary hover:underline text-sm font-medium">Plan your own trip on WeatherTravel →</Link>
        </div>
      </div>
    </div>
  );
};

export default SharedTrip;
