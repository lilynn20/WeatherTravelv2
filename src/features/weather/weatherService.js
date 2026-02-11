import axios from 'axios';
import { WEATHER_API_KEY, WEATHER_API_BASE_URL, UNITS, LANGUAGE } from '../../utils/constants';

/**
 * Service pour interagir avec l'API OpenWeatherMap
 */
class WeatherService {
  /**
   * Récupère la météo actuelle pour une ville
   * @param {string} cityName - Nom de la ville
   * @returns {Promise} Données météo
   */
  async getCurrentWeather(cityName) {
    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
        params: {
          q: cityName,
          appid: WEATHER_API_KEY,
          units: UNITS,
          lang: LANGUAGE,
        },
      });
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
      const response = await axios.get(`${WEATHER_API_BASE_URL}/forecast`, {
        params: {
          q: cityName,
          appid: WEATHER_API_KEY,
          units: UNITS,
          lang: LANGUAGE,
        },
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Récupère la météo par coordonnées géographiques
   * @param {number} lat - Latitude
   * @param {number} lon - Longitude
   * @returns {Promise} Données météo
   */
  async getWeatherByCoords(lat, lon) {
    try {
      const response = await axios.get(`${WEATHER_API_BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: WEATHER_API_KEY,
          units: UNITS,
          lang: LANGUAGE,
        },
      });
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
