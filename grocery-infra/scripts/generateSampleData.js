/**
 * Sample data generator for grocery application
 * 
 * Generates deterministic sample data and saves it to JSON files
 * Uses a fixed seed (1337) for reproducible results
 */
const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');
const { Item, Store, Aisle, ShoppingList } = require('grocery-shared');

// Set a fixed seed for deterministic data generation
faker.seed(1337);

// Output directory for sample data
const SAMPLE_DATA_DIR = path.join(__dirname, '..', 'sample-data');

// Category list
const CATEGORIES = [
  "Produce",
  "Dairy",
  "Meat",
  "Seafood",
  "Bakery",
  "Frozen",
  "Snacks",
  "Beverages",
  "Condiments",
  "Canned Goods",
  "Household",
  "Personal Care"
];

/**
 * Generate a random number of aisles (10-20) for a store
 * Each aisle has 3-6 random categories
 * @returns {Array} Array of Aisle objects
 */
function generateAisles() {
  const aisleCount = faker.number.int({ min: 10, max: 20 });
  const aisles = [];

  for (let i = 1; i <= aisleCount; i++) {
    // Get 3-6 random categories for this aisle
    const categoryCount = faker.number.int({ min: 3, max: 6 });
    const aisleCategories = [];
    
    // Ensure we don't add duplicate categories to an aisle
    while (aisleCategories.length < categoryCount && aisleCategories.length < CATEGORIES.length) {
      const category = faker.helpers.arrayElement(CATEGORIES);
      if (!aisleCategories.includes(category)) {
        aisleCategories.push(category);
      }
    }

    aisles.push(new Aisle({
      number: i,
      categories: aisleCategories
    }));
  }

  return aisles;
}

/**
 * Generate exactly 250 items across all categories
 * @returns {Array} Array of Item objects
 */
function generateItems() {
  const items = [];
  const itemCount = 250;

  for (let i = 0; i < itemCount; i++) {
    const category = faker.helpers.arrayElement(CATEGORIES);
    
    items.push(new Item({
      name: faker.commerce.productName(),
      category
    }));
  }

  return items;
}

/**
 * Generate 3 stores with random aisles
 * @returns {Array} Array of Store objects
 */
function generateStores() {
  const stores = [];
  const storeCount = 3;

  for (let i = 0; i < storeCount; i++) {
    stores.push(new Store({
      name: `${faker.location.city()} Grocery`,
      address: faker.location.streetAddress({ useFullAddress: true }),
      aisles: generateAisles()
    }));
  }

  return stores;
}

/**
 * Generate shopping lists for each store
 * @param {Array} items - Array of Item objects
 * @param {Array} stores - Array of Store objects
 * @returns {Array} Array of ShoppingList objects
 */
function generateShoppingLists(items, stores) {
  const lists = [];

  // Create one shopping list per store
  stores.forEach(store => {
    // Select 5-15 random items for this list
    const itemCount = faker.number.int({ min: 5, max: 15 });
    const listItems = [];
    
    for (let i = 0; i < itemCount; i++) {
      const randomItem = faker.helpers.arrayElement(items);
      // Only add if not already in the list
      if (!listItems.find(item => item.id === randomItem.id)) {
        listItems.push(randomItem);
      }
    }

    lists.push(new ShoppingList({
      storeId: store.id,
      items: listItems
    }));
  });

  return lists;
}

/**
 * Generate sample data and save to JSON files
 * @returns {Object} Object containing counts of generated data
 */
function generateSampleData() {
  // Generate data
  const items = generateItems();
  const stores = generateStores();
  const shoppingLists = generateShoppingLists(items, stores);

  // Ensure the sample-data directory exists
  if (!fs.existsSync(SAMPLE_DATA_DIR)) {
    fs.mkdirSync(SAMPLE_DATA_DIR, { recursive: true });
  }

  // Write items to JSON file
  fs.writeFileSync(
    path.join(SAMPLE_DATA_DIR, 'items.json'),
    JSON.stringify(items, null, 2)
  );

  // Write stores to JSON file
  fs.writeFileSync(
    path.join(SAMPLE_DATA_DIR, 'stores.json'),
    JSON.stringify(stores, null, 2)
  );

  // Write shopping lists to JSON file
  fs.writeFileSync(
    path.join(SAMPLE_DATA_DIR, 'shoppingLists.json'),
    JSON.stringify(shoppingLists, null, 2)
  );

  // Calculate total aisles across all stores
  const totalAisles = stores.reduce((sum, store) => sum + store.aisles.length, 0);

  // Return counts for logging
  return {
    itemCount: items.length,
    storeCount: stores.length,
    totalAisles,
    shoppingListCount: shoppingLists.length
  };
}

// If this script is run directly, generate the data and log results
if (require.main === module) {
  try {
    const { itemCount, storeCount, totalAisles, shoppingListCount } = generateSampleData();
    console.log(`Generated ${itemCount} items across ${storeCount} stores with ${totalAisles} total aisles`);
    console.log(`Created ${shoppingListCount} shopping lists`);
    console.log(`Sample data saved to ${SAMPLE_DATA_DIR}`);
  } catch (err) {
    console.error('Error generating sample data:', err);
    process.exit(1);
  }
}

module.exports = { generateSampleData };