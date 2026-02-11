import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTravelPlan, scheduleEmailReminder, resetEmailStatus } from '../features/travelPlans/travelPlansSlice';
import { addCity, selectIsFavorite } from '../features/favorites/favoritesSlice';

/**
 * Modal pour planifier un voyage avec date et email de rappel
 * @param {Object} props
 * @param {boolean} props.isOpen - État d'ouverture du modal
 * @param {Function} props.onClose - Fonction de fermeture
 * @param {Object} props.cityData - Données de la ville (nom, météo, etc.)
 */
const TravelDateModal = ({ isOpen, onClose, cityData }) => {
  const dispatch = useDispatch();
  const { emailSending, emailSent, error } = useSelector((state) => state.travelPlans);
  const isFavorite = useSelector((state) => selectIsFavorite(state, cityData.id));

  const [formData, setFormData] = useState({
    travelDate: '',
    userEmail: '',
    sendReminder: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  // Obtenir la date minimale (aujourd'hui)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Obtenir la date maximale (1 an)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    return maxDate.toISOString().split('T')[0];
  };

  // Valider l'email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Gérer les changements de formulaire
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Effacer l'erreur du champ modifié
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Valider le formulaire
  const validateForm = () => {
    const errors = {};

    if (!formData.travelDate) {
      errors.travelDate = 'La date de voyage est requise';
    } else {
      const selectedDate = new Date(formData.travelDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.travelDate = 'La date doit être dans le futur';
      }
    }

    if (formData.sendReminder) {
      if (!formData.userEmail) {
        errors.userEmail = 'L\'email est requis pour recevoir un rappel';
      } else if (!validateEmail(formData.userEmail)) {
        errors.userEmail = 'Email invalide';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Gérer la soumission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // NOUVEAU: Ajouter automatiquement la ville aux favoris si elle n'y est pas déjà
    if (!isFavorite) {
      const cityDataForFavorites = {
        id: cityData.id,
        name: cityData.name,
        country: cityData.country || '',
        temp: cityData.weather?.temp || 0,
        weather: cityData.weather?.main || 'Unknown',
        description: cityData.weather?.description || '',
        icon: cityData.weather?.icon || '01d',
        humidity: cityData.weather?.humidity || 0,
        windSpeed: cityData.weather?.windSpeed || 0,
      };
      dispatch(addCity(cityDataForFavorites));
    }

    // Créer le plan de voyage
    const travelPlan = {
      cityName: cityData.name,
      cityId: cityData.id,
      travelDate: formData.travelDate,
      userEmail: formData.userEmail,
      weatherInfo: {
        temp: cityData.weather?.temp,
        feelsLike: cityData.weather?.feelsLike,
        description: cityData.weather?.description,
        humidity: cityData.weather?.humidity,
        windSpeed: cityData.weather?.windSpeed,
      },
    };

    // Ajouter au store
    const action = dispatch(addTravelPlan(travelPlan));
    const planId = action.payload.id;

    // Envoyer l'email de rappel si demandé
    if (formData.sendReminder) {
      await dispatch(
        scheduleEmailReminder({
          planId,
          ...travelPlan,
        })
      );
    }

    // Afficher le message de succès
    setShowSuccess(true);
    setTimeout(() => {
      handleClose();
    }, 2000);
  };

  // Fermer le modal
  const handleClose = () => {
    setFormData({ travelDate: '', userEmail: '', sendReminder: true });
    setFormErrors({});
    setShowSuccess(false);
    dispatch(resetEmailStatus());
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-t-lg">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold mb-1">Planifier votre voyage</h2>
              <p className="text-blue-100 text-sm">{cityData.name}</p>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Message de succès */}
          {showSuccess && (
            <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">
                Voyage planifié avec succès ! {!isFavorite && '✨ Ville ajoutée aux favoris !'}
              </span>
            </div>
          )}

          {/* Message d'erreur */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Date de voyage */}
          <div>
            <label htmlFor="travelDate" className="block text-sm font-medium text-gray-700 mb-2">
              📅 Date de voyage *
            </label>
            <input
              type="date"
              id="travelDate"
              name="travelDate"
              value={formData.travelDate}
              onChange={handleChange}
              min={getMinDate()}
              max={getMaxDate()}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                formErrors.travelDate ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            />
            {formErrors.travelDate && (
              <p className="text-red-500 text-sm mt-1">{formErrors.travelDate}</p>
            )}
          </div>

          {/* Checkbox pour le rappel */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <label className="flex items-start cursor-pointer">
              <input
                type="checkbox"
                name="sendReminder"
                checked={formData.sendReminder}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3">
                <span className="block text-sm font-medium text-gray-900">
                  📧 Recevoir un rappel par email
                </span>
                <span className="block text-xs text-gray-600 mt-1">
                  Un email avec les informations météo et des conseils sera envoyé
                </span>
              </span>
            </label>
          </div>

          {/* Email (conditionnel) */}
          {formData.sendReminder && (
            <div className="animate-fadeIn">
              <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-2">
                ✉️ Votre email *
              </label>
              <input
                type="email"
                id="userEmail"
                name="userEmail"
                value={formData.userEmail}
                onChange={handleChange}
                placeholder="exemple@email.com"
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
                  formErrors.userEmail ? 'border-red-500' : 'border-gray-300'
                }`}
                required={formData.sendReminder}
              />
              {formErrors.userEmail && (
                <p className="text-red-500 text-sm mt-1">{formErrors.userEmail}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                L'email sera envoyé à cette adresse immédiatement
              </p>
            </div>
          )}

          {/* Aperçu météo */}
          {cityData.weather && (
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-100">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">🌤️ Météo actuelle</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-600">Température:</span>
                  <span className="ml-2 font-medium">{Math.round(cityData.weather.temp)}°C</span>
                </div>
                <div>
                  <span className="text-gray-600">Ressenti:</span>
                  <span className="ml-2 font-medium">{Math.round(cityData.weather.feelsLike)}°C</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-600">Conditions:</span>
                  <span className="ml-2 font-medium capitalize">{cityData.weather.description}</span>
                </div>
              </div>
            </div>
          )}

          {/* Info sur l'ajout automatique aux favoris */}
          {!isFavorite && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                ⭐ Cette ville sera automatiquement ajoutée à vos destinations favorites
              </p>
            </div>
          )}

          {/* Boutons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={emailSending}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={emailSending || showSuccess}
            >
              {emailSending ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Envoi...
                </>
              ) : showSuccess ? (
                <>
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Planifié !
                </>
              ) : (
                '✈️ Planifier le voyage'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TravelDateModal;
