import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/constants';

/**
 * Create axios instance with credentials for cookie-based auth
 */
const authApi = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

/**
 * Thunk pour la connexion
 */
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await authApi.post('/auth/login', {
        email,
        password,
      });
      // Cookie is set automatically by server
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Login failed');
    }
  }
);

/**
 * Thunk pour l'inscription
 */
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ email, password, name }, { rejectWithValue }) => {
    try {
      const response = await authApi.post('/auth/register', {
        email,
        password,
        name,
      });
      // Cookie is set automatically by server
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Signup failed');
    }
  }
);

/**
 * Thunk pour la déconnexion
 */
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.post('/auth/logout');
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Logout failed');
    }
  }
);

const initialState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Signup
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
