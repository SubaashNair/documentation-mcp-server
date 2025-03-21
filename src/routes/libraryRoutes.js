const express = require('express');
const router = express.Router();
const { 
  getAllLibraries, 
  getLibraryByName, 
  getLibraryVersions, 
  getLibraryComponents, 
  getComponentDocumentation 
} = require('../controllers/libraryController');

/**
 * @route   GET /api/libraries
 * @desc    Get all libraries
 * @access  Public
 */
router.get('/', getAllLibraries);

/**
 * @route   GET /api/libraries/:name
 * @desc    Get a specific library by name
 * @access  Public
 */
router.get('/:name', getLibraryByName);

/**
 * @route   GET /api/libraries/:name/versions
 * @desc    Get all versions of a library
 * @access  Public
 */
router.get('/:name/versions', getLibraryVersions);

/**
 * @route   GET /api/libraries/:name/components
 * @desc    Get all components of a library
 * @access  Public
 */
router.get('/:name/components', getLibraryComponents);

/**
 * @route   GET /api/libraries/:name/components/:componentPath*
 * @desc    Get documentation for a specific component
 * @access  Public
 */
router.get('/:name/components/:componentPath(*)', getComponentDocumentation);

module.exports = router;
