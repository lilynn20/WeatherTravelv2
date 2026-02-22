import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const ForecastScoresCard = ({ city }) => {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (city) {
      fetchForecast();
    }
  }, [city]);

  const fetchForecast = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_BASE_URL}/analytics/forecast/${city}`);
      setForecast(response.data);
    } catch (err) {
      setError('Failed to fetch forecast scores');
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 8) return 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300';
    if (score >= 6) return 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300';
    if (score >= 4) return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300';
    return 'bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300';
  };

  if (!city) return null;
  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Prochains 5 jours : {city}
        </h3>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded mb-4">
          {error}
        </div>
      )}

      {forecast && forecast.forecast && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {forecast.forecast.map((day, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  {new Date(day.date).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h4>
                <span className={`px-3 py-1 rounded-full font-bold ${getScoreColor(day.travelScore)}`}>
                  Score: {day.travelScore}/10
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Temp:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {day.temp}°C
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Condition:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {day.condition}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600 dark:text-slate-400">Pluie:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">
                    {day.precipProbability}%
                  </span>
                </div>
                {day.recommendation && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-2 border-t border-slate-200 dark:border-slate-600 mt-2">
                    💡 {day.recommendation}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ForecastScoresCard;
