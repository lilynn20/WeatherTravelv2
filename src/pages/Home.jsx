import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SearchForm from '../components/SearchForm';
import WeatherCard from '../components/WeatherCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { fetchCurrentWeather, fetchWeatherByCoords, clearError } from '../features/weather/weatherSlice';

/**
 * Page Home
 * Page d'accueil avec recherche et affichage de météo
 */
const Home = () => {
  const dispatch = useDispatch();
  const { currentWeather, loading, error } = useSelector((state) => state.weather);

  /**
   * Gère la recherche d'une ville
   * @param {string} cityName - Nom de la ville (ou null pour géolocalisation)
   * @param {Object} coords - Coordonnées {lat, lon} (optionnel)
   */
  const handleSearch = (cityName, coords) => {
    if (coords) {
      // Recherche par géolocalisation
      dispatch(fetchWeatherByCoords(coords));
    } else {
      // Recherche par nom de ville
      dispatch(fetchCurrentWeather(cityName));
    }
  };

  /**
   * Réinitialise l'erreur et permet une nouvelle recherche
   */
  const handleRetry = () => {
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🌍 WeatherTravel
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Planifiez vos voyages en fonction de la météo
          </p>
          <p className="text-gray-500">
            Recherchez une ville pour consulter sa météo actuelle
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="flex justify-center mb-8">
          <SearchForm onSearch={handleSearch} loading={loading} />
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="mb-6">
            <ErrorMessage error={error} onRetry={handleRetry} />
          </div>
        )}

        {/* État de chargement */}
        {loading && (
          <div className="flex justify-center">
            <LoadingSpinner message="Récupération de la météo..." />
          </div>
        )}

        {/* Carte météo */}
        {!loading && !error && currentWeather && (
          <div className="flex justify-center animate-fadeIn">
            <div className="w-full max-w-2xl">
              <WeatherCard weatherData={currentWeather} />
            </div>
          </div>
        )}

        {/* Message d'aide initial */}
        {!loading && !error && !currentWeather && (
          <div className="text-center">
            <div className="card max-w-2xl mx-auto">
              <div className="text-6xl mb-4">☀️🌧️❄️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Commencez votre recherche
              </h3>
              <p className="text-gray-600">
                Entrez le nom d'une ville pour découvrir sa météo actuelle et
                planifier votre voyage en toute sérénité.
              </p>
            </div>
          </div>
        )}

        {/* Guide d'utilisation */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="font-semibold text-gray-800 mb-2">Recherchez</h4>
            <p className="text-sm text-gray-600">
              Entrez le nom d'une ville pour consulter sa météo
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">⭐</div>
            <h4 className="font-semibold text-gray-800 mb-2">Épinglez</h4>
            <p className="text-sm text-gray-600">
              Ajoutez vos destinations favorites à votre dashboard
            </p>
          </div>
          <div className="text-center p-6">
            <div className="text-4xl mb-3">✈️</div>
            <h4 className="font-semibold text-gray-800 mb-2">Voyagez</h4>
            <p className="text-sm text-gray-600">
              Planifiez vos déplacements selon les conditions météo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
