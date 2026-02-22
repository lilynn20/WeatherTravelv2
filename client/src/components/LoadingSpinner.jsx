import React from 'react';

/**
 * Composant LoadingSpinner
 * Affiche un spinner animé pendant le chargement
 */
const LoadingSpinner = ({ message = 'Chargement...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-primary mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
