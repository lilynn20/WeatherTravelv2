/**
 * Favorites feature exports
 * Selectors and actions for favorites state management
 */

export {
  addCity,
  removeCity,
  updateCityWeather,
  clearAllFavorites,
} from './favoritesSlice';

export {
  selectAllFavorites,
  selectFavoriteById,
  selectIsFavorite,
} from './favoritesSlice';
