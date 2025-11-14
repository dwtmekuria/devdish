import api from './api';

export const recipeAPI = {
  // Get all recipes with optional filters
  getRecipes: (params = {}) => api.get('/recipes', { params }),
  
  // Get single recipe
  getRecipe: (id) => api.get(`/recipes/${id}`),
  
  // Create new recipe
  createRecipe: (recipeData) => api.post('/recipes', recipeData),
  
  // Update recipe
  updateRecipe: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  
  // Delete recipe
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  
  // Get recipe statistics
  getRecipeStats: () => api.get('/recipes/stats')
};

export default recipeAPI;