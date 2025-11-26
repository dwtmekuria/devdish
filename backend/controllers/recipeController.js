const Recipe = require('../models/Recipe');

// Enhanced getRecipes function with advanced filtering
const getRecipes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search, 
      difficulty,
      maxTime,
      tags,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;
    
    const filter = { userId: req.user.id };
    
    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }
    
    // Difficulty filter
    if (difficulty && difficulty !== 'All') {
      filter.difficulty = difficulty;
    }
    
    // Max total time filter
    if (maxTime) {
      filter.$expr = {
        $lte: [
          { $add: ['$prepTime', '$cookTime'] },
          parseInt(maxTime)
        ]
      };
    }
    
    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      filter.tags = { $in: tagArray };
    }
    
    // Search across multiple fields
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } },
        { instructions: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    const recipes = await Recipe.find(filter)
      .select('-image.data') // Exclude image data from list
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Recipe.countDocuments(filter);
    
    // Get available tags for filtering
    const availableTags = await Recipe.distinct('tags', { userId: req.user.id });
    
    res.json({
      success: true,
      data: {
        recipes,
        totalPages: Math.ceil(total / limit),
        currentPage: parseInt(page),
        total,
        availableTags
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
    }).select('-image.data'); // Exclude image data from single fetch
    
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

const getUserTags = async (req, res) => {
  try {
    const tags = await Recipe.distinct('tags', { userId: req.user.id });
    
    res.json({
      success: true,
      data: { tags }
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching tags',
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
  getRecipeStats,
  getUserTags
};