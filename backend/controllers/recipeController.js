const Recipe = require('../models/Recipe');

// Get all recipes for current user
const getRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    
    const filter = { userId: req.user.id };
    
    // Add category filter if provided
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // Add search filter if provided
    if (search) {
      filter.$text = { $search: search };
    }
    
    const recipes = await Recipe.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Recipe.countDocuments(filter);
    
    res.json({
      success: true,
      data: {
        recipes,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipes',
      error: error.message
    });
  }
};

// Get single recipe
const getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    res.json({
      success: true,
      data: { recipe }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe',
      error: error.message
    });
  }
};

// Create new recipe
const createRecipe = async (req, res) => {
  try {
    const recipeData = {
      ...req.body,
      userId: req.user.id
    };
    
    const recipe = await Recipe.create(recipeData);
    
    res.status(201).json({
      success: true,
      message: 'Recipe created successfully',
      data: { recipe }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating recipe',
      error: error.message
    });
  }
};

// Update recipe
const updateRecipe = async (req, res) => {
  try {
    let recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    recipe = await Recipe.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    res.json({
      success: true,
      message: 'Recipe updated successfully',
      data: { recipe }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating recipe',
      error: error.message
    });
  }
};

// Delete recipe
const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      userId: req.user.id
    });
    
    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }
    
    await Recipe.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'Recipe deleted successfully'
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting recipe',
      error: error.message
    });
  }
};

// Get recipe statistics
const getRecipeStats = async (req, res) => {
  try {
    const totalRecipes = await Recipe.countDocuments({ userId: req.user.id });
    
    const categoryStats = await Recipe.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);
    
    const difficultyStats = await Recipe.aggregate([
      { $match: { userId: req.user.id } },
      { $group: { _id: '$difficulty', count: { $sum: 1 } } }
    ]);
    
    res.json({
      success: true,
      data: {
        totalRecipes,
        categoryStats,
        difficultyStats
      }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching recipe statistics',
      error: error.message
    });
  }
};

module.exports = {
  getRecipes,
  getRecipe,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeStats
};