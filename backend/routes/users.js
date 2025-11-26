const express = require('express');
const multer = require('multer');
const {
  getUserProfile,
  updateUserProfile,
  getUserPublicRecipes,
  uploadAvatar
} = require('../controllers/userController');
const { getUserAvatar } = require('../controllers/imageController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Public routes
router.get('/:userId/profile', getUserProfile);
router.get('/:userId/recipes', getUserPublicRecipes);
router.get('/:userId/avatar', getUserAvatar); // Make this public

// Protected routes
router.use(protect);
router.put('/profile', updateUserProfile);
router.post('/avatar', upload.single('avatar'), uploadAvatar);

module.exports = router;