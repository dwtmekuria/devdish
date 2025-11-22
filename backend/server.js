const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const connectDB = require('./config/database');
const { swaggerDocument, swaggerUi } = require('./config/swagger'); // Updated import
const authRoutes = require('./routes/auth');
const recipeRoutes = require('./routes/recipes');
const publicRoutes = require('./routes/public');
const userRoutes = require('./routes/users');
const uploadRoutes = require('./routes/upload');

// Connect to database
connectDB();

const app = express();

// Security middleware for production
// if (process.env.NODE_ENV === 'production') {
//   const helmet = require('helmet');
//   const compression = require('compression');
//   const rateLimit = require('express-rate-limit');
  
//   app.use(helmet());
//   app.use(compression());

//   const limiter = rateLimit({
//     windowMs: 15 * 60 * 1000,
//     max: 100
//   });
//   app.use('/api/', limiter);
// }

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve avatar uploads
app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'DevDish API Documentation'
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

// Basic route
app.get('/api', (req, res) => {
  res.json({ 
    message: 'DevDish API is running!',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
    documentation: '/api-docs'
  });
});

// Handle undefined routes
app.use(/.*/, (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: Object.values(error.errors).map(e => e.message)
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : error.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 DevDish server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;