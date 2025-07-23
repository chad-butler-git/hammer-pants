/**
 * Seed data generator for grocery application
 * 
 * Generates representative sample data and persists it to the datastore
 */
const { faker } = require('@faker-js/faker');
const datastore = require('../data/datastore');
const { Item, Store, Aisle } = require('grocery-shared');

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
 * Generate approximately 250 items across all categories
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
 * Seed the datastore with generated data
 * @returns {Object} Object containing counts of seeded data
 */
async function seedData() {
  // Generate data
  const items = generateItems();
  const stores = generateStores();

  // Clear existing data (if any)
  datastore.items = [];
  datastore.stores = [];
  datastore.shoppingLists = [];

  // Add items to datastore
  items.forEach(item => {
    datastore.items.push(item);
  });

  // Add stores to datastore
  stores.forEach(store => {
    datastore.stores.push(store);
  });

  // Calculate total aisles across all stores
  const totalAisles = stores.reduce((sum, store) => sum + store.aisles.length, 0);

  // Return counts for logging
  return {
    itemCount: items.length,
    storeCount: stores.length,
    totalAisles
  };
}

// If this script is run directly, seed the data and log results
if (require.main === module) {
  seedData()
    .then(({ itemCount, storeCount, totalAisles }) => {
      console.log(`Seeded ${itemCount} items across ${storeCount} stores with ${totalAisles} total aisles`);
      process.exit(0);
    })
    .catch(err => {
      console.error('Error seeding data:', err);
      process.exit(1);
    });
}

module.exports = { seedData };