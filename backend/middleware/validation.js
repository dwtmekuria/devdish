const { validationResult } = require('express-validator');

const validateRegistration = [
  require('express-validator').body('username')
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long')
    .trim()
    .escape(),
  
  require('express-validator').body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  require('express-validator').body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

const validateLogin = [
  require('express-validator').body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  require('express-validator').body('password')
    .notEmpty()
    .withMessage('Password is required')
];

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
  validateRegistration,
  validateLogin,
  handleValidationErrors
};