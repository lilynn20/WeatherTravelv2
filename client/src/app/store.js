import { configureStore } from '@reduxjs/toolkit';
import weatherReducer from '../features/weather/weatherSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import travelPlansReducer from '../features/travelPlans/travelPlansSlice';
import tripsReducer from '../features/travelPlans/tripsSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import authReducer from '../features/auth/authSlice';

/**
 * Configuration du store Redux avec Redux Toolkit
 * 
 * Le store contient trois slices principaux :
 * - weather : gestion de la météo actuelle et des prévisions
 * - favorites : gestion des villes épinglées (persistées dans localStorage)
 * - travelPlans : gestion des plans de voyage avec dates et rappels email
 * 
 * Redux DevTools est activé en développement pour faciliter le débogage
 */
export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favorites: favoritesReducer,
    travelPlans: travelPlansReducer, // localStorage-based local plans (kept for offline)
    trips: tripsReducer,             // server-synced trips
    notifications: notificationsReducer,
    auth: authReducer,
  },
  // Middleware par défaut de Redux Toolkit inclut redux-thunk
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore les warnings pour les dates dans les actions
        ignoredActions: [
          'favorites/fetchFavorites/fulfilled',
          'favorites/addFavorite/fulfilled',
          'favorites/removeFavorite/fulfilled',
          'travelPlans/addTravelPlan',
          'travelPlans/scheduleEmailReminder/fulfilled',
          'trips/createTrip/fulfilled',
          'trips/fetchTrips/fulfilled',
        ],
        ignoredPaths: ['favorites.cities', 'travelPlans.plans', 'trips.trips'],
      },
    }),
  // Activer Redux DevTools en développement pour un meilleur débogage
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
