import { useDispatch } from 'react-redux';
import { removeTravelPlan, scheduleEmailReminder } from '../features/travelPlans/travelPlansSlice';

/**
 * Carte affichant un plan de voyage planifié
 * @param {Object} props
 * @param {Object} props.plan - Le plan de voyage
 */
const TravelPlanCard = ({ plan }) => {
  const dispatch = useDispatch();

  // Formater la date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Calculer les jours restants
  const getDaysUntilTravel = () => {
    const today = new Date();
    const travelDate = new Date(plan.travelDate);
    const diffTime = travelDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // Obtenir le badge de statut
  const getStatusBadge = () => {
    const daysUntil = getDaysUntilTravel();
    
    if (daysUntil < 0) {
      return {
        text: 'Passé',
        color: 'bg-gray-100 text-gray-700',
        icon: '📅',
      };
    } else if (daysUntil === 0) {
      return {
        text: 'Aujourd\'hui !',
        color: 'bg-green-100 text-green-700',
        icon: '🎉',
      };
    } else if (daysUntil === 1) {
      return {
        text: 'Demain',
        color: 'bg-yellow-100 text-yellow-700',
        icon: '⚠️',
      };
    } else if (daysUntil <= 7) {
      return {
        text: `Dans ${daysUntil} jours`,
        color: 'bg-orange-100 text-orange-700',
        icon: '⏰',
      };
    } else {
      return {
        text: `Dans ${daysUntil} jours`,
        color: 'bg-blue-100 text-blue-700',
        icon: '📆',
      };
    }
  };

  // Gérer la suppression
  const handleDelete = () => {
    if (window.confirm(`Supprimer le voyage à ${plan.cityName} ?`)) {
      dispatch(removeTravelPlan(plan.id));
    }
  };

  // Renvoyer l'email de rappel
  const handleResendEmail = () => {
    dispatch(
      scheduleEmailReminder({
        planId: plan.id,
        cityName: plan.cityName,
        travelDate: plan.travelDate,
        userEmail: plan.userEmail,
        weatherInfo: plan.weatherInfo,
      })
    );
  };

  const status = getStatusBadge();
  const isPastTrip = getDaysUntilTravel() < 0;

  return (
    <div className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${isPastTrip ? 'opacity-60' : ''}`}>
      {/* En-tête avec gradient */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold">{plan.cityName}</h3>
            <p className="text-blue-100 text-sm mt-1">{formatDate(plan.travelDate)}</p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>
            {status.icon} {status.text}
          </div>
        </div>
      </div>

      {/* Contenu */}
      <div className="p-4 space-y-3">
        {/* Informations météo */}
        {plan.weatherInfo && (
          <div className="bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">🌤️ Météo prévue</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Température:</span>
                <span className="ml-2 font-medium">{Math.round(plan.weatherInfo.temp)}°C</span>
              </div>
              <div>
                <span className="text-gray-600">Ressenti:</span>
                <span className="ml-2 font-medium">
                  {plan.weatherInfo.feelsLike ? `${Math.round(plan.weatherInfo.feelsLike)}°C` : 'N/A'}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-gray-600">Conditions:</span>
                <span className="ml-2 font-medium capitalize">{plan.weatherInfo.description || 'N/A'}</span>
              </div>
            </div>
          </div>
        )}

        {/* Statut de l'email */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center">
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 font-medium text-gray-800">{plan.userEmail}</span>
          </div>
          {plan.reminderSent ? (
            <span className="flex items-center text-green-600 text-xs font-medium">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Envoyé
            </span>
          ) : (
            <span className="flex items-center text-gray-500 text-xs">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              En attente
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-200">
          {!isPastTrip && plan.userEmail && (
            <button
              onClick={handleResendEmail}
              className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition font-medium"
              title="Renvoyer l'email de rappel"
            >
              📧 Renvoyer
            </button>
          )}
          <button
            onClick={handleDelete}
            className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition font-medium"
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default TravelPlanCard;
