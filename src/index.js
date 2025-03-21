require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yaml');
const fs = require('fs');

// Import routes
const libraryRoutes = require('./routes/libraryRoutes');
const searchRoutes = require('./routes/searchRoutes');
const apiRoutes = require('./routes/apiRoutes');

// Import services
const { initializeDocumentation } = require('./services/documentationService');
const logger = require('./utils/logger');

// Create Express server
const app = express();

// Load Swagger documentation
let swaggerDocument;
try {
  const file = fs.readFileSync(path.resolve(__dirname, './swagger.yaml'), 'utf8');
  swaggerDocument = YAML.parse(file);
} catch (err) {
  logger.error('Error loading Swagger documentation:', err);
}

// Set up middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, '../public')));

// Set up routes
app.use('/api/libraries', libraryRoutes);
app.use('/api/search', searchRoutes);
app.use('/api', apiRoutes);

// Swagger documentation
if (swaggerDocument) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Home route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);
  
  try {
    // Initialize documentation fetching
    await initializeDocumentation();
    logger.info('Documentation initialization complete');
  } catch (error) {
    logger.error('Error initializing documentation:', error);
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection:', err);
});

module.exports = app; // Export for testing
