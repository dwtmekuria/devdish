const express = require('express');
const { 
  getPublicRecipe, 
  getPublicRecipes,
  toggleLike,
  getLikedRecipes
} = require('../controllers/publicController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Public routes (no authentication required)
router.get('/recipes', getPublicRecipes);
router.get('/recipes/:publicId', getPublicRecipe);

// Protected routes (authentication required)
router.post('/recipes/:id/like', protect, toggleLike);
router.get('/recipes/liked/mine', protect, getLikedRecipes);

module.exports = router;