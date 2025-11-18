import api from './api';

export const publicAPI = {
  // Get public recipes (no auth required)
  getPublicRecipes: (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => 
        value !== '' && value !== 'All'
      )
    );
    
    return api.get('/public/recipes', { params: cleanParams });
  },
  
  // Get single public recipe
  getPublicRecipe: (publicId) => api.get(`/public/recipes/${publicId}`),
  
  // Like/unlike recipe
  toggleLike: (recipeId) => api.post(`/public/recipes/${recipeId}/like`),
  
  // Get user's liked recipes
  getLikedRecipes: () => api.get('/public/recipes/liked/mine')
};

export default publicAPI;