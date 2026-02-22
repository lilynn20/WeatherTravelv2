import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchCurrentWeather, fetchForecast } from '../features/weather/weatherSlice';
import { addFavorite, selectIsFavorite } from '../features/favorites/favoritesSlice';
import { addNotification } from '../features/notifications/notificationsSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { WEATHER_ICONS, API_BASE_URL } from '../utils/constants';
import { getStoredSettings, getTempUnitLabel, getWindUnitLabel } from '../utils/settings';

/**
 * Page CityDetail
 * Affiche les détails météo complets d'une ville avec prévisions
 */
const CityDetail = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [analyticsForecast, setAnalyticsForecast] = useState(null);
  const [forecastLoading, setForecastLoading] = useState(false);
  
  const { currentWeather, forecast, loading, error } = useSelector((state) => state.weather);
  const isFavorite = useSelector(state => 
    selectIsFavorite(state, currentWeather?.id)
  );

  // Récupère les données au montage du composant
  useEffect(() => {
    if (name) {
      dispatch(fetchCurrentWeather(name));
      dispatch(fetchForecast(name));
      
      // Fetch analytics forecast with travel scores
      const fetchAnalyticsForecast = async () => {
        try {
          setForecastLoading(true);
          const { units, language } = getStoredSettings();
          const response = await axios.get(`${API_BASE_URL}/analytics/forecast/${name}`, {
            params: { units, lang: language },
          });
          setAnalyticsForecast(response.data.dailyForecasts);
        } catch (err) {
          console.error('Failed to fetch analytics forecast:', err);
        } finally {
          setForecastLoading(false);
        }
      };
      
      fetchAnalyticsForecast();
    }
  }, [dispatch, name]);

  /**
   * Ajoute la ville aux favoris
   */
  const handleAddToFavorites = () => {
    if (currentWeather) {
      dispatch(addFavorite(currentWeather.name));
      dispatch(
        addNotification({
          message: `${currentWeather.name} ajoutée aux destinations avec succès.`,
        })
      );
    }
  };

  /**
   * Formate une date timestamp
   */
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  /**
   * Formate une heure
   */
  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Filtre les prévisions pour obtenir une par jour (midi)
   */
  const getDailyForecasts = () => {
    if (!forecast?.list) return [];
    
    // Groupe par jour et prend la prévision de midi
    const daily = {};
    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const day = date.toDateString();
      const hour = date.getHours();
      
      // Prend la prévision la plus proche de midi
      if (!daily[day] || Math.abs(hour - 12) < Math.abs(new Date(daily[day].dt * 1000).getHours() - 12)) {
        daily[day] = item;
      }
    });
    
    return Object.values(daily).slice(0, 5);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Chargement des données météo..." />
      </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <ErrorMessage 
            error={error} 
            onRetry={() => navigate('/')} 
          />
          <button
            onClick={() => navigate('/')}
            className="btn-secondary mt-4"
          >
            ← Retour à la recherche
          </button>
        </div>
      </div>
    );
  }

  if (!currentWeather) {
    return null;
  }

  const weatherIcon = WEATHER_ICONS[currentWeather.weather[0]?.icon] || '🌤️';
  const dailyForecasts = getDailyForecasts();
  const { units } = getStoredSettings();
  const tempUnit = getTempUnitLabel(units);
  const windUnit = getWindUnitLabel(units);
  
  // Calculate min/max for the next 24 hours from now
  const calculateMinMax = () => {
    if (!forecast?.list || forecast.list.length === 0) {
      return { min: currentWeather.main.temp_min, max: currentWeather.main.temp_max };
    }

    const now = currentWeather.dt;
    const windowEnd = now + 24 * 60 * 60;
    const next24hItems = forecast.list.filter(item => item.dt >= now && item.dt <= windowEnd);
    const targetItems = next24hItems.length > 0 ? next24hItems : forecast.list.slice(0, 8);

    const temps = targetItems.map(item => item.main.temp);
    temps.push(currentWeather.main.temp);

    return {
      min: Math.round(Math.min(...temps)),
      max: Math.round(Math.max(...temps))
    };
  };
  
  const { min: minTemp, max: maxTemp } = calculateMinMax();

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="bg-blue-200 hover:bg-blue-300 text-blue-900 font-semibold px-6 py-2 rounded-lg transition-all duration-200 mb-6"
        >
          Retour
        </button>

        {/* En-tête avec météo actuelle */}
        <div className="card bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Colonne gauche - Info principale */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-8 rounded-lg">
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 mb-3">
                <span className="accent-dot bg-blue-400"></span>
                Météo du jour
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white mb-2">
                {currentWeather.name}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-1 font-medium">
                {currentWeather.sys.country}
              </p>
              <p className="text-base text-slate-600 dark:text-slate-300 capitalize mb-6 border-b border-slate-200 dark:border-slate-700 pb-4">
                {currentWeather.weather[0].description}
              </p>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="text-7xl drop-shadow-lg">{weatherIcon}</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-8xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                      {Math.round(currentWeather.main.temp)}°
                    </span>
                    <span className="text-3xl text-gray-600 dark:text-gray-400">{tempUnit}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-3">
                    🌡️ Ressenti : {Math.round(currentWeather.main.feels_like)}°{tempUnit}
                  </p>
                </div>
              </div>

              {!isFavorite && (
                <button
                  onClick={handleAddToFavorites}
                  className="w-full bg-yellow-200 hover:bg-yellow-300 text-yellow-900 font-bold py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Épingler cette ville
                </button>
              )}
              {isFavorite && (
                <div className="w-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-lg text-center">
                  Ville épinglée
                </div>
              )}
            </div>

            {/* Colonne droite - Détails */}
            <div className="grid grid-cols-2 gap-4 p-8">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800 hover:shadow-lg transition">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Min / Max</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {minTemp}° / {maxTemp}°{tempUnit}
                </p>
              </div>
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800 hover:shadow-lg transition">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Humidité</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{currentWeather.main.humidity}%</p>
              </div>
              <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-lg border border-teal-200 dark:border-teal-800 hover:shadow-lg transition">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Vent</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{currentWeather.wind.speed} {windUnit}</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800 hover:shadow-lg transition">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Pression</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{currentWeather.main.pressure} hPa</p>
              </div>
              <div className="bg-sky-50 dark:bg-sky-900/20 p-4 rounded-lg border border-sky-200 dark:border-sky-800 hover:shadow-lg transition">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Visibilité</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {currentWeather.visibility ? `${(currentWeather.visibility / 1000).toFixed(1)} km` : 'N/A'}
                </p>
              </div>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-lg transition">
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium mb-1">Nébulosité</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{currentWeather.clouds.all}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prévisions avec scores de voyage */}
        {analyticsForecast && analyticsForecast.length > 0 && (
          <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-8 border border-slate-200 dark:border-slate-700">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-8">
              14-Day Forecast
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {analyticsForecast.map((day, idx) => {
                const getScoreColor = (score) => {
                  if (score >= 8.5) return {
                    bg: 'bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/30',
                    badge: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800',
                    border: 'border-emerald-200 dark:border-emerald-700'
                  };
                  if (score >= 7.5) return {
                    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30',
                    badge: 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800',
                    border: 'border-blue-200 dark:border-blue-700'
                  };
                  if (score >= 6.5) return {
                    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/30',
                    badge: 'bg-cyan-100 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800',
                    border: 'border-cyan-200 dark:border-cyan-700'
                  };
                  if (score >= 6.0) return {
                    bg: 'bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/30 dark:to-yellow-800/30',
                    badge: 'bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
                    border: 'border-yellow-200 dark:border-yellow-700'
                  };
                  if (score >= 5.0) return {
                    bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30',
                    badge: 'bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800',
                    border: 'border-orange-200 dark:border-orange-700'
                  };
                  return {
                    bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30',
                    badge: 'bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800',
                    border: 'border-red-200 dark:border-red-700'
                  };
                };

                const colors = getScoreColor(day.avgTravelScore);
                
                return (
                  <div
                    key={idx}
                    className={`${colors.bg} p-5 rounded-xl hover:shadow-xl transition-all duration-300 border-2 ${colors.border} hover:scale-105 cursor-pointer`}
                  >
                    <p className="font-semibold text-slate-800 dark:text-slate-200 mb-3 text-sm uppercase tracking-wide">
                      {new Date(day.date).toLocaleDateString('fr-FR', {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'short'
                      })}
                    </p>
                    <p className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
                      {day.temp}°{tempUnit}
                    </p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 capitalize mb-4 font-medium">
                      {day.condition}
                    </p>
                    <div className={`px-3 py-2 rounded-lg text-xs font-bold text-center mb-3 ${colors.badge}`}>
                      Score: {day.avgTravelScore.toFixed(1)}/10
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 italic mb-4 leading-relaxed">
                      {day.recommendation}
                    </p>
                    <div className="bg-white/50 dark:bg-slate-900/50 rounded-lg p-3 border border-slate-200 dark:border-slate-600 flex justify-between gap-2">
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {day.hourlyData?.[0]?.humidity || 'N/A'}% humidity
                      </span>
                      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                        {day.hourlyData?.[0]?.windSpeed.toFixed(1) || 'N/A'} {windUnit} wind
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CityDetail;
