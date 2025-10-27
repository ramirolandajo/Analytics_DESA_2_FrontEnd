import axios from 'axios';

/**
 * Axios instance configured for the analytics module.
 * The backend base URL is expected from VITE_API_BASE_URL environment variable.
 */
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Allow pages to show contextual messages for unimplemented endpoints.
    if (error.response?.status === 404) {
      console.warn('Endpoint no encontrado:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default apiClient;
