// Configuration de l'API OpenWeatherMap
// Pour utiliser cette application, vous devez obtenir une clé API gratuite sur https://openweathermap.org/api
export const WEATHER_API_KEY = '03cccef598fb7a65c3bc8b8eac673a11'; // À remplacer par votre clé
export const WEATHER_API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Unités de mesure
export const UNITS = 'metric'; // metric = Celsius, imperial = Fahrenheit

// Langue
export const LANGUAGE = 'fr';

// Messages d'erreur
export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'Ville introuvable. Veuillez vérifier l\'orthographe.',
  NETWORK_ERROR: 'Erreur de connexion. Veuillez réessayer.',
  INVALID_API_KEY: 'Clé API invalide. Veuillez configurer votre clé dans src/utils/constants.js',
  EMPTY_FIELD: 'Veuillez entrer le nom d\'une ville.',
  GENERIC_ERROR: 'Une erreur s\'est produite. Veuillez réessayer.',
};

// Icônes météo
export const WEATHER_ICONS = {
  '01d': '☀️',
  '01n': '🌙',
  '02d': '⛅',
  '02n': '☁️',
  '03d': '☁️',
  '03n': '☁️',
  '04d': '☁️',
  '04n': '☁️',
  '09d': '🌧️',
  '09n': '🌧️',
  '10d': '🌦️',
  '10n': '🌧️',
  '11d': '⛈️',
  '11n': '⛈️',
  '13d': '❄️',
  '13n': '❄️',
  '50d': '🌫️',
  '50n': '🌫️',
};
