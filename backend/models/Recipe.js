const mongoose = require('mongoose');

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Ingredient name is required'],
    trim: true
  },
  quantity: {
    type: Number,
    required: [true, 'Ingredient quantity is required'],
    min: [0, 'Quantity cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Ingredient unit is required'],
    trim: true,
    enum: ['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'pinch', 'to taste']
  },
  notes: {
    type: String,
    trim: true,
    default: ''
  }
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Recipe title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  ingredients: [ingredientSchema],
  instructions: [{
    type: String,
    required: [true, 'Instruction steps are required'],
    trim: true
  }],
  prepTime: {
    type: Number, // in minutes
    required: [true, 'Prep time is required'],
    min: [0, 'Prep time cannot be negative']
  },
  cookTime: {
    type: Number, // in minutes
    required: [true, 'Cook time is required'],
    min: [0, 'Cook time cannot be negative']
  },
  servings: {
    type: Number,
    required: [true, 'Servings is required'],
    min: [1, 'Servings must be at least 1']
  },
  difficulty: {
    type: String,
    required: [true, 'Difficulty level is required'],
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage', 'Other'],
    default: 'Other'
  },
  tags: [{
    type: String,
    trim: true
  }],
  image: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Index for better search performance
recipeSchema.index({ title: 'text', description: 'text' });
recipeSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Recipe', recipeSchema);