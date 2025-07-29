/**
 * XML Store Layout Import Script
 * 
 * VULNERABILITY: CVE-2024-41818 (fast-xml-parser@3.x)
 * This script uses the vulnerable fast-xml-parser@3.21.1 package.
 * The vulnerability is a Regular Expression Denial of Service (ReDoS) issue.
 * 
 * When upgrading to fast-xml-parser@4.4.1+, the API changes significantly:
 * - Function-based API becomes class-based (XMLParser class)
 * - Option names change
 * - Parsing method signature changes
 * - Different handling of attributes and values
 */

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const parser = require('fast-xml-parser');
const { Store, Aisle } = require('grocery-shared');

// Parse command line arguments
const args = process.argv.slice(2);
let baseUrl = 'http://localhost:3000/api';
let xmlFilePath = path.join(__dirname, '..', 'sample-data', 'stores.xml');

// Check for --base-url argument
const baseUrlArgIndex = args.findIndex(arg => arg === '--base-url');
if (baseUrlArgIndex !== -1 && args.length > baseUrlArgIndex + 1) {
  baseUrl = args[baseUrlArgIndex + 1];
}

// Check for --file argument
const fileArgIndex = args.findIndex(arg => arg === '--file');
if (fileArgIndex !== -1 && args.length > fileArgIndex + 1) {
  xmlFilePath = args[fileArgIndex + 1];
}

/**
 * Parse XML file using fast-xml-parser@3.x
 * @param {string} filePath - Path to XML file
 * @returns {Object} Parsed XML data
 */
function parseXmlFile(filePath) {
  try {
    // Read XML file
    const xmlData = fs.readFileSync(filePath, 'utf8');
    
    // Configure parser options (using v3.x API)
    const options = {
      attributeNamePrefix: '',
      attrNodeName: 'attr',
      textNodeName: '#text',
      ignoreAttributes: false,
      parseAttributeValue: true,
      parseNodeValue: true,
      trimValues: true,
      parseTrueNumberOnly: false
    };
    
    // Parse XML (using v3.x function-based API)
    if (parser.validate(xmlData) === true) {
      const jsonObj = parser.parse(xmlData, options);
      return jsonObj;
    } else {
      throw new Error('Invalid XML file');
    }
  } catch (error) {
    console.error('Error parsing XML file:', error.message);
    throw error;
  }
}

/**
 * Convert XML store data to application store format
 * @param {Object} xmlStore - Store data from XML
 * @returns {Object} Store object in application format
 */
function convertXmlStoreToAppFormat(xmlStore) {
  try {
    // Extract store attributes
    const storeId = xmlStore.attr.id;
    const name = xmlStore.name;
    const address = xmlStore.address;
    
    // Extract and convert aisles
    const aisles = xmlStore.layout.aisles.aisle.map(xmlAisle => {
      // Extract aisle attributes
      const number = xmlAisle.attr.number;
      
      // Extract categories
      const categories = Array.isArray(xmlAisle.categories.category) 
        ? xmlAisle.categories.category 
        : [xmlAisle.categories.category];
      
      // Create Aisle object
      return new Aisle({
        number,
        categories
      });
    });
    
    // Create Store object
    return new Store({
      id: storeId,
      name,
      address,
      aisles
    });
  } catch (error) {
    console.error('Error converting XML store to app format:', error.message);
    throw error;
  }
}

/**
 * Import store from XML to API
 * @param {Object} store - Store object in application format
 * @returns {Promise<Object>} API response
 */
async function importStoreToApi(store) {
  try {
    const response = await axios.post(`${baseUrl}/stores`, store);
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 409) {
      console.warn(`Store ${store.id} already exists, skipping`);
      return { skipped: true, id: store.id };
    } else {
      console.error(`Error importing store ${store.id}:`, error.message);
      throw error;
    }
  }
}

/**
 * Import stores from XML file to API
 * @returns {Promise<Array>} Array of import results
 */
async function importXmlStores() {
  try {
    console.log(`Importing stores from XML file: ${xmlFilePath}`);
    
    // Parse XML file
    const xmlData = parseXmlFile(xmlFilePath);
    
    // Check if stores exist in XML
    if (!xmlData.stores || !xmlData.stores.store) {
      throw new Error('No stores found in XML file');
    }
    
    // Convert to array if only one store
    const xmlStores = Array.isArray(xmlData.stores.store) 
      ? xmlData.stores.store 
      : [xmlData.stores.store];
    
    console.log(`Found ${xmlStores.length} stores in XML file`);
    
    // Convert and import each store
    const results = [];
    for (const xmlStore of xmlStores) {
      try {
        // Convert XML store to app format
        const store = convertXmlStoreToAppFormat(xmlStore);
        
        // Import store to API
        console.log(`Importing store: ${store.name} (${store.id})`);
        const result = await importStoreToApi(store);
        
        results.push({
          id: store.id,
          name: store.name,
          success: true,
          skipped: result.skipped || false
        });
      } catch (error) {
        console.error(`Error processing store:`, error);
        results.push({
          id: xmlStore.attr ? xmlStore.attr.id : 'unknown',
          success: false,
          error: error.message
        });
      }
    }
    
    return results;
  } catch (error) {
    console.error('Error importing XML stores:', error);
    throw error;
  }
}

// If this script is run directly, import the stores
if (require.main === module) {
  importXmlStores()
    .then(results => {
      console.log('Import completed:');
      console.log(JSON.stringify(results, null, 2));
      process.exit(0);
    })
    .catch(error => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

module.exports = {
  parseXmlFile,
  convertXmlStoreToAppFormat,
  importStoreToApi,
  importXmlStores
};