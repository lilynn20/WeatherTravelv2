import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';
import { getStoredSettings, getTempUnitLabel } from '../utils/settings';
import LoadingSpinner from './LoadingSpinner';

const RecommendationsCard = ({ city }) => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch nearby cities recommendations when city is selected
    if (city) {
      fetchNearestCities();
    }
  }, [city]);

  const fetchNearestCities = async () => {
    setLoading(true);
    setError(null);
    try {
      const { units, language } = getStoredSettings();
      const response = await axios.get(
        `${API_BASE_URL}/analytics/nearby-cities/${encodeURIComponent(city)}`,
        { params: { units, lang: language } }
      );
      // Map API response to expected format
      const mapped = (response.data.nearestCities || []).map((rec) => ({
        destination: rec.name,
        score: rec.travelScore,
        reason: rec.reason,
        temp: rec.weather?.temp || 'N/A',
        humidity: rec.weather?.humidity || 'N/A',
        distance: rec.distance
      }));
      setRecommendations(mapped);
    } catch (err) {
      setError('Failed to fetch nearby cities');
    }
    setLoading(false);
  };

  const handleCityClick = (cityName) => {
    navigate(`/city/${cityName}`);
  };

  if (loading) return <LoadingSpinner />;
  const { units } = getStoredSettings();
  const tempUnit = getTempUnitLabel(units);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
          Cities Near {city}
        </h3>
      </div>

      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded mb-4">
          {error}
        </div>
      )}

      {recommendations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((rec, idx) => (
            <button
              key={idx}
              onClick={() => handleCityClick(rec.destination)}
              className="p-4 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-700/50 dark:to-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-600 hover:border-primary dark:hover:border-primary hover:shadow-lg hover:scale-105 transition-all duration-200 text-left cursor-pointer"
            >
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                  {rec.destination}
                </h4>
                <span className="text-sm text-slate-500">{rec.distance}km away</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 line-clamp-2">
                {rec.reason}
              </p>
              <div className="space-y-1 text-xs border-t border-slate-200 dark:border-slate-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Score:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{rec.score}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Temp:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{rec.temp}°{tempUnit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Humidity:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{rec.humidity}%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-slate-600 dark:text-slate-400">
          No nearby cities found within 100 km.
        </p>
      )}
    </div>
  );
};

export default RecommendationsCard;
