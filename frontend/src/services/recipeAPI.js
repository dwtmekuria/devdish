import api from './api';

export const recipeAPI = {

  // Enhanced getRecipes with all filter parameters
  getRecipes: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => 
        value !== '' && value !== 'All' && !(Array.isArray(value) && value.length === 0)
      )
    );
    
    return api.get('/recipes', { params: cleanParams });
  },
  
  // Get single recipe
  getRecipe: (id) => api.get(`/recipes/${id}`),
  
  // Create new recipe
  createRecipe: (recipeData) => api.post('/recipes', recipeData),
  
  // Update recipe
  updateRecipe: (id, recipeData) => api.put(`/recipes/${id}`, recipeData),
  
  // Delete recipe
  deleteRecipe: (id) => api.delete(`/recipes/${id}`),
  
  // Get recipe statistics
  getRecipeStats: () => api.get('/recipes/stats'),

    // Get user tags
  getUserTags: () => api.get('/recipes/tags/user-tags'),
  
};

export default recipeAPI;