const User = require('../models/User');
const Recipe = require('../models/Recipe');

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's public recipes count
    const publicRecipesCount = await Recipe.countDocuments({
      userId: req.params.userId,
      isPublic: true
    });

    // Get user's total recipes count
    const totalRecipesCount = await Recipe.countDocuments({
      userId: req.params.userId
    });

    res.json({
      success: true,
      data: {
        user: {
          ...user.toObject(),
          stats: {
            publicRecipes: publicRecipesCount,
            totalRecipes: totalRecipesCount
          }
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { username, bio, location, website, socialMedia } = req.body;
    
    // Check if username is taken by another user
    if (username) {
      const existingUser = await User.findOne({ 
        username, 
        _id: { $ne: req.user.id } 
      });
      
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'Username is already taken'
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        username,
        bio,
        location,
        website,
        socialMedia
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Get user's public recipes
const getUserPublicRecipes = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;

    const recipes = await Recipe.find({
      userId: req.params.userId,
      isPublic: true
    })
    .sort({ createdAt: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);

    const total = await Recipe.countDocuments({
      userId: req.params.userId,
      isPublic: true
    });

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
      message: 'Error fetching user recipes',
      error: error.message
    });
  }
};

// Upload user avatar
const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const avatarUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Avatar updated successfully',
      data: { user: updatedUser }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading avatar',
      error: error.message
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserPublicRecipes,
  uploadAvatar
};