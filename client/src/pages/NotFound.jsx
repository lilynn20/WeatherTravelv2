import React from 'react';
import { useNavigate } from 'react-router-dom';
import { t } from '../utils/i18n';

/**
 * Page NotFound (404)
 * Page d'erreur personnalisée pour les routes inexistantes
 */
const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        {/* Animation météo */}
        <div className="mb-8 text-8xl animate-bounce">
          🌪️
        </div>

        {/* Message d'erreur */}
        <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
          {t('not_found_title')}
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
          {t('not_found_desc')}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn-primary text-lg"
          >
             {t('back_home')}
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-secondary text-lg"
          >
            {t('nav_destinations')}
          </button>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
            {t('suggestions_title')}
          </h3>
          <ul className="text-left text-blue-800 dark:text-blue-200 space-y-2">
            <li>{t('suggestion_search')}</li>
            <li>{t('suggestion_favorites')}</li>
            <li>{t('suggestion_details')}</li>
          </ul>
        </div>

        {/* Illustrations météo */}
        <div className="mt-8 flex justify-center gap-6 text-4xl opacity-50">
          <span className="animate-pulse">☀️</span>
          <span className="animate-pulse delay-100">🌧️</span>
          <span className="animate-pulse delay-200">❄️</span>
          <span className="animate-pulse delay-300">⛈️</span>
          <span className="animate-pulse delay-500">🌈</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
