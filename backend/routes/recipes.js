const express = require('express');
const {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats,
  getUserTags
} = require('../controllers/recipeController');
const { getRecipeImage } = require('../controllers/imageController');
const { protect } = require('../middleware/auth');
const { validateRecipe, validateRecipeUpdate, handleValidationErrors } = require('../middleware/recipeValidation');

const router = express.Router();

// Public route for recipe images
router.get('/:id/image', getRecipeImage);

// All other routes are protected
router.use(protect);

router.get('/', getRecipes);
router.get('/stats', getRecipeStats);
router.get('/tags/user-tags', getUserTags);
router.get('/:id', getRecipe);
router.post('/', validateRecipe, handleValidationErrors, createRecipe);
router.put('/:id', validateRecipeUpdate, handleValidationErrors, updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;