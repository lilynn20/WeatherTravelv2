import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTrip } from '../features/travelPlans/tripsSlice';
import { addNotification } from '../features/notifications/notificationsSlice';

const emptyLeg = () => ({ city: '', startDate: '', endDate: '', notes: '' });

const ItineraryBuilder = ({ onClose }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((s) => s.auth.isAuthenticated);
  const [title, setTitle] = useState('');
  const [legs, setLegs] = useState([emptyLeg()]);
  const [loading, setLoading] = useState(false);

  const updateLeg = (i, field, value) => {
    setLegs((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  const addLeg = () => setLegs((prev) => [...prev, emptyLeg()]);
  const removeLeg = (i) => setLegs((prev) => prev.filter((_, idx) => idx !== i));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      dispatch(addNotification({ message: 'Please log in to save itineraries.', type: 'error' }));
      return;
    }
    if (!title.trim()) return;
    const validLegs = legs.filter((l) => l.city.trim());
    if (validLegs.length === 0) return;

    setLoading(true);
    const result = await dispatch(createTrip({
      title: title.trim(),
      legs: validLegs.map((l, i) => ({ ...l, order: i })),
      city: validLegs[0].city,
      startDate: validLegs[0].startDate || undefined,
      endDate: validLegs[validLegs.length - 1].endDate || undefined,
    }));
    setLoading(false);

    if (result.type.endsWith('/fulfilled')) {
      dispatch(addNotification({ message: `Itinerary "${title}" saved!`, type: 'success' }));
      onClose?.();
    } else {
      dispatch(addNotification({ message: result.payload || 'Failed to save itinerary.', type: 'error' }));
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200/60 dark:border-slate-700/60 p-6 max-w-2xl w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">🗺 Build Itinerary</h2>
        {onClose && (
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xl">×</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Trip title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. European Summer 2026"
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Cities / Legs</label>
          {legs.map((leg, i) => (
            <div key={i} className="flex flex-col gap-2 p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <input
                  type="text"
                  value={leg.city}
                  onChange={(e) => updateLeg(i, 'city', e.target.value)}
                  placeholder="City name *"
                  className="flex-1 px-3 py-1.5 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  required={i === 0}
                />
                {legs.length > 1 && (
                  <button type="button" onClick={() => removeLeg(i)} className="text-red-400 hover:text-red-600 text-sm px-2">✕</button>
                )}
              </div>
              <div className="flex gap-2 pl-8">
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">From</label>
                  <input type="date" value={leg.startDate} onChange={(e) => updateLeg(i, 'startDate', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">To</label>
                  <input type="date" value={leg.endDate} onChange={(e) => updateLeg(i, 'endDate', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
                </div>
              </div>
              <div className="pl-8">
                <input type="text" value={leg.notes} onChange={(e) => updateLeg(i, 'notes', e.target.value)}
                  placeholder="Notes (optional)"
                  className="w-full px-2 py-1 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-1 focus:ring-primary" />
              </div>
            </div>
          ))}

          <button type="button" onClick={addLeg}
            className="w-full py-2 border-2 border-dashed border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 rounded-xl text-sm hover:border-primary hover:text-primary transition">
            + Add city
          </button>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold py-2 rounded-xl transition disabled:opacity-60">
            {loading ? 'Saving…' : 'Save Itinerary'}
          </button>
          {onClose && (
            <button type="button" onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ItineraryBuilder;
