import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import emailService from './emailService';

// Thunk pour envoyer un email de rappel
export const scheduleEmailReminder = createAsyncThunk(
  'travelPlans/scheduleEmailReminder',
  async ({ planId, cityName, travelDate, userEmail, weatherInfo }, { rejectWithValue }) => {
    try {
      const result = await emailService.sendTravelReminder({
        cityName,
        travelDate,
        userEmail,
        weatherInfo
      });
      return { planId, result };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Charger les plans depuis le localStorage
const loadTravelPlansFromStorage = () => {
  try {
    const stored = localStorage.getItem('weathertravel_plans');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Erreur lors du chargement des plans:', error);
    return [];
  }
};

// Sauvegarder les plans dans le localStorage
const saveTravelPlansToStorage = (plans) => {
  try {
    localStorage.setItem('weathertravel_plans', JSON.stringify(plans));
  } catch (error) {
    console.error('Erreur lors de la sauvegarde des plans:', error);
  }
};

const initialState = {
  plans: loadTravelPlansFromStorage(),
  loading: false,
  error: null,
  emailSending: false,
  emailSent: false,
};

const travelPlansSlice = createSlice({
  name: 'travelPlans',
  initialState,
  reducers: {
    // Ajouter un plan de voyage
    addTravelPlan: (state, action) => {
      const newPlan = {
        id: Date.now().toString(),
        cityName: action.payload.cityName,
        cityId: action.payload.cityId,
        travelDate: action.payload.travelDate,
        userEmail: action.payload.userEmail,
        weatherInfo: action.payload.weatherInfo,
        reminderSent: false,
        createdAt: new Date().toISOString(),
      };
      state.plans.push(newPlan);
      saveTravelPlansToStorage(state.plans);
    },

    // Supprimer un plan de voyage
    removeTravelPlan: (state, action) => {
      state.plans = state.plans.filter(plan => plan.id !== action.payload);
      saveTravelPlansToStorage(state.plans);
    },

    // Marquer le rappel comme envoyé
    markReminderSent: (state, action) => {
      const plan = state.plans.find(p => p.id === action.payload);
      if (plan) {
        plan.reminderSent = true;
        saveTravelPlansToStorage(state.plans);
      }
    },

    // Effacer tous les plans
    clearAllPlans: (state) => {
      state.plans = [];
      saveTravelPlansToStorage(state.plans);
    },

    // Réinitialiser l'état d'envoi d'email
    resetEmailStatus: (state) => {
      state.emailSent = false;
      state.emailSending = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scheduleEmailReminder.pending, (state) => {
        state.emailSending = true;
        state.error = null;
        state.emailSent = false;
      })
      .addCase(scheduleEmailReminder.fulfilled, (state, action) => {
        state.emailSending = false;
        state.emailSent = true;
        // Marquer le rappel comme envoyé
        const plan = state.plans.find(p => p.id === action.payload.planId);
        if (plan) {
          plan.reminderSent = true;
          saveTravelPlansToStorage(state.plans);
        }
      })
      .addCase(scheduleEmailReminder.rejected, (state, action) => {
        state.emailSending = false;
        state.error = action.payload || 'Erreur lors de l\'envoi de l\'email';
        state.emailSent = false;
      });
  },
});

export const {
  addTravelPlan,
  removeTravelPlan,
  markReminderSent,
  clearAllPlans,
  resetEmailStatus,
} = travelPlansSlice.actions;

export default travelPlansSlice.reducer;
