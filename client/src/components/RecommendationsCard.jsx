import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import LoadingSpinner from './LoadingSpinner';

const RecommendationsCard = ({ preferences }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (preferences) {
      fetchRecommendations();
    }
  }, [preferences]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams(preferences);
      const response = await axios.get(
        `${API_BASE_URL}/analytics/recommendations?${params}`
      );
      setRecommendations(response.data.recommendations || []);
    } catch (err) {
      setError('Failed to fetch recommendations');
    }
    setLoading(false);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">🤖</span>
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Destinations recommandées
        </h3>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded mb-4">
          {error}
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600"
            >
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100">
                  {rec.destination}
                </h4>
                <span className="text-lg">🌟 {rec.score}/10</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                {rec.reason}
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Temp:</span> {rec.temp}°C
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Humidité:</span> {rec.humidity}%
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          Entrez vos préférences pour voir les recommandations
        </p>
      )}
    </div>
  );
};

export default RecommendationsCard;
