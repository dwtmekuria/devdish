const { body } = require('express-validator');
const { validationResult } = require('express-validator');

const validateRecipe = [
  body('title')
    .notEmpty()
    .withMessage('Recipe title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters')
    .trim()
    .escape(),

  body('description')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters')
    .trim()
    .escape(),

  body('ingredients')
    .isArray({ min: 1 })
    .withMessage('At least one ingredient is required'),

  body('ingredients.*.name')
    .notEmpty()
    .withMessage('Ingredient name is required')
    .trim()
    .escape(),

  body('ingredients.*.quantity')
    .isFloat({ min: 0 })
    .withMessage('Ingredient quantity must be a positive number'),

  body('ingredients.*.unit')
    .notEmpty()
    .withMessage('Ingredient unit is required')
    .isIn(['g', 'kg', 'ml', 'l', 'cup', 'tbsp', 'tsp', 'piece', 'pinch', 'to taste'])
    .withMessage('Invalid unit'),

  body('instructions')
    .isArray({ min: 1 })
    .withMessage('At least one instruction is required'),

  body('instructions.*')
    .notEmpty()
    .withMessage('Instruction cannot be empty')
    .trim()
    .escape(),

  body('prepTime')
    .isInt({ min: 0 })
    .withMessage('Prep time must be a positive number'),

  body('cookTime')
    .isInt({ min: 0 })
    .withMessage('Cook time must be a positive number'),

  body('servings')
    .isInt({ min: 1 })
    .withMessage('Servings must be at least 1'),

  body('difficulty')
    .isIn(['Easy', 'Medium', 'Hard'])
    .withMessage('Invalid difficulty level'),

  body('category')
    .isIn(['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage', 'Other'])
    .withMessage('Invalid category'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean')
];

const validateRecipeUpdate = validateRecipe.map(validation => validation.optional());

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

module.exports = {
  validateRecipe,
  validateRecipeUpdate,
  handleValidationErrors
};