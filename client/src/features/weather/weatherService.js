import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

/**
 * Service pour interagir avec le backend Weather Travel API
 */
class WeatherService {
  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });
  }

  /**
   * Récupère la météo actuelle pour une ville
   * @param {string} cityName - Nom de la ville
   * @returns {Promise} Données météo
   */
  async getCurrentWeather(cityName) {
    try {
      const response = await this.api.get(`/weather/${cityName}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupère les prévisions météo sur 5 jours
   * @param {string} cityName - Nom de la ville
   * @returns {Promise} Prévisions météo
   */
  async getForecast(cityName) {
    try {
      const response = await this.api.get(`/analytics/forecast/${cityName}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupère la météo par coordonnées géographiques (utilise la ville la plus proche)
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise} Données météo
   */
  async getWeatherByCoords(lat, lon) {
    try {
      // Note: Cette fonction utilise les données du service frontend
      // Pour une meilleure intégration, considérez l'ajout d'un endpoint backend pour les coordonnées
      const response = await this.api.get(`/weather?lat=${lat}&lon=${lon}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Gestion des erreurs API
   * @param {Error} error - Erreur axios
   * @returns {Error} Erreur formatée
   */
  handleError(error) {
    if (error.response) {
      // Erreur de réponse du serveur
      switch (error.response.status) {
        case 404:
          return new Error('CITY_NOT_FOUND');
        case 401:
          return new Error('INVALID_API_KEY');
        default:
          return new Error('GENERIC_ERROR');
      }
    } else if (error.request) {
      // Erreur de réseau
      return new Error('NETWORK_ERROR');
    }
    return new Error('GENERIC_ERROR');
  }
}

export default new WeatherService();
