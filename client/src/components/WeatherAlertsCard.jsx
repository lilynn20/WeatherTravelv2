import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const WeatherAlertsCard = ({ cityName }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!cityName) return;
    const fetch = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/weather/alerts/${encodeURIComponent(cityName)}`);
        setAlerts(res.data.alerts || []);
      } catch {
        setAlerts([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [cityName]);

  if (loading || alerts.length === 0) return null;

  return (
    <div className="rounded-2xl border border-amber-300/60 bg-amber-50 dark:bg-amber-900/20 p-4 space-y-3">
      <div className="flex items-center gap-2">
        <span className="text-xl">⚠️</span>
        <span className="text-sm font-bold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Weather Alerts</span>
      </div>
      {alerts.map((alert, i) => (
        <div key={i} className="pl-2 border-l-2 border-amber-400">
          <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">{alert.event}</p>
          <p className="text-amber-800 dark:text-amber-300 text-xs mt-0.5">{alert.description?.slice(0, 200)}{alert.description?.length > 200 ? '…' : ''}</p>
        </div>
      ))}
    </div>
  );
};

export default WeatherAlertsCard;
