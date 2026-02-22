import React, { useState } from 'react';
import SearchForm from '../components/SearchForm';
import RecommendationsCard from '../components/RecommendationsCard';
import PackingListCard from '../components/PackingListCard';
import ForecastScoresCard from '../components/ForecastScoresCard';

const Analytics = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [packingMode, setPackingMode] = useState('full');
  const [preferences, setPreferences] = useState(null);

  const handleSearch = (cityName) => {
    setSelectedCity(cityName);
    // Set preferences to show recommendations
    // Using climate and activity preferences
    setPreferences({
      climate: 'continental',
      activities: 'sightseeing,culture',
      tempMin: '15',
      tempMax: '28'
    });
  };

  const handlePreferencesChange = (prefs) => {
    setPreferences(prefs);
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="flex justify-center gap-2 mb-4">
            <span className="accent-dot bg-amber-300/90"></span>
            <span className="accent-dot bg-fuchsia-300/80"></span>
            <span className="accent-dot bg-sky-300/80"></span>
          </div>
          <h1 className="text-5xl md:text-6xl brand-script text-slate-900 dark:text-slate-100 mb-2">
            Analytics
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Analyses intelligentes pour vos voyages
          </p>
        </div>

        {/* Formulaire de recherche */}
        <div className="flex justify-center mb-10">
          <div className="w-full max-w-2xl">
            <SearchForm onSearch={handleSearch} />
          </div>
        </div>

        {selectedCity && (
          <div className="space-y-8">
            {/* Forecast Scores */}
            <ForecastScoresCard city={selectedCity} />

            {/* Packing Mode Selector */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4">
                Mode de valise
              </h3>
              <div className="flex gap-4">
                {['full', 'minimal'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPackingMode(mode)}
                    className={`px-6 py-2 rounded-lg font-medium transition ${
                      packingMode === mode
                        ? 'bg-primary text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-600'
                    }`}
                  >
                    {mode === 'full' ? 'Complet' : 'Minimaliste'}
                  </button>
                ))}
              </div>
            </div>

            {/* Packing List */}
            <PackingListCard city={selectedCity} mode={packingMode} />

            {/* Recommendations */}
            <RecommendationsCard city={selectedCity} />
          </div>
        )}

        {!selectedCity && (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Entrez le nom d'une ville pour voir les analyses
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
