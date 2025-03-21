const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');

// Mock data storage - in production, use a database
let librariesCache = [];

/**
 * Get all libraries
 * @returns {Promise<Array>} Array of libraries
 */
exports.getLibraries = async () => {
  try {
    if (librariesCache.length > 0) {
      return librariesCache;
    }
    
    // In a real implementation, this would likely come from a database
    // For demonstration, we'll use a file-based approach
    const dataDir = path.join(__dirname, '../../data/libraries');
    const libraries = [];
    
    try {
      const files = await fs.readdir(dataDir);
      
      for (const file of files) {
        if (path.extname(file) === '.json') {
          const data = await fs.readFile(path.join(dataDir, file), 'utf8');
          const library = JSON.parse(data);
          libraries.push(library);
        }
      }
    } catch (err) {
      // Directory might not exist yet in development
      if (err.code !== 'ENOENT') {
        throw err;
      }
      
      // Use sample data for demonstration
      libraries.push(
        {
          name: 'react',
          description: 'A JavaScript library for building user interfaces',
          website: 'https://reactjs.org',
          repository: 'https://github.com/facebook/react',
          versions: ['18.2.0', '18.1.0', '17.0.2', '16.14.0'],
          latestVersion: '18.2.0'
        },
        {
          name: 'vue',
          description: 'Progressive JavaScript Framework',
          website: 'https://vuejs.org',
          repository: 'https://github.com/vuejs/vue',
          versions: ['3.3.4', '3.2.47', '2.7.14'],
          latestVersion: '3.3.4'
        },
        {
          name: 'angular',
          description: 'Angular is a platform for building mobile and desktop web applications',
          website: 'https://angular.io',
          repository: 'https://github.com/angular/angular',
          versions: ['16.1.0', '15.2.9', '14.3.0'],
          latestVersion: '16.1.0'
        }
      );
    }
    
    librariesCache = libraries;
    return libraries;
  } catch (error) {
    logger.error('Error getting libraries:', error);
    throw error;
  }
};

/**
 * Get a specific library by name
 * @param {string} name - Library name
 * @returns {Promise<Object|null>} Library object or null if not found
 */
exports.getLibrary = async (name) => {
  try {
    const libraries = await exports.getLibraries();
    return libraries.find(lib => lib.name.toLowerCase() === name.toLowerCase()) || null;
  } catch (error) {
    logger.error(`Error getting library ${name}:`, error);
    throw error;
  }
};

/**
 * Get all versions of a library
 * @param {string} name - Library name
 * @returns {Promise<Array|null>} Array of versions or null if library not found
 */
exports.getVersions = async (name) => {
  try {
    const library = await exports.getLibrary(name);
    
    if (!library) {
      return null;
    }
    
    return library.versions;
  } catch (error) {
    logger.error(`Error getting versions for library ${name}:`, error);
    throw error;
  }
};

/**
 * Get all components of a library
 * @param {string} name - Library name
 * @param {string} [version] - Library version (optional, defaults to latest)
 * @returns {Promise<Array|null>} Array of components or null if library not found
 */
exports.getComponents = async (name, version) => {
  try {
    const library = await exports.getLibrary(name);
    
    if (!library) {
      return null;
    }
    
    const targetVersion = version || library.latestVersion;
    
    // In a real implementation, this would be fetched from storage
    // For demonstration, we'll use mock data
    
    // Mock directory structure for components
    const componentsDataDir = path.join(__dirname, `../../data/libraries/${name}/${targetVersion}/components`);
    const components = [];
    
    try {
      const files = await fs.readdir(componentsDataDir);
      
      for (const file of files) {
        if (path.extname(file) === '.json') {
          const data = await fs.readFile(path.join(componentsDataDir, file), 'utf8');
          const component = JSON.parse(data);
          components.push(component);
        }
      }
      
      return components;
    } catch (err) {
      // Directory might not exist yet in development
      if (err.code !== 'ENOENT') {
        throw err;
      }
      
      // Mock component data based on library
      if (name === 'react') {
        return [
          { name: 'useState', type: 'hook', path: 'hooks/useState' },
          { name: 'useEffect', type: 'hook', path: 'hooks/useEffect' },
          { name: 'useContext', type: 'hook', path: 'hooks/useContext' },
          { name: 'React.Component', type: 'class', path: 'component/Component' },
          { name: 'React.Fragment', type: 'component', path: 'component/Fragment' }
        ];
      } else if (name === 'vue') {
        return [
          { name: 'ref', type: 'reactivity', path: 'reactivity/ref' },
          { name: 'computed', type: 'reactivity', path: 'reactivity/computed' },
          { name: 'watch', type: 'reactivity', path: 'reactivity/watch' },
          { name: 'defineComponent', type: 'component', path: 'component/defineComponent' },
          { name: 'defineProps', type: 'component', path: 'component/defineProps' }
        ];
      } else if (name === 'angular') {
        return [
          { name: 'Component', type: 'decorator', path: 'decorator/Component' },
          { name: 'Injectable', type: 'decorator', path: 'decorator/Injectable' },
          { name: 'NgModule', type: 'decorator', path: 'decorator/NgModule' },
          { name: 'Input', type: 'decorator', path: 'decorator/Input' },
          { name: 'Output', type: 'decorator', path: 'decorator/Output' }
        ];
      }
      
      return [];
    }
  } catch (error) {
    logger.error(`Error getting components for library ${name}:`, error);
    throw error;
  }
};

/**
 * Get documentation for a specific component
 * @param {string} name - Library name
 * @param {string} componentPath - Component path
 * @param {string} [version] - Library version (optional, defaults to latest)
 * @returns {Promise<Object|null>} Component documentation or null if not found
 */
exports.getComponent = async (name, componentPath, version) => {
  try {
    const library = await exports.getLibrary(name);
    
    if (!library) {
      return null;
    }
    
    const targetVersion = version || library.latestVersion;
    
    // In a real implementation, this would be fetched from storage
    // For demonstration, we'll use mock data
    
    // Mock specific component data
    const componentDataPath = path.join(__dirname, `../../data/libraries/${name}/${targetVersion}/components/${componentPath}.json`);
    
    try {
      const data = await fs.readFile(componentDataPath, 'utf8');
      return JSON.parse(data);
    } catch (err) {
      // File might not exist yet in development
      if (err.code !== 'ENOENT') {
        throw err;
      }
      
      // Generate mock documentation based on component path
      return {
        name: componentPath.split('/').pop(),
        path: componentPath,
        library: name,
        version: targetVersion,
        description: `Documentation for ${componentPath} in ${name} ${targetVersion}`,
        example: `// Example usage of ${componentPath} in ${name} ${targetVersion}\n// This is mock data for demonstration purposes`,
        parameters: [
          { name: 'param1', type: 'string', description: 'First parameter' },
          { name: 'param2', type: 'number', description: 'Second parameter' }
        ],
        returns: {
          type: 'object',
          description: 'Return value description'
        },
        related: [
          'some/related/component1',
          'some/related/component2'
        ]
      };
    }
  } catch (error) {
    logger.error(`Error getting component ${componentPath} for library ${name}:`, error);
    throw error;
  }
};
