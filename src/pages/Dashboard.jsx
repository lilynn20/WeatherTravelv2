import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CityCard from '../components/CityCard';
import TravelPlanCard from '../components/TravelPlanCard';
import { removeCity, clearAllFavorites } from '../features/favorites/favoritesSlice';
import { clearAllPlans } from '../features/travelPlans/travelPlansSlice';
import { addNotification } from '../features/notifications/notificationsSlice';

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
    dispatch(removeCity(city.id));
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
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 mb-2">
                <span className="accent-dot bg-fuchsia-300/80"></span>
                Tableau de bord
              </div>
              <h1 className="text-4xl md:text-5xl brand-script text-slate-900 dark:text-slate-100 mb-2">
                Mes destinations
              </h1>
              <p className="text-slate-600 dark:text-slate-300">
                Gere vos destinations favorites et vos voyages planifies
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGoToSearch}
                className="btn-secondary"
              >
                ➕ Ajouter une ville
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-slate-200/60 dark:border-slate-700/60 mb-6">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`px-4 py-3 font-medium relative ${
                activeTab === 'favorites'
                  ? 'text-slate-900 dark:text-slate-100'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-300'
              }`}
            >
              📌 Favoris ({favorites.length})
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
              ✈️ Voyages planifiés ({travelPlans.length})
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
                  {showConfirmDelete ? '⚠️ Confirmer la suppression' : '🗑️ Tout effacer'}
                </button>
              </div>
              
              {/* Barre de statistiques favoris */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Température moyenne</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(
                      favorites.reduce((acc, city) => acc + city.temp, 0) / favorites.length
                    )}°C
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ville la plus chaude</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {favorites.reduce((max, city) => 
                      city.temp > max.temp ? city : max
                    ).name}
                  </p>
                </div>
                <div className="card">
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ville la plus froide</p>
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
                {showConfirmDelete ? '⚠️ Confirmer la suppression' : '🗑️ Tout effacer'}
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
                  Aucune ville épinglée
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Commencez par rechercher une ville et ajoutez-la à vos favoris
                  pour la retrouver ici facilement.
                </p>
                <button
                  onClick={handleGoToSearch}
                  className="btn-primary"
                >
                  🔍 Rechercher une ville
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
                    🚀 Voyages à venir ({futurePlans.length})
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
                    📚 Voyages passés ({pastPlans.length})
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
                <div className="text-6xl mb-4">✈️</div>
                <h3 className="text-2xl font-semibold text-gray-800 dark:text-white mb-3">
                  Aucun voyage planifié
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Recherchez une ville et cliquez sur "Planifier un voyage" pour
                  ajouter une date de voyage et recevoir un rappel par email.
                </p>
                <button
                  onClick={handleGoToSearch}
                  className="btn-primary"
                >
                  🔍 Rechercher une destination
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
              💡 Conseil {activeTab === 'favorites' ? 'de voyage' : 'pour vos voyages'}
            </h4>
            <p className="text-slate-600 dark:text-slate-300 text-sm">
              {activeTab === 'favorites' 
                ? 'Consultez les détails météo de chaque ville pour planifier au mieux vos déplacements. Les températures et conditions peuvent varier rapidement !'
                : 'Vérifiez la météo quelques jours avant votre départ pour ajuster vos bagages. Les prévisions peuvent évoluer !'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
