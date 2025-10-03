import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      clearAuthToken();
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

// Auth token management
export const setAuthToken = (token: string) => {
  localStorage.setItem('authToken', token);
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const clearAuthToken = () => {
  localStorage.removeItem('authToken');
};

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  verifyToken: () => api.post('/auth/verify-token'),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  deleteProfile: () => api.delete('/users/profile'),
  updatePreferences: (data: any) => api.put('/users/preferences', data),
  updateNotifications: (data: any) => api.put('/users/notifications', data),
};

// Recipe API
export const recipeAPI = {
  getRecipes: (params?: any) => api.get('/recipes', { params }),
  getRecipe: (id: string) => api.get(`/recipes/${id}`),
  createRecipe: (data: any) => api.post('/recipes', data),
  updateRecipe: (id: string, data: any) => api.put(`/recipes/${id}`, data),
  deleteRecipe: (id: string) => api.delete(`/recipes/${id}`),
  rateRecipe: (id: string, rating: number) => api.post(`/recipes/${id}/rate`, { rating }),
  getUserRecipes: (userId: string, params?: any) => api.get(`/recipes/user/${userId}`, { params }),
};

// Meal Plan API
export const mealPlanAPI = {
  getMealPlans: (params?: any) => api.get('/meal-plans', { params }),
  getMealPlan: (id: string) => api.get(`/meal-plans/${id}`),
  createMealPlan: (data: any) => api.post('/meal-plans', data),
  updateMealPlan: (id: string, data: any) => api.put(`/meal-plans/${id}`, data),
  deleteMealPlan: (id: string) => api.delete(`/meal-plans/${id}`),
  addMeal: (id: string, data: any) => api.post(`/meal-plans/${id}/meals`, data),
  removeMeal: (id: string, mealId: string) => api.delete(`/meal-plans/${id}/meals/${mealId}`),
};

// Grocery List API
export const groceryListAPI = {
  getGroceryLists: (params?: any) => api.get('/grocery-lists', { params }),
  getGroceryList: (id: string) => api.get(`/grocery-lists/${id}`),
  createGroceryList: (data: any) => api.post('/grocery-lists', data),
  generateGroceryList: (mealPlanId: string) => api.post('/grocery-lists/generate', { mealPlanId }),
  updateGroceryList: (id: string, data: any) => api.put(`/grocery-lists/${id}`, data),
  deleteGroceryList: (id: string) => api.delete(`/grocery-lists/${id}`),
  addItem: (id: string, data: any) => api.post(`/grocery-lists/${id}/items`, data),
  updateItem: (id: string, itemId: string, data: any) => api.put(`/grocery-lists/${id}/items/${itemId}`, data),
  removeItem: (id: string, itemId: string) => api.delete(`/grocery-lists/${id}/items/${itemId}`),
  toggleItem: (id: string, itemId: string) => api.post(`/grocery-lists/${id}/items/${itemId}/toggle`),
};

// AI API
export const aiAPI = {
  generateMealPlan: (data: any) => api.post('/ai/generate-meal-plan', data),
  suggestRecipes: (data: any) => api.post('/ai/suggest-recipes', data),
  analyzeNutrition: (mealPlanId: string) => api.post('/ai/analyze-nutrition', { mealPlanId }),
};

export default api;
