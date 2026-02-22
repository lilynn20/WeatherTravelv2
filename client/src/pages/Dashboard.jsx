import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CityCard from '../components/CityCard';
import TravelPlanCard from '../components/TravelPlanCard';
import { removeFavorite, clearAllFavorites } from '../features/favorites/favoritesSlice';
import { clearAllPlans } from '../features/travelPlans/travelPlansSlice';
import { addNotification } from '../features/notifications/notificationsSlice';
import { t } from '../utils/i18n';

/**
 * Page Dashboard
 * Affiche et gère les villes favorites épinglées et les plans de voyage
 */
const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const favorites = useSelector((state) => state.favorites.cities);
  const travelPlans = useSelector((state) => state.travelPlans.plans);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [activeTab, setActiveTab] = useState('favorites'); // 'favorites' ou 'plans'

  // Trier les plans par date
  const sortedPlans = [...travelPlans].sort((a, b) => 
    new Date(a.travelDate) - new Date(b.travelDate)
  );

  // Séparer les plans futurs et passés
  const futurePlans = sortedPlans.filter(plan => 
    new Date(plan.travelDate) >= new Date()
  );
  const pastPlans = sortedPlans.filter(plan => 
    new Date(plan.travelDate) < new Date()
  );

  /**
   * Supprime une ville des favoris
   */
  const handleRemoveCity = (city) => {
    dispatch(removeFavorite(city.id));
    dispatch(
      addNotification({
        message: `${city.name} supprimee des destinations.`,
        type: 'error',
      })
    );
  };

  /**
   * Efface tous les favoris après confirmation
   */
  const handleClearAll = () => {
    if (showConfirmDelete) {
      if (activeTab === 'favorites') {
        dispatch(clearAllFavorites());
        dispatch(
          addNotification({
            message: 'Toutes les destinations ont ete supprimees.',
            type: 'error',
          })
        );
      } else {
        dispatch(clearAllPlans());
        dispatch(
          addNotification({
            message: 'Tous les voyages planifies ont ete supprimes.',
            type: 'error',
          })
        );
      }
      setShowConfirmDelete(false);
    } else {
      setShowConfirmDelete(true);
      // Réinitialise après 3 secondes
      setTimeout(() => setShowConfirmDelete(false), 3000);
    }
  };

  /**
   * Navigation vers la page d'accueil
   */
  const handleGoToSearch = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2">
                <span className="accent-dot bg-fuchsia-300/80"></span>
                {t('dashboard_label')}
              </div>
              <h1 className="text-4xl md:text-5xl brand-script text-slate-900 dark:text-slate-100 mb-2">
                {t('dashboard_title')}
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                {t('dashboard_desc')}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleGoToSearch}
                className="btn-secondary"
              >
                ➕ {t('dashboard_add_city')}
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-200/60 dark:border-slate-700/60 mb-6">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-3 font-medium relative ${
                activeTab === 'favorites'
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              📌 {t('favorites_tab')} ({favorites.length})
              {activeTab === 'favorites' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('plans')}
              className={`px-4 py-3 font-medium relative ${
                activeTab === 'plans'
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              {t('plans_tab')} ({travelPlans.length})
              {activeTab === 'plans' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>
              )}
            </button>
          </div>

          {/* Actions et statistiques selon l'onglet actif */}
          {activeTab === 'favorites' && favorites.length > 0 && (
            <>
              <div className="flex justify-end mb-4">
                <button
                  onClick={handleClearAll}
                  className={`${showConfirmDelete ? 'btn-danger' : 'btn-secondary'}`}
                >
                  {showConfirmDelete ? `⚠️ ${t('confirm_delete')}` : `🗑️ ${t('clear_all')}`}
                </button>
              </div>
              
              {/* Barre de statistiques favoris */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('avg_temp')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      favorites.reduce((acc, city) => acc + city.temp, 0) / favorites.length
                    )}°C
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('hottest_city')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {favorites.reduce((max, city) => 
                      city.temp > max.temp ? city : max
                    ).name}
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{t('coldest_city')}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {favorites.reduce((min, city) => 
                      city.temp < min.temp ? city : min
                    ).name}
                  </p>
                </div>
              </div>
            </>
          )}

          {activeTab === 'plans' && travelPlans.length > 0 && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleClearAll}
                className={`${showConfirmDelete ? 'btn-danger' : 'btn-secondary'}`}
              >
                  {showConfirmDelete ? `⚠️ ${t('confirm_delete')}` : `🗑️ ${t('clear_all')}`}
              </button>
            </div>
          )}
        </div>

        {/* Contenu selon l'onglet actif */}
        {activeTab === 'favorites' ? (
          // Liste des villes favorites
          favorites.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((city) => (
                <CityCard
                  key={city.id}
                  city={city}
                  onRemove={handleRemoveCity}
                />
              ))}
            </div>
          ) : (
            // Message vide favoris
            <div className="text-center py-16">
              <div className="card max-w-2xl mx-auto">
                <div className="text-6xl mb-4">📍</div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t('no_favorites_title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('no_favorites_desc')}
                </p>
                <button
                  onClick={handleGoToSearch}
                  className="btn-primary"
                >
                  🔍 {t('search_city')}
                </button>
              </div>
            </div>
          )
        ) : (
          // Liste des plans de voyage
          travelPlans.length > 0 ? (
            <div className="space-y-8">
              {/* Voyages à venir */}
              {futurePlans.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    🚀 {t('upcoming_trips')} ({futurePlans.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {futurePlans.map((plan) => (
                      <TravelPlanCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              )}

              {/* Voyages passés */}
              {pastPlans.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                    📚 {t('past_trips')} ({pastPlans.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pastPlans.map((plan) => (
                      <TravelPlanCard key={plan.id} plan={plan} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Message vide plans
            <div className="text-center py-16">
              <div className="card max-w-2xl mx-auto">

                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  {t('no_plans_title')}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {t('no_plans_desc')}
                </p>
                <button
                  onClick={handleGoToSearch}
                  className="btn-primary"
                >
                  🔍 {t('search_destination')}
                </button>
              </div>
            </div>
          )
        )}

        {/* Conseils */}
        {((activeTab === 'favorites' && favorites.length > 0) || 
          (activeTab === 'plans' && travelPlans.length > 0)) && (
          <div className="mt-12 bg-white/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl p-6">
            <h4 className="font-semibold text-slate-900 dark:text-slate-200 mb-2 flex items-center gap-2">
              💡 {activeTab === 'favorites' ? t('tip_title_favorites') : t('tip_title_plans')}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {activeTab === 'favorites'
                ? t('tip_favorites')
                : t('tip_plans')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
