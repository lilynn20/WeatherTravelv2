import React, { useState } from 'react';
import { t } from '../utils/i18n';

/**
 * Composant SearchForm
 * Formulaire de recherche de ville avec validation
 * @param {function} onSearch - Callback appelé lors de la soumission
 * @param {boolean} loading - État de chargement
 */
const SearchForm = ({ onSearch, loading = false }) => {
  const [cityName, setCityName] = useState('');
  const [error, setError] = useState('');
  const [geoLoading, setGeoLoading] = useState(false);

  /**
   * Gère la soumission du formulaire
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validation : vérifier que le champ n'est pas vide
    const trimmedCity = cityName.trim();
    if (!trimmedCity) {
      setError(t('error_empty'));
      return;
    }

    // Validation : longueur minimale
    if (trimmedCity.length < 2) {
      setError(t('error_short'));
      return;
    }

    // Appel du callback parent
    onSearch(trimmedCity);
  };

  /**
   * Gère le changement de valeur du champ
   */
  const handleChange = (e) => {
    setCityName(e.target.value);
    // Efface l'erreur lors de la saisie
    if (error) setError('');
  };

  /**
   * Gère la géolocalisation
   */
  const handleGeolocation = () => {
    if ('geolocation' in navigator) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setGeoLoading(false);
          onSearch(null, {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          setGeoLoading(false);
          setError(t('geo_denied'));
        }
      );
    } else {
      setError(t('geo_unsupported'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl">
      <div className="flex flex-col gap-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <input
              type="text"
              value={cityName}
              onChange={handleChange}
              placeholder={t('search_placeholder')}
              className={`input-field ${error ? 'border-red-500 focus:ring-red-500' : ''}`}
              disabled={loading}
              aria-label="Nom de la ville"
            />
            {error && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                {t('search_loading')}
              </span>
            ) : (
              `🔍 ${t('search_button')}`
            )}
          </button>
        </div>
        
        <button
          type="button"
          onClick={handleGeolocation}
          disabled={loading || geoLoading}
          className="btn-secondary text-sm self-start"
        >
          {geoLoading ? t('geo_loading') : `📍 ${t('geo_button')}`}
        </button>
      </div>
    </form>
  );
};

export default SearchForm;
