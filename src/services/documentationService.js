const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs').promises;
const path = require('path');
const cron = require('node-cron');
const { getLibraries } = require('./libraryService');
const { resetSearchIndex, resetAllSearchIndexes } = require('./searchService');
const logger = require('../utils/logger');

// Flag to track initialization
let isInitialized = false;

/**
 * Initialize documentation fetching and set up scheduled updates
 */
exports.initializeDocumentation = async () => {
  if (isInitialized) {
    return;
  }
  
  try {
    // Create data directories if they don't exist
    const dataDir = path.join(__dirname, '../../data');
    const librariesDir = path.join(dataDir, 'libraries');
    
    await createDirectoryIfNotExists(dataDir);
    await createDirectoryIfNotExists(librariesDir);
    
    // Fetch initial documentation
    await exports.refreshAllDocumentation();
    
    // Schedule regular updates (every day at midnight by default)
    const cronSchedule = process.env.DOCUMENTATION_UPDATE_SCHEDULE || '0 0 * * *';
    cron.schedule(cronSchedule, async () => {
      logger.info('Running scheduled documentation update');
      try {
        await exports.refreshAllDocumentation();
        logger.info('Scheduled documentation update completed');
      } catch (error) {
        logger.error('Error during scheduled documentation update:', error);
      }
    });
    
    isInitialized = true;
    logger.info('Documentation service initialized');
  } catch (error) {
    logger.error('Error initializing documentation service:', error);
    throw error;
  }
};

/**
 * Refresh documentation for all libraries or specific libraries
 * @param {Array} [libraries] - Array of library names to refresh (optional)
 */
exports.refreshAllDocumentation = async (libraries) => {
  try {
    const allLibraries = await getLibraries();
    const librariesToRefresh = libraries 
      ? allLibraries.filter(lib => libraries.includes(lib.name))
      : allLibraries;
    
    if (librariesToRefresh.length === 0) {
      logger.warn('No libraries found to refresh');
      return;
    }
    
    for (const library of librariesToRefresh) {
      await exports.refreshLibraryDocumentation(library.name);
    }
    
    if (!libraries) {
      // Full refresh, reset all search indexes
      resetAllSearchIndexes();
    } else {
      // Partial refresh, reset only specific library indexes
      libraries.forEach(lib => resetSearchIndex(lib));
    }
    
    logger.info(`Documentation refreshed for ${librariesToRefresh.map(l => l.name).join(', ')}`);
  } catch (error) {
    logger.error('Error refreshing all documentation:', error);
    throw error;
  }
};

/**
 * Refresh documentation for a specific library
 * @param {string} libraryName - Library name
 */
exports.refreshLibraryDocumentation = async (libraryName) => {
  try {
    const library = (await getLibraries()).find(lib => lib.name === libraryName);
    
    if (!library) {
      logger.warn(`Library ${libraryName} not found`);
      return;
    }
    
    logger.info(`Refreshing documentation for ${libraryName}`);
    
    // Create library directory
    const libraryDir = path.join(__dirname, '../../data/libraries', libraryName);
    await createDirectoryIfNotExists(libraryDir);
    
    // Save library metadata
    await fs.writeFile(
      path.join(__dirname, '../../data/libraries', `${libraryName}.json`),
      JSON.stringify(library, null, 2),
      'utf8'
    );
    
    // For each version, fetch documentation
    for (const version of library.versions) {
      await exports.fetchLibraryVersionDocumentation(libraryName, version);
    }
    
    logger.info(`Documentation refresh completed for ${libraryName}`);
  } catch (error) {
    logger.error(`Error refreshing documentation for ${libraryName}:`, error);
    throw error;
  }
};

/**
 * Fetch documentation for a specific library version
 * @param {string} libraryName - Library name
 * @param {string} version - Library version
 */
exports.fetchLibraryVersionDocumentation = async (libraryName, version) => {
  try {
    logger.info(`Fetching documentation for ${libraryName} version ${version}`);
    
    // Create version directory
    const versionDir = path.join(__dirname, '../../data/libraries', libraryName, version);
    const componentsDir = path.join(versionDir, 'components');
    
    await createDirectoryIfNotExists(versionDir);
    await createDirectoryIfNotExists(componentsDir);
    
    // In a real implementation, this would fetch documentation from various sources
    // For example, from GitHub repositories, documentation websites, or npm packages
    // For demonstration, we'll create mock data
    
    // Here we would call different fetchers based on the library
    let components = [];
    
    if (libraryName === 'react') {
      components = await fetchReactDocumentation(version);
    } else if (libraryName === 'vue') {
      components = await fetchVueDocumentation(version);
    } else if (libraryName === 'angular') {
      components = await fetchAngularDocumentation(version);
    }
    
    // Save components
    for (const component of components) {
      const componentPath = path.join(componentsDir, `${component.path}.json`);
      
      // Create parent directories if needed
      const componentDir = path.dirname(componentPath);
      await createDirectoryIfNotExists(componentDir);
      
      await fs.writeFile(
        componentPath,
        JSON.stringify(component, null, 2),
        'utf8'
      );
    }
    
    logger.info(`Fetched ${components.length} components for ${libraryName} version ${version}`);
  } catch (error) {
    logger.error(`Error fetching documentation for ${libraryName} version ${version}:`, error);
    throw error;
  }
};

/**
 * Create directory if it doesn't exist
 * @param {string} dir - Directory path
 */
async function createDirectoryIfNotExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Mock function to fetch React documentation
 * @param {string} version - React version
 * @returns {Promise<Array>} React components
 */
async function fetchReactDocumentation(version) {
  // In a real implementation, this would fetch documentation from React's website or GitHub
  // For demonstration, we'll return mock data
  
  return [
    {
      name: 'useState',
      path: 'hooks/useState',
      type: 'hook',
      description: 'Returns a stateful value, and a function to update it.',
      example: `
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
      `,
      parameters: [
        {
          name: 'initialState',
          description: 'The initial state value',
          type: 'any'
        }
      ],
      returns: {
        type: 'array',
        description: 'An array with two items: the current state and a function to update it'
      },
      related: ['useReducer', 'useContext']
    },
    {
      name: 'useEffect',
      path: 'hooks/useEffect',
      type: 'hook',
      description: 'Accepts a function that contains imperative, possibly effectful code.',
      example: `
import React, { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = \`You clicked \${count} times\`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
      `,
      parameters: [
        {
          name: 'effect',
          description: 'The effect function',
          type: 'function'
        },
        {
          name: 'deps',
          description: 'Dependencies array',
          type: 'array',
          optional: true
        }
      ],
      returns: {
        type: 'undefined',
        description: 'None'
      },
      related: ['useLayoutEffect', 'useCallback']
    }
  ];
}

/**
 * Mock function to fetch Vue documentation
 * @param {string} version - Vue version
 * @returns {Promise<Array>} Vue components
 */
async function fetchVueDocumentation(version) {
  // In a real implementation, this would fetch documentation from Vue's website or GitHub
  return [
    {
      name: 'ref',
      path: 'reactivity/ref',
      type: 'reactivity',
      description: 'Takes an inner value and returns a reactive and mutable ref object.',
      example: `
import { ref } from 'vue';

const count = ref(0);
console.log(count.value); // 0

count.value++;
console.log(count.value); // 1
      `,
      parameters: [
        {
          name: 'value',
          description: 'The initial value',
          type: 'any'
        }
      ],
      returns: {
        type: 'object',
        description: 'A reactive ref object with a single property .value'
      },
      related: ['reactive', 'computed']
    }
  ];
}

/**
 * Mock function to fetch Angular documentation
 * @param {string} version - Angular version
 * @returns {Promise<Array>} Angular components
 */
async function fetchAngularDocumentation(version) {
  // In a real implementation, this would fetch documentation from Angular's website or GitHub
  return [
    {
      name: 'Component',
      path: 'decorator/Component',
      type: 'decorator',
      description: 'Decorator that marks a class as an Angular component and provides configuration metadata.',
      example: `
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  template: '<h1>Hello, World!</h1>',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  // Component logic
}
      `,
      parameters: [
        {
          name: 'metadata',
          description: 'Component configuration object',
          type: 'object'
        }
      ],
      returns: {
        type: 'ClassDecorator',
        description: 'Function that applies to the class'
      },
      related: ['NgModule', 'Injectable']
    }
  ];
}

// Export mock fetcher functions for testing
exports._fetchReactDocumentation = fetchReactDocumentation;
exports._fetchVueDocumentation = fetchVueDocumentation;
exports._fetchAngularDocumentation = fetchAngularDocumentation;
