/**
 * Sample data import script for grocery application
 * 
 * Reads JSON files from sample-data/ and imports them into a running grocery-api instance
 * Handles conflicts gracefully (409 responses)
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { importXmlStores } = require('./xmlImport');

// Parse command line arguments
const args = process.argv.slice(2);
let baseUrl = 'http://localhost:3000/api';
let useXml = false;

// Check for --base-url argument
const baseUrlArgIndex = args.findIndex(arg => arg === '--base-url');
if (baseUrlArgIndex !== -1 && args.length > baseUrlArgIndex + 1) {
  baseUrl = args[baseUrlArgIndex + 1];
}

// Sample data directory
const SAMPLE_DATA_DIR = path.join(__dirname, '..', 'sample-data');

/**
 * Read a JSON file from the sample-data directory
 * @param {string} filename - Name of the JSON file
 * @returns {Array|Object} Parsed JSON data
 */
function readJsonFile(filename) {
  const filePath = path.join(SAMPLE_DATA_DIR, filename);
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }
  
  // Check for --use-xml argument
  if (args.includes('--use-xml')) {
    useXml = true;
  }
  
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileContent);
}

/**
 * Import items to the API
 * @param {Array} items - Array of Item objects
 * @returns {Object} Result with success and error counts
 */
async function importItems(items) {
  const results = { success: 0, error: 0, conflict: 0 };
  
  for (const item of items) {
    try {
      await axios.post(`${baseUrl}/items`, item);
      results.success++;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Skip conflicts
        results.conflict++;
      } else {
        console.error(`Error importing item ${item.id}:`, error.message);
        results.error++;
      }
    }
  }
  
  return results;
}

/**
 * Import stores to the API
 * @param {Array} stores - Array of Store objects
 * @returns {Object} Result with success and error counts
 */
async function importStores(stores) {
  const results = { success: 0, error: 0, conflict: 0 };
  
  for (const store of stores) {
    try {
      await axios.post(`${baseUrl}/stores`, store);
      results.success++;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Skip conflicts
        results.conflict++;
      } else {
        console.error(`Error importing store ${store.id}:`, error.message);
        results.error++;
      }
    }
  }
  
  return results;
}

/**
 * Import shopping lists to the API
 * @param {Array} lists - Array of ShoppingList objects
 * @returns {Object} Result with success and error counts
 */
async function importShoppingLists(lists) {
  const results = { success: 0, error: 0, conflict: 0 };
  
  for (const list of lists) {
    try {
      await axios.post(`${baseUrl}/lists`, list);
      results.success++;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        // Skip conflicts
        results.conflict++;
      } else {
        console.error(`Error importing shopping list ${list.id}:`, error.message);
        results.error++;
      }
    }
  }
  
  return results;
}

/**
 * Import all sample data to the API
 */
async function importSampleData() {
  console.log(`Importing sample data to ${baseUrl}`);
  
  try {
    // Read sample data files
    const items = readJsonFile('items.json');
    const shoppingLists = readJsonFile('shoppingLists.json');
    
    // Import items
    console.log('Importing items...');
    const itemResults = await importItems(items);
    console.log(`Items: ${itemResults.success} imported, ${itemResults.conflict} skipped (already exist), ${itemResults.error} errors`);
    
    // Import stores - choose between JSON and XML
    let storeResults;
    if (useXml) {
      console.log('Importing stores from XML...');
      const xmlResults = await importXmlStores();
      
      // Convert XML results to match JSON results format
      storeResults = {
        success: xmlResults.filter(r => r.success && !r.skipped).length,
        conflict: xmlResults.filter(r => r.skipped).length,
        error: xmlResults.filter(r => !r.success).length
      };
    } else {
      console.log('Importing stores from JSON...');
      const stores = readJsonFile('stores.json');
      console.log(`Found ${stores.length} stores in JSON`);
      storeResults = await importStores(stores);
    }
    
    console.log(`Stores: ${storeResults.success} imported, ${storeResults.conflict} skipped (already exist), ${storeResults.error} errors`);
    
    // Import shopping lists
    console.log('Importing shopping lists...');
    const listResults = await importShoppingLists(shoppingLists);
    console.log(`Shopping lists: ${listResults.success} imported, ${listResults.conflict} skipped (already exist), ${listResults.error} errors`);
    
    console.log('Import completed');
    
    return {
      items: itemResults,
      stores: storeResults,
      lists: listResults
    };
  } catch (error) {
    console.error('Error importing sample data:', error.message);
    throw error;
  }
}

// If this script is run directly, import the data
if (require.main === module) {
  // Print usage information if --help is provided
  if (args.includes('--help')) {
    console.log('Usage: node importSampleData.js [options]');
    console.log('Options:');
    console.log('  --base-url <url>  API base URL (default: http://localhost:3000/api)');
    console.log('  --use-xml         Import stores from XML instead of JSON');
    console.log('  --help            Show this help message');
    process.exit(0);
  }

  importSampleData()
    .then(() => {
      process.exit(0);
    })
    .catch(err => {
      console.error('Import failed:', err);
      process.exit(1);
    });
}

module.exports = { importSampleData };