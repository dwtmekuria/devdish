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
const createSwaggerHTML = require('./config/swagger-html');

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

const allowedOrigins = [
  'http://localhost:5173',
  'https://devdish.vercel.app',
  process.env.FRONTEND_URL,
];
app.use(cors({
origin: function (origin, callback) {

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked request from origin: ${origin}`);
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Serve static files
// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// // Serve avatar uploads
// app.use('/uploads/avatars', express.static(path.join(__dirname, 'uploads/avatars')));

//Swagger Documentation
// For production: Use custom HTML with CDN
if (process.env.NODE_ENV === 'production') {
  app.get('/api-docs', (req, res) => {
    res.send(createSwaggerHTML(swaggerDocument));
  });
} else {
  // For development: Use swagger-ui-express normally
  const swaggerUi = require('swagger-ui-express');
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customSiteTitle: "DevDish API Documentation",
    explorer: true
  }));
}

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