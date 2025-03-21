const { refreshAllDocumentation } = require('../services/documentationService');
const { getLibraries } = require('../services/libraryService');
const logger = require('../utils/logger');
const pkg = require('../../package.json');

/**
 * Get API status and information
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getApiStatus = async (req, res) => {
  try {
    const libraries = await getLibraries();
    
    res.status(200).json({
      status: 'success',
      data: {
        version: pkg.version,
        name: pkg.name,
        description: pkg.description,
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        libraries: libraries.length,
        libraryNames: libraries.map(lib => lib.name)
      }
    });
  } catch (error) {
    logger.error('Error getting API status:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching API status'
    });
  }
};

/**
 * Trigger a manual refresh of documentation
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.refreshDocumentation = async (req, res) => {
  try {
    // Check for API key or other authentication
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.API_KEY) {
      return res.status(401).json({
        status: 'fail',
        message: 'Unauthorized. Invalid API key'
      });
    }
    
    // Get specific libraries to refresh, or refresh all
    const { libraries } = req.body;
    
    // Start refresh in background
    res.status(202).json({
      status: 'success',
      message: 'Documentation refresh started',
      refreshing: libraries || 'all libraries'
    });
    
    // Perform refresh after responding
    await refreshAllDocumentation(libraries);
    
    logger.info(`Documentation refresh completed for ${libraries ? libraries.join(', ') : 'all libraries'}`);
  } catch (error) {
    logger.error('Error refreshing documentation:', error);
    // Error already sent response, so just log it
  }
};
