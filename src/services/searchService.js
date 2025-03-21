const lunr = require('lunr');
const { getLibraries, getLibrary, getComponents } = require('./libraryService');
const logger = require('../utils/logger');

// Cache for search indexes
const searchIndexes = {};
// Cache for popular search terms
let popularSearches = [];

/**
 * Initialize or get search index for a library
 * @param {string} libraryName - Library name
 * @param {string} [version] - Library version (optional, defaults to latest)
 * @returns {Promise<Object>} Lunr search index
 */
const getSearchIndex = async (libraryName, version) => {
  const cacheKey = `${libraryName}${version ? `_${version}` : ''}`;
  
  // Return from cache if available
  if (searchIndexes[cacheKey]) {
    return searchIndexes[cacheKey];
  }
  
  const library = await getLibrary(libraryName);
  
  if (!library) {
    return null;
  }
  
  const targetVersion = version || library.latestVersion;
  const components = await getComponents(libraryName, targetVersion);
  
  // Build search index
  const idx = lunr(function() {
    this.ref('path');
    this.field('name', { boost: 10 });
    this.field('description', { boost: 5 });
    this.field('type');
    this.field('example');
    
    // Add each component to the index
    components.forEach(component => {
      this.add({
        path: component.path,
        name: component.name,
        description: component.description || '',
        type: component.type || '',
        example: component.example || ''
      });
    });
  });
  
  // Cache the index
  searchIndexes[cacheKey] = {
    index: idx,
    components: components
  };
  
  return searchIndexes[cacheKey];
};

/**
 * Search across all libraries
 * @param {string} query - Search query
 * @param {number} limit - Maximum results to return
 * @param {number} offset - Results offset for pagination
 * @returns {Promise<Array>} Search results
 */
exports.searchDocumentation = async (query, limit = 20, offset = 0) => {
  try {
    const libraries = await getLibraries();
    let allResults = [];
    
    // Track this search term
    trackSearchTerm(query);
    
    // Search each library
    for (const library of libraries) {
      const libraryResults = await exports.searchLibraryDocumentation(
        library.name,
        query,
        null, // Use latest version
        limit,
        0 // No offset for individual libraries
      );
      
      if (libraryResults && libraryResults.length > 0) {
        // Add library info to each result
        const enhancedResults = libraryResults.map(result => ({
          ...result,
          library: library.name,
          libraryVersion: library.latestVersion
        }));
        
        allResults = allResults.concat(enhancedResults);
      }
    }
    
    // Sort by score
    allResults.sort((a, b) => b.score - a.score);
    
    // Apply pagination
    return allResults.slice(offset, offset + limit);
  } catch (error) {
    logger.error(`Error searching documentation:`, error);
    throw error;
  }
};

/**
 * Search within a specific library
 * @param {string} libraryName - Library name
 * @param {string} query - Search query
 * @param {string} [version] - Library version (optional, defaults to latest)
 * @param {number} limit - Maximum results to return
 * @param {number} offset - Results offset for pagination
 * @returns {Promise<Array|null>} Search results or null if library not found
 */
exports.searchLibraryDocumentation = async (libraryName, query, version, limit = 20, offset = 0) => {
  try {
    // Track this search term
    trackSearchTerm(query);
    
    const searchData = await getSearchIndex(libraryName, version);
    
    if (!searchData) {
      return null;
    }
    
    const { index, components } = searchData;
    
    // Perform search
    const searchResults = index.search(query);
    
    // Map results to component data
    const results = searchResults.map(result => {
      const component = components.find(comp => comp.path === result.ref);
      
      return {
        ...component,
        score: result.score,
        matches: result.matchData.metadata
      };
    });
    
    // Apply pagination
    return results.slice(offset, offset + limit);
  } catch (error) {
    logger.error(`Error searching library ${libraryName}:`, error);
    throw error;
  }
};

/**
 * Track a search term for popularity
 * @param {string} term - Search term
 */
const trackSearchTerm = (term) => {
  const normalizedTerm = term.toLowerCase().trim();
  
  if (normalizedTerm.length < 2) {
    return;
  }
  
  const existingTerm = popularSearches.find(item => item.term === normalizedTerm);
  
  if (existingTerm) {
    existingTerm.count += 1;
    existingTerm.lastSearched = new Date();
  } else {
    popularSearches.push({
      term: normalizedTerm,
      count: 1,
      lastSearched: new Date()
    });
  }
  
  // Sort by count
  popularSearches.sort((a, b) => b.count - a.count);
  
  // Limit the size of the array
  if (popularSearches.length > 100) {
    popularSearches = popularSearches.slice(0, 100);
  }
};

/**
 * Get popular search terms
 * @param {number} limit - Maximum number of terms to return
 * @returns {Promise<Array>} Popular search terms
 */
exports.getPopularTerms = async (limit = 10) => {
  return popularSearches.slice(0, limit);
};

/**
 * Reset search index for a library
 * @param {string} libraryName - Library name
 * @param {string} [version] - Library version (optional)
 */
exports.resetSearchIndex = (libraryName, version) => {
  if (version) {
    const cacheKey = `${libraryName}_${version}`;
    delete searchIndexes[cacheKey];
  } else {
    // Remove all indexes for the library
    Object.keys(searchIndexes).forEach(key => {
      if (key.startsWith(`${libraryName}_`)) {
        delete searchIndexes[key];
      }
    });
    // Also remove the latest version index
    delete searchIndexes[libraryName];
  }
};

/**
 * Reset all search indexes
 */
exports.resetAllSearchIndexes = () => {
  Object.keys(searchIndexes).forEach(key => {
    delete searchIndexes[key];
  });
};
