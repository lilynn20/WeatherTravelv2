import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentWeather, fetchForecast } from '../features/weather/weatherSlice';
import { addFavorite, selectIsFavorite } from '../features/favorites/favoritesSlice';
import { addNotification } from '../features/notifications/notificationsSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { WEATHER_ICONS } from '../utils/constants';

/**
 * Page CityDetail
 * Affiche les détails météo complets d'une ville avec prévisions
 */
const CityDetail = () => {
  const { name } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentWeather, forecast, loading, error } = useSelector((state) => state.weather);
  const isFavorite = useSelector(state => 
    selectIsFavorite(state, currentWeather?.id)
  );

  // Récupère les données au montage du composant
  useEffect(() => {
    if (name) {
      dispatch(fetchCurrentWeather(name));
      dispatch(fetchForecast(name));
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

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Bouton retour */}
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary mb-6"
        >
          ← Retour
        </button>

        {/* En-tête avec météo actuelle */}
        <div className="card mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Colonne gauche - Info principale */}
            <div>
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2">
                <span className="accent-dot bg-sky-300/80"></span>
                Meteo du jour
              </div>
              <h1 className="text-4xl md:text-5xl brand-script text-slate-900 dark:text-slate-100 mb-2">
                {currentWeather.name}, {currentWeather.sys.country}
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 capitalize mb-6">
                {currentWeather.weather[0].description}
              </p>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="text-8xl">{weatherIcon}</div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-7xl font-bold text-gray-900 dark:text-white">
                      {Math.round(currentWeather.main.temp)}°
                    </span>
                    <span className="text-3xl text-gray-600 dark:text-gray-400">C</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Ressenti : {Math.round(currentWeather.main.feels_like)}°C
                  </p>
                </div>
              </div>

              {!isFavorite && (
                <button
                  onClick={handleAddToFavorites}
                  className="btn-primary w-full"
                >
                  ⭐ Épingler cette ville
                </button>
              )}
            </div>

            {/* Colonne droite - Détails */}
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-3xl mb-2">🌡️</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Min / Max</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {Math.round(currentWeather.main.temp_min)}° / {Math.round(currentWeather.main.temp_max)}°
                </p>
              </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-3xl mb-2">💧</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Humidité</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{currentWeather.main.humidity}%</p>
              </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-3xl mb-2">🌬️</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vent</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{currentWeather.wind.speed} m/s</p>
              </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-3xl mb-2">🔽</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pression</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{currentWeather.main.pressure} hPa</p>
              </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-3xl mb-2">👁️</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Visibilité</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">
                  {currentWeather.visibility ? `${currentWeather.visibility / 1000} km` : 'N/A'}
                </p>
              </div>
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div className="text-3xl mb-2">☁️</div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Nébulosité</p>
                <p className="text-xl font-bold text-gray-900 dark:text-white">{currentWeather.clouds.all}%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Prévisions sur 5 jours */}
        {dailyForecasts.length > 0 && (
          <div className="card">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              📅 Prévisions sur 5 jours
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {dailyForecasts.map((day) => {
                const icon = WEATHER_ICONS[day.weather[0]?.icon] || '🌤️';
                return (
                  <div
                    key={day.dt}
                    className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg text-center hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <p className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                      {formatDate(day.dt)}
                    </p>
                    <div className="text-4xl mb-2">{icon}</div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {Math.round(day.main.temp)}°C
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mb-2">
                      {day.weather[0].description}
                    </p>
                    <div className="flex justify-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                      <span>💧 {day.main.humidity}%</span>
                      <span>🌬️ {day.wind.speed}m/s</span>
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
