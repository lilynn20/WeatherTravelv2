import React from 'react';
import { useNavigate } from 'react-router-dom';
import { WEATHER_ICONS } from '../utils/constants';

/**
 * Composant CityCard
 * Carte compacte pour afficher une ville favorite
 * @param {Object} city - Données de la ville favorite
 * @param {function} onRemove - Callback pour supprimer la ville
 */
const CityCard = ({ city, onRemove }) => {
  const navigate = useNavigate();
  const weatherIcon = WEATHER_ICONS[city.icon] || '🌤️';

  /**
   * Navigation vers les détails de la ville
   */
  const handleViewDetails = () => {
    navigate(`/city/${city.name}`);
  };

  /**
   * Formatte la date d'ajout
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div className="card hover:scale-105 transition-transform">
      {/* En-tête avec ville et pays */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800">
            {city.name}
          </h3>
          <p className="text-sm text-gray-500">{city.country}</p>
        </div>
        <div className="text-4xl">{weatherIcon}</div>
      </div>

      {/* Température */}
      <div className="mb-4">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold text-gray-900">
            {Math.round(city.temp)}°
          </span>
          <span className="text-lg text-gray-600">C</span>
        </div>
        <p className="text-sm text-gray-600 capitalize mt-1">
          {city.description}
        </p>
      </div>

      {/* Informations supplémentaires */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-1">
          <span>💧</span>
          <span className="text-gray-600">{city.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🌬️</span>
          <span className="text-gray-600">{city.windSpeed} m/s</span>
        </div>
      </div>

      {/* Date d'ajout */}
      <p className="text-xs text-gray-400 mb-4">
        Ajouté le {formatDate(city.addedAt)}
      </p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleViewDetails}
          className="btn-secondary flex-1 text-sm"
        >
          📊 Détails
        </button>
        <button
          onClick={() => onRemove(city.id)}
          className="btn-danger text-sm"
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default CityCard;
