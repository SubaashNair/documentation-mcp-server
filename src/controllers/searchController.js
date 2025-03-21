const { searchDocumentation, searchLibraryDocumentation, getPopularTerms } = require('../services/searchService');
const logger = require('../utils/logger');

/**
 * Search across all libraries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchAllLibraries = async (req, res) => {
  try {
    const { q, limit = 20, offset = 0 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'fail',
        message: 'Search query is required'
      });
    }
    
    const results = await searchDocumentation(q, parseInt(limit), parseInt(offset));
    
    res.status(200).json({
      status: 'success',
      data: {
        query: q,
        results,
        count: results.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error(`Error searching across libraries:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error performing search'
    });
  }
};

/**
 * Search within a specific library
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.searchLibrary = async (req, res) => {
  try {
    const { library } = req.params;
    const { q, version, limit = 20, offset = 0 } = req.query;
    
    if (!q) {
      return res.status(400).json({
        status: 'fail',
        message: 'Search query is required'
      });
    }
    
    const results = await searchLibraryDocumentation(
      library,
      q,
      version,
      parseInt(limit),
      parseInt(offset)
    );
    
    if (results === null) {
      return res.status(404).json({
        status: 'fail',
        message: `Library '${library}' not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        library,
        version: version || 'latest',
        query: q,
        results,
        count: results.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    logger.error(`Error searching library ${req.params.library}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error performing search'
    });
  }
};

/**
 * Get popular searches
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPopularSearches = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const popularTerms = await getPopularTerms(parseInt(limit));
    
    res.status(200).json({
      status: 'success',
      data: {
        terms: popularTerms
      }
    });
  } catch (error) {
    logger.error(`Error getting popular searches:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching popular searches'
    });
  }
};
