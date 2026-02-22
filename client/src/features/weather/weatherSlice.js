import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import weatherService from './weatherService';

/**
 * État initial du slice météo
 */
const initialState = {
  currentWeather: null,
  forecast: null,
  loading: false,
  error: null,
  searchedCity: null,
};

/**
 * Thunk asynchrone : récupère la météo actuelle d'une ville
 */
export const fetchCurrentWeather = createAsyncThunk(
  'weather/fetchCurrent',
  async (cityName, { rejectWithValue }) => {
    try {
      const data = await weatherService.getCurrentWeather(cityName);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk asynchrone : récupère les prévisions météo d'une ville
 */
export const fetchForecast = createAsyncThunk(
  'weather/fetchForecast',
  async (cityName, { rejectWithValue }) => {
    try {
      const data = await weatherService.getForecast(cityName);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Thunk asynchrone : récupère la météo par géolocalisation
 */
export const fetchWeatherByCoords = createAsyncThunk(
  'weather/fetchByCoords',
  async ({ lat, lon }, { rejectWithValue }) => {
    try {
      const data = await weatherService.getWeatherByCoords(lat, lon);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

/**
 * Slice Redux pour la gestion de la météo
 */
const weatherSlice = createSlice({
  name: 'weather',
  initialState,
  reducers: {
    // Action pour réinitialiser l'erreur
    clearError: (state) => {
      state.error = null;
    },
    // Action pour réinitialiser toutes les données
    resetWeather: (state) => {
      state.currentWeather = null;
      state.forecast = null;
      state.error = null;
      state.searchedCity = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCurrentWeather
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.searchedCity = action.payload.name;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.currentWeather = null;
      })
      // fetchForecast
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.forecast = action.payload;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.forecast = null;
      })
      // fetchWeatherByCoords
      .addCase(fetchWeatherByCoords.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeatherByCoords.fulfilled, (state, action) => {
        state.loading = false;
        state.currentWeather = action.payload;
        state.searchedCity = action.payload.name;
      })
      .addCase(fetchWeatherByCoords.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetWeather } = weatherSlice.actions;

// Selectors
export const selectCurrentWeather = (state) => state.weather.currentWeather;
export const selectForecast = (state) => state.weather.forecast;
export const selectWeatherLoading = (state) => state.weather.loading;
export const selectWeatherError = (state) => state.weather.error;
export const selectSearchedCity = (state) => state.weather.searchedCity;

export default weatherSlice.reducer;
