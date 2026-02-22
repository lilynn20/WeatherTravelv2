import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiClient from '../../utils/apiClient';

// ─── Thunks ───────────────────────────────────────────────────────────────────

export const fetchTrips = createAsyncThunk('trips/fetchTrips', async (_, { rejectWithValue }) => {
  try {
    const res = await apiClient.get('/trips');
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch trips');
  }
});

export const createTrip = createAsyncThunk('trips/createTrip', async (tripData, { rejectWithValue }) => {
  try {
    const res = await apiClient.post('/trips', tripData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to create trip');
  }
});

export const updateTrip = createAsyncThunk('trips/updateTrip', async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await apiClient.put(`/trips/${id}`, data);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update trip');
  }
});

export const deleteTrip = createAsyncThunk('trips/deleteTrip', async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/trips/${id}`);
    return id;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to delete trip');
  }
});

export const shareTrip = createAsyncThunk('trips/shareTrip', async (id, { rejectWithValue }) => {
  try {
    const res = await apiClient.post(`/trips/${id}/share`);
    return { id, ...res.data };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to share trip');
  }
});

export const revokeShare = createAsyncThunk('trips/revokeShare', async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/trips/${id}/share`);
    return { id };
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Failed to revoke share');
  }
});

// ─── Slice ────────────────────────────────────────────────────────────────────

const tripsSlice = createSlice({
  name: 'trips',
  initialState: {
    trips: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const pending = (state) => { state.loading = true; state.error = null; };
    const rejected = (state, action) => { state.loading = false; state.error = action.payload; };

    builder
      .addCase(fetchTrips.pending, pending)
      .addCase(fetchTrips.fulfilled, (state, action) => {
        state.loading = false;
        state.trips = action.payload;
      })
      .addCase(fetchTrips.rejected, rejected)

      .addCase(createTrip.pending, pending)
      .addCase(createTrip.fulfilled, (state, action) => {
        state.loading = false;
        state.trips.unshift(action.payload);
      })
      .addCase(createTrip.rejected, rejected)

      .addCase(updateTrip.fulfilled, (state, action) => {
        const idx = state.trips.findIndex((t) => t._id === action.payload._id);
        if (idx !== -1) state.trips[idx] = action.payload;
      })

      .addCase(deleteTrip.fulfilled, (state, action) => {
        state.trips = state.trips.filter((t) => t._id !== action.payload);
      })

      .addCase(shareTrip.fulfilled, (state, action) => {
        const trip = state.trips.find((t) => t._id === action.payload.id);
        if (trip) { trip.isShared = true; trip.shareToken = action.payload.shareToken; }
      })

      .addCase(revokeShare.fulfilled, (state, action) => {
        const trip = state.trips.find((t) => t._id === action.payload.id);
        if (trip) { trip.isShared = false; trip.shareToken = null; }
      });
  },
});

export const { clearError } = tripsSlice.actions;

export const selectAllTrips = (state) => state.trips.trips;
export const selectTripsLoading = (state) => state.trips.loading;
export const selectUpcomingTrips = (state) =>
  state.trips.trips.filter((t) => t.status !== 'cancelled' && t.startDate && new Date(t.startDate) >= new Date());
export const selectPastTrips = (state) =>
  state.trips.trips.filter((t) => t.startDate && new Date(t.startDate) < new Date());

export default tripsSlice.reducer;
