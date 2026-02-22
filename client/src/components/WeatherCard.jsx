import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addFavorite, selectIsFavorite } from '../features/favorites/favoritesSlice';
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
    dispatch(addFavorite(name));
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
      <div className="card bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* En-tête avec fond dégradé */}
        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/30 dark:to-cyan-900/30 p-6 mb-6 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {name}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 font-medium">
                {sys.country}
              </p>
              <p className="text-gray-700 dark:text-gray-300 mt-2 capitalize text-sm">
                {weather[0].description}
              </p>
            </div>
            <div className="text-6xl sm:text-7xl drop-shadow-lg">{weatherIcon}</div>
          </div>
        </div>

        {/* Température principale */}
        <div className="mb-6 px-6">
          <div className="flex items-baseline gap-1">
            <span className="text-6xl sm:text-7xl font-bold bg-gradient-to-br from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              {temperature}°
            </span>
            <span className="text-2xl text-gray-600 dark:text-gray-400">C</span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Ressenti : {feelsLike}°C
          </p>
        </div>

        {/* Informations détaillées en grille */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 px-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800 text-center hover:bg-blue-100 dark:hover:bg-blue-900/30 transition">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Humidité</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{main.humidity}%</p>
          </div>
          <div className="bg-teal-50 dark:bg-teal-900/20 p-3 rounded-lg border border-teal-200 dark:border-teal-800 text-center hover:bg-teal-100 dark:hover:bg-teal-900/30 transition">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Vent</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{wind.speed} m/s</p>
          </div>
          <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg border border-amber-200 dark:border-amber-800 text-center hover:bg-amber-100 dark:hover:bg-amber-900/30 transition">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Min/Max</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{Math.round(main.temp_min)}°/{Math.round(main.temp_max)}°</p>
          </div>
          <div className="bg-rose-50 dark:bg-rose-900/20 p-3 rounded-lg border border-rose-200 dark:border-rose-800 text-center hover:bg-rose-100 dark:hover:bg-rose-900/30 transition">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Pression</p>
            <p className="font-bold text-gray-900 dark:text-white text-sm">{main.pressure}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            {!isFavorite ? (
              <button
                onClick={handleAddToFavorites}
                className="rounded-lg bg-yellow-200 hover:bg-yellow-300 text-yellow-900 text-sm font-bold px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200"
              >
                Épingler
              </button>
            ) : (
              <button
                disabled
                className="rounded-lg bg-green-200 text-green-900 text-sm font-bold px-4 py-3 cursor-not-allowed"
              >
                Épinglée
              </button>
            )}
            <button
              onClick={handleViewDetails}
              className="rounded-lg bg-cyan-200 hover:bg-cyan-300 text-cyan-900 text-sm font-bold px-4 py-3 shadow-md hover:shadow-lg transition-all duration-200"
            >
              Détails
            </button>
          </div>
          
          <button
            onClick={handlePlanTravel}
            className="w-full rounded-lg bg-green-200 hover:bg-green-300 text-green-900 text-sm font-bold px-6 py-3 shadow-md hover:shadow-lg transition-all duration-200"
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
