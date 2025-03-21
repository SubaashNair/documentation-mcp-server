const { getLibraries, getLibrary, getVersions, getComponents, getComponent } = require('../services/libraryService');
const logger = require('../utils/logger');

/**
 * Get all libraries
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getAllLibraries = async (req, res) => {
  try {
    const libraries = await getLibraries();
    res.status(200).json({
      status: 'success',
      data: {
        libraries
      }
    });
  } catch (error) {
    logger.error('Error getting all libraries:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching libraries'
    });
  }
};

/**
 * Get a specific library by name
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLibraryByName = async (req, res) => {
  try {
    const { name } = req.params;
    const library = await getLibrary(name);
    
    if (!library) {
      return res.status(404).json({
        status: 'fail',
        message: `Library '${name}' not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        library
      }
    });
  } catch (error) {
    logger.error(`Error getting library ${req.params.name}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching library information'
    });
  }
};

/**
 * Get all versions of a library
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLibraryVersions = async (req, res) => {
  try {
    const { name } = req.params;
    const versions = await getVersions(name);
    
    if (!versions) {
      return res.status(404).json({
        status: 'fail',
        message: `Library '${name}' not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        versions
      }
    });
  } catch (error) {
    logger.error(`Error getting versions for library ${req.params.name}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching library versions'
    });
  }
};

/**
 * Get all components of a library
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getLibraryComponents = async (req, res) => {
  try {
    const { name } = req.params;
    const { version } = req.query;
    
    const components = await getComponents(name, version);
    
    if (!components) {
      return res.status(404).json({
        status: 'fail',
        message: `Library '${name}' ${version ? `version '${version}' ` : ''}not found`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        components
      }
    });
  } catch (error) {
    logger.error(`Error getting components for library ${req.params.name}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching library components'
    });
  }
};

/**
 * Get documentation for a specific component
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getComponentDocumentation = async (req, res) => {
  try {
    const { name, componentPath } = req.params;
    const { version } = req.query;
    
    const component = await getComponent(name, componentPath, version);
    
    if (!component) {
      return res.status(404).json({
        status: 'fail',
        message: `Component '${componentPath}' not found in library '${name}' ${version ? `version '${version}'` : ''}`
      });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        component
      }
    });
  } catch (error) {
    logger.error(`Error getting component ${req.params.componentPath} for library ${req.params.name}:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error fetching component documentation'
    });
  }
};
