const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Get public recipe by public ID
const getPublicRecipe = async (req, res) => {
  try {
    const { publicId } = req.params;

    const recipe = await Recipe.findOne({ 
      publicId,
      isPublic: true 
    }).populate('userId', 'username avatar');

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found or not public'
      });
    }

    // Increment view count
    recipe.views += 1;
    await recipe.save();

    res.json({
      success: true,
      data: { recipe }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching public recipe',
      error: error.message
    });
  }
};

// Get all public recipes with pagination
const getPublicRecipes = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 12, 
      category, 
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = { isPublic: true };

    // Category filter
    if (category && category !== 'All') {
      filter.category = category;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'ingredients.name': { $regex: search, $options: 'i' } }
      ];
    }

    // Sort configuration
    const sortConfig = {};
    sortConfig[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const recipes = await Recipe.find(filter)
      .populate('userId', 'username avatar')
      .sort(sortConfig)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-ingredients.notes -instructions');

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
      message: 'Error fetching public recipes',
      error: error.message
    });
  }
};

// Toggle like on a recipe
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recipe = await Recipe.findById(id);

    if (!recipe) {
      return res.status(404).json({
        success: false,
        message: 'Recipe not found'
      });
    }

    const hasLiked = recipe.likes.includes(userId);
    
    if (hasLiked) {
      // Unlike
      recipe.likes = recipe.likes.filter(like => like.toString() !== userId);
    } else {
      // Like
      recipe.likes.push(userId);
    }

    await recipe.save();

    res.json({
      success: true,
      data: {
        liked: !hasLiked,
        likeCount: recipe.likes.length
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling like',
      error: error.message
    });
  }
};

// Get user's liked recipes
const getLikedRecipes = async (req, res) => {
  try {
    const userId = req.user.id;

    const recipes = await Recipe.find({
      likes: userId,
      isPublic: true
    }).populate('userId', 'username avatar');

    res.json({
      success: true,
      data: { recipes }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching liked recipes',
      error: error.message
    });
  }
};

module.exports = {
  getPublicRecipe,
  getPublicRecipes,
  toggleLike,
  getLikedRecipes
};