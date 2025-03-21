const express = require('express');
const router = express.Router();
const { 
  searchAllLibraries,
  searchLibrary,
  getPopularSearches
} = require('../controllers/searchController');

/**
 * @route   GET /api/search
 * @desc    Search across all libraries
 * @access  Public
 */
router.get('/', searchAllLibraries);

/**
 * @route   GET /api/search/:library
 * @desc    Search within a specific library
 * @access  Public
 */
router.get('/:library', searchLibrary);

/**
 * @route   GET /api/search/popular
 * @desc    Get popular searches
 * @access  Public
 */
router.get('/popular/terms', getPopularSearches);

module.exports = router;
