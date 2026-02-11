import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import travelPlansReducer from '../features/travelPlans/travelPlansSlice';

/**
 * Configuration du store Redux avec Redux Toolkit
 * 
 * Le store contient trois slices principaux :
 * - weather : gestion de la météo actuelle et des prévisions
 * - favorites : gestion des villes épinglées (persistées dans localStorage)
 * - travelPlans : gestion des plans de voyage avec dates et rappels email
 */
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    travelPlans: travelPlansReducer,
  },
  // Middleware par défaut de Redux Toolkit inclut redux-thunk
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore les warnings pour les dates dans les actions
        ignoredActions: [
          'favorites/addCity', 
          'favorites/updateCityWeather',
          'travelPlans/addTravelPlan',
          'travelPlans/scheduleEmailReminder/fulfilled',
        ],
        ignoredPaths: ['favorites.cities', 'travelPlans.plans'],
      },
    }),
});

export default store;
