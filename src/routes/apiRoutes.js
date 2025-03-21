const express = require('express');
const router = express.Router();
const { 
  getApiStatus,
  refreshDocumentation
} = require('../controllers/apiController');

/**
 * @route   GET /api/status
 * @desc    Get API status and information
 * @access  Public
 */
router.get('/status', getApiStatus);

/**
 * @route   POST /api/refresh
 * @desc    Trigger a manual refresh of documentation
 * @access  Private (should be protected with API key)
 */
router.post('/refresh', refreshDocumentation);

module.exports = router;
