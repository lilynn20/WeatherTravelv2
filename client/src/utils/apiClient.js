import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * Create an axios instance configured for the Weather Travel API backend
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Send cookies with requests
});

/**
 * Add request interceptor for authentication
 */
apiClient.interceptors.request.use(
  (config) => {
    // Cookies are sent automatically via withCredentials: true
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Add response interceptor for error handling
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
