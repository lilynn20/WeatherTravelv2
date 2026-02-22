import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addCity, selectIsFavorite } from '../features/favorites/favoritesSlice';
import { addNotification } from '../features/notifications/notificationsSlice';
import { WEATHER_ICONS } from '../utils/constants';
import TravelDateModal from './TravelDateModal';

/**
 * Composant WeatherCard
 * Affiche les informations météo d'une ville
 * @param {Object} weatherData - Données météo de l'API
 */
const WeatherCard = ({ weatherData }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showTravelModal, setShowTravelModal] = useState(false);
  
  const isFavorite = useSelector(state => 
    selectIsFavorite(state, weatherData?.id)
  );

  if (!weatherData) return null;

  const {
    id,
    name,
    sys,
    main,
    weather,
    wind,
  } = weatherData;

  const weatherIcon = WEATHER_ICONS[weather[0]?.icon] || '🌤️';
  const temperature = Math.round(main.temp);
  const feelsLike = Math.round(main.feels_like);

  /**
   * Ajoute la ville aux favoris
   */
  const handleAddToFavorites = () => {
    const cityData = {
      id,
      name,
      country: sys.country,
      temp: temperature,
      weather: weather[0].main,
      description: weather[0].description,
      icon: weather[0].icon,
      humidity: main.humidity,
      windSpeed: wind.speed,
    };
    dispatch(addCity(cityData));
    dispatch(
      addNotification({
        message: `${name} ajoutée aux destinations avec succès.`,
      })
    );
  };

  /**
   * Navigation vers les détails
   */
  const handleViewDetails = () => {
    navigate(`/city/${name}`);
  };

  /**
   * Ouvrir le modal de planification
   */
  const handlePlanTravel = () => {
    setShowTravelModal(true);
  };

  // Préparer les données pour le modal
  const cityDataForModal = {
    id,
    name,
    country: sys.country,
    weather: {
      temp: temperature,
      feelsLike: feelsLike,
      description: weather[0].description,
      humidity: main.humidity,
      windSpeed: wind.speed,
    },
  };

  return (
    <>
      <div className="card">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white">
              {name}, {sys.country}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1 capitalize">
              {weather[0].description}
            </p>
          </div>
          <div className="text-5xl sm:text-6xl">{weatherIcon}</div>
        </div>

        {/* Température principale */}
        <div className="mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white">
              {temperature}°
            </span>
            <span className="text-2xl text-gray-600 dark:text-gray-400">C</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Ressenti : {feelsLike}°C
          </p>
        </div>

        {/* Informations détaillées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💧</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Humidité</p>
              <p className="font-semibold text-gray-900 dark:text-white">{main.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌬️</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Vent</p>
              <p className="font-semibold text-gray-900 dark:text-white">{wind.speed} m/s</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌡️</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Min / Max</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {Math.round(main.temp_min)}° / {Math.round(main.temp_max)}°
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">🔽</span>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Pression</p>
              <p className="font-semibold text-gray-900 dark:text-white">{main.pressure} hPa</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {!isFavorite ? (
              <button
                onClick={handleAddToFavorites}
                className="flex-1 rounded-full bg-primary/90 text-white text-sm font-semibold px-6 py-3 shadow-sm"
              >
                Epingler cette ville
              </button>
            ) : (
              <button
                disabled
                className="flex-1 rounded-full border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 text-slate-500 text-sm font-semibold px-6 py-3 cursor-not-allowed"
              >
                Deja epinglee
              </button>
            )}
            <button
              onClick={handleViewDetails}
              className="w-full sm:w-auto rounded-full border border-slate-200/70 dark:border-slate-700/60 bg-white/70 dark:bg-slate-900/60 text-slate-700 dark:text-slate-200 text-sm font-semibold px-5 py-3"
            >
              Voir details
            </button>
          </div>
          
          {/* Nouveau bouton Planifier le voyage */}
          <button
            onClick={handlePlanTravel}
            className="w-full rounded-full border border-slate-200/70 dark:border-slate-700/60 bg-white/80 dark:bg-slate-900/70 text-slate-900 dark:text-slate-100 text-sm font-semibold px-6 py-3"
          >
            Planifier un voyage
          </button>
        </div>
      </div>

      {/* Modal de planification */}
      <TravelDateModal
        isOpen={showTravelModal}
        onClose={() => setShowTravelModal(false)}
        cityData={cityDataForModal}
      />
    </>
  );
};

export default WeatherCard;
