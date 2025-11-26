const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const Recipe = require('../models/Recipe');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Upload recipe image endpoint
router.post('/image', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    // If recipeId is provided, update the recipe's image
    if (req.body.recipeId) {
      const recipe = await Recipe.findOne({
        _id: req.body.recipeId,
        userId: req.user.id
      });

      if (!recipe) {
        return res.status(404).json({
          success: false,
          message: 'Recipe not found'
        });
      }

      recipe.image = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        filename: req.file.originalname
      };

      await recipe.save();

      return res.json({
        success: true,
        message: 'Recipe image uploaded successfully',
        data: {
          recipeId: recipe._id
        }
      });
    }

    // If no recipeId, just return the image data for later use
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        image: {
          data: req.file.buffer.toString('base64'), // Send as base64 for frontend
          contentType: req.file.mimetype,
          filename: req.file.originalname
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

module.exports = router;