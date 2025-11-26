const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Get recipe image
const getRecipeImage = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe || !recipe.image || !recipe.image.data) {
      return res.status(404).json({
        success: false,
        message: 'Image not found'
      });
    }

    // Set proper content type
    res.set('Content-Type', recipe.image.contentType);
    
    // Send the image buffer
    res.send(recipe.image.data);
    
  } catch (error) {
    console.error('Error fetching recipe image:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching image'
    });
  }
};

// Get user avatar
const getUserAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    
    if (!user || !user.avatar || !user.avatar.data) {
      return res.status(404).json({
        success: false,
        message: 'Avatar not found'
      });
    }

    // Set proper content type
    res.set('Content-Type', user.avatar.contentType);
    
    // Send the image buffer
    res.send(user.avatar.data);
    
  } catch (error) {
    console.error('Error fetching user avatar:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching avatar'
    });
  }
};

module.exports = {
  getRecipeImage,
  getUserAvatar
};