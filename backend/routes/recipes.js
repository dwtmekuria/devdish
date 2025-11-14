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
const { protect } = require('../middleware/auth');
const { validateRecipe, validateRecipeUpdate, handleValidationErrors } = require('../middleware/recipeValidation');

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/', getRecipes);
router.get('/stats', getRecipeStats);
router.get('/tags/user-tags', getUserTags);
router.get('/:id', getRecipe);
router.post('/', validateRecipe, handleValidationErrors, createRecipe);
router.put('/:id',validateRecipeUpdate,handleValidationErrors,updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;