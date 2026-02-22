import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

/**
 * Thunk pour récupérer tous les favoris de l'utilisateur
 */
export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/favorites');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch favorites');
    }
  }
);

/**
 * Thunk pour ajouter une ville aux favoris
 */
export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (city, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/favorites', { city });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to add favorite');
    }
  }
);

/**
 * Thunk pour supprimer une ville des favoris
 */
export const removeFavorite = createAsyncThunk(
  'favorites/removeFavorite',
  async (favoriteId, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/favorites/${favoriteId}`);
      return favoriteId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || 'Failed to remove favorite');
    }
  }
);

/**
 * État initial du slice favoris
 */
const initialState = {
  cities: [],
  loading: false,
  error: null,
};

/**
 * Slice Redux pour la gestion des villes favorites
 */
const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    /**
     * Efface tous les favoris localement
     */
    clearAllFavorites: (state) => {
      state.cities = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Favorites
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.cities = action.payload.map(fav => ({
          id: fav._id,
          name: fav.city,
          addedAt: fav.addedAt,
        }));
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add Favorite
      .addCase(addFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.cities.push({
          id: action.payload._id,
          name: action.payload.city,
          addedAt: action.payload.addedAt,
        });
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      // Remove Favorite
      .addCase(removeFavorite.pending, (state) => {
        state.error = null;
      })
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.cities = state.cities.filter(city => city.id !== action.payload);
      })
      .addCase(removeFavorite.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearAllFavorites } = favoritesSlice.actions;

// Sélecteurs
export const selectAllFavorites = (state) => state.favorites.cities;
export const selectFavoritesLoading = (state) => state.favorites.loading;
export const selectFavoritesError = (state) => state.favorites.error;
export const selectFavoriteById = (state, favoriteId) => 
  state.favorites.cities.find(city => city.id === favoriteId);
export const selectIsFavorite = (state, cityName) => 
  state.favorites.cities.some(city => city.name.toLowerCase() === cityName.toLowerCase());

export default favoritesSlice.reducer;
