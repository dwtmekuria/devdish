import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Add this line
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('devdish_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('devdish_token');
      localStorage.removeItem('devdish_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// Helper function to get image URLs
export const getImageUrl = {
  recipe: (recipeId) => `${API_URL}/recipes/${recipeId}/image`,
  avatar: (userId) => `${API_URL}/users/${userId}/avatar`,
};

export default api;