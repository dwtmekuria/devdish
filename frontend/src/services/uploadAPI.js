import api from './api';

export const uploadAPI = {
  uploadImage: (formData, recipeId = null) => {
    const data = new FormData();
    if (recipeId) {
      data.append('recipeId', recipeId);
    }
    if (formData.get('image')) {
      data.append('image', formData.get('image'));
    }
    
    return api.post('/upload/image', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default uploadAPI;