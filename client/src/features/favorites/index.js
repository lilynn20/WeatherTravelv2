/**
 * Favorites feature exports
 * Selectors and actions for favorites state management
 */

export {
  fetchFavorites,
  addFavorite,
  removeFavorite,
  clearAllFavorites,
} from './favoritesSlice';

export {
  selectAllFavorites,
  selectFavoritesLoading,
  selectFavoritesError,
  selectFavoriteById,
  selectIsFavorite,
} from './favoritesSlice';
