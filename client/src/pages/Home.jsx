import React from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchForm from "../components/SearchForm";
import WeatherCard from "../components/WeatherCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import {
  fetchCurrentWeather,
  fetchWeatherByCoords,
  clearError,
} from "../features/weather/weatherSlice";

/**
 * Page Home
 * Page d'accueil avec recherche et affichage de météo
 */
const Home = () => {
  const dispatch = useDispatch();
  const { currentWeather, loading, error } = useSelector(
    (state) => state.weather,
  );

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
          <div className="flex justify-center gap-2 mb-4">
            <span className="accent-dot bg-amber-300/90"></span>
            <span className="accent-dot bg-fuchsia-300/80"></span>
            <span className="accent-dot bg-sky-300/80"></span>
          </div>
          <h1 className="text-6xl md:text-7xl brand-script text-slate-900 dark:text-slate-100 mb-3">
            WeatherTravel
          </h1>
          <p className="text-sm uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">
            Assistant Voyage Meteo
          </p>
          <p className="text-lg text-slate-600 dark:text-slate-300 mt-4">
            Planifiez vos voyages en fonction de la meteo
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
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                Commencez votre recherche
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Entrez le nom d'une ville pour découvrir sa météo actuelle et
                planifier votre voyage en toute sérénité.
              </p>
            </div>
          </div>
        )}

        {/* Guide d'utilisation */}
        <div className="mt-12 grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <div className="text-center p-6 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-white/70 dark:bg-slate-900/60">
            <div className="text-4xl mb-3">🔍</div>
            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Recherchez
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Entrez le nom d'une ville pour consulter sa meteo
            </p>
          </div>
          <div className="text-center p-6 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-white/70 dark:bg-slate-900/60">

            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Epinglez
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Ajoutez vos destinations favorites a votre dashboard
            </p>
          </div>
          <div className="text-center p-6 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl bg-white/70 dark:bg-slate-900/60">

            <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
              Voyagez
            </h4>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Planifiez vos deplacements selon les conditions meteo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
