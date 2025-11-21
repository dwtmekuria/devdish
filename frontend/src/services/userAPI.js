import api from './api';

export const userAPI = {
  // Get user profile
  getUserProfile: (userId) => api.get(`/users/${userId}/profile`),
  
  // Update user profile
  updateUserProfile: (profileData) => api.put('/users/profile', profileData),
  
  // Upload avatar
  uploadAvatar: (formData) => api.post('/users/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  
  // Get user's public recipes
  getUserRecipes: (userId, params = {}) => api.get(`/users/${userId}/recipes`, { params })
};

export default userAPI;