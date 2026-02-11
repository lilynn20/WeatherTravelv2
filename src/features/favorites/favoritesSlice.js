import { createSlice } from '@reduxjs/toolkit';

/**
 * Clé pour le localStorage
 */
const FAVORITES_STORAGE_KEY = 'weathertravel_favorites';

/**
 * Récupère les favoris depuis le localStorage
 */
const loadFavoritesFromStorage = () => {
  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des favoris:', error);
    return [];
  }
};

/**
 * Sauvegarde les favoris dans le localStorage
 */
const saveFavoritesToStorage = (favorites) => {
  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des favoris:', error);
  }
};

/**
 * État initial du slice favoris
 */
const initialState = {
  cities: loadFavoritesFromStorage(),
};

/**
 * Slice Redux pour la gestion des villes favorites
 */
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    /**
     * Ajoute une ville aux favoris
     * @param {Object} action.payload - Données de la ville (id, name, country, temp, weather, etc.)
     */
    addCity: (state, action) => {
      const cityData = action.payload;
      
      // Vérifie si la ville n'est pas déjà dans les favoris
      const exists = state.cities.find(city => city.id === cityData.id);
      
      if (!exists) {
        const newCity = {
          id: cityData.id,
          name: cityData.name,
          country: cityData.country,
          temp: cityData.temp,
          weather: cityData.weather,
          description: cityData.description,
          icon: cityData.icon,
          humidity: cityData.humidity,
          windSpeed: cityData.windSpeed,
          addedAt: new Date().toISOString(),
        };
        
        state.cities.push(newCity);
        saveFavoritesToStorage(state.cities);
      }
    },

    /**
     * Supprime une ville des favoris
     * @param {number} action.payload - ID de la ville à supprimer
     */
    removeCity: (state, action) => {
      state.cities = state.cities.filter(city => city.id !== action.payload);
      saveFavoritesToStorage(state.cities);
    },

    /**
     * Met à jour les données météo d'une ville favorite
     * @param {Object} action.payload - Nouvelles données météo
     */
    updateCityWeather: (state, action) => {
      const { id, temp, weather, description, icon, humidity, windSpeed } = action.payload;
      const city = state.cities.find(c => c.id === id);
      
      if (city) {
        city.temp = temp;
        city.weather = weather;
        city.description = description;
        city.icon = icon;
        city.humidity = humidity;
        city.windSpeed = windSpeed;
        city.updatedAt = new Date().toISOString();
        saveFavoritesToStorage(state.cities);
      }
    },

    /**
     * Efface tous les favoris
     */
    clearAllFavorites: (state) => {
      state.cities = [];
      saveFavoritesToStorage([]);
    },
  },
});

export const { addCity, removeCity, updateCityWeather, clearAllFavorites } = favoritesSlice.actions;

// Sélecteurs
export const selectAllFavorites = (state) => state.favorites.cities;
export const selectFavoriteById = (state, cityId) => 
  state.favorites.cities.find(city => city.id === cityId);
export const selectIsFavorite = (state, cityId) => 
  state.favorites.cities.some(city => city.id === cityId);

export default favoritesSlice.reducer;
