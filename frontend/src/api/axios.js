import axios from 'axios';

/**
 * Centralized Axios instance.
 *
 * Base URL: The Vite dev-server proxy forwards /auth and /api to the API
 * Gateway running at VITE_API_BASE_URL (default http://localhost:4004).
 * In production builds the full gateway URL must be set via VITE_API_BASE_URL.
 *
 * All patient endpoints require a valid JWT Bearer token which is stored in
 * localStorage under the key "token" and injected by the request interceptor.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// ─── Request interceptor: attach JWT if present ───────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ─── Response interceptor: handle 401 / 403 globally ─────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Avoid redirect loops if already on the login page
      if (!window.location.pathname.startsWith('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  },
);

export default apiClient;
