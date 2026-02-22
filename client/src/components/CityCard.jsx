import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Composant CityCard
 * Carte compacte pour afficher une ville favorite
 * @param {Object} city - Données de la ville favorite
 * @param {function} onRemove - Callback pour supprimer la ville
 */
const CityCard = ({ city, onRemove }) => {
  const navigate = useNavigate();

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
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition">
      {/* En-tête avec ville */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {city.name}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Ajoutée le {formatDate(city.addedAt)}
          </p>
        </div>
        <div className="text-4xl">🌍</div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleViewDetails}
          className="flex-1 text-sm px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-600 transition"
        >
          Voir détails
        </button>
        <button
          onClick={() => onRemove(city)}
          className="text-sm px-4 py-2 rounded-lg border border-red-300 dark:border-red-700 bg-white dark:bg-slate-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
          aria-label="Supprimer la ville"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default CityCard;
