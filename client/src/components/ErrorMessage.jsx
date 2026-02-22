import React from 'react';
import { ERROR_MESSAGES } from '../utils/constants';

/**
 * Composant ErrorMessage
 * Affiche un message d'erreur stylisé
 * @param {string} error - Code d'erreur ou message
 * @param {function} onRetry - Fonction callback pour réessayer (optionnel)
 */
const ErrorMessage = ({ error, onRetry }) => {
  // Récupère le message d'erreur approprié
  const errorMessage = ERROR_MESSAGES[error] || error || ERROR_MESSAGES.GENERIC_ERROR;

  return (
    <div className="bg-red-50 dark:bg-red-900 dark:bg-opacity-20 border border-red-200 dark:border-red-800 rounded-lg p-6 mb-4">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="h-6 w-6 text-red-400 dark:text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-300">Erreur</h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-200">
            <p>{errorMessage}</p>
          </div>
          {onRetry && (
            <div className="mt-4">
              <button
                onClick={onRetry}
                className="btn-secondary text-sm"
              >
                Réessayer
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
