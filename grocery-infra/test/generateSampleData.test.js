/**
 * Tests for the generateSampleData script
 */
const fs = require('fs');
const path = require('path');
const { generateSampleData } = require('../scripts/generateSampleData');

// Sample data directory
const SAMPLE_DATA_DIR = path.join(__dirname, '..', 'sample-data');

describe('generateSampleData', () => {
  // Clean up sample data files after tests
  afterAll(() => {
    // Only delete the files if they exist
    const filesToDelete = ['items.json', 'stores.json', 'shoppingLists.json'];
    filesToDelete.forEach(file => {
      const filePath = path.join(SAMPLE_DATA_DIR, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  });

  test('generates the correct number of items, stores, and shopping lists', () => {
    const result = generateSampleData();
    
    // Check the returned counts
    expect(result.itemCount).toBe(250);
    expect(result.storeCount).toBe(3);
    expect(result.shoppingListCount).toBe(3);
    expect(result.totalAisles).toBeGreaterThanOrEqual(30); // At least 10 aisles per store
    expect(result.totalAisles).toBeLessThanOrEqual(60); // At most 20 aisles per store
  });

  test('creates JSON files with the correct data', () => {
    // Generate the data
    generateSampleData();
    
    // Check that the files exist
    expect(fs.existsSync(path.join(SAMPLE_DATA_DIR, 'items.json'))).toBe(true);
    expect(fs.existsSync(path.join(SAMPLE_DATA_DIR, 'stores.json'))).toBe(true);
    expect(fs.existsSync(path.join(SAMPLE_DATA_DIR, 'shoppingLists.json'))).toBe(true);
    
    // Read and parse the files
    const items = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'items.json'), 'utf8'));
    const stores = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'stores.json'), 'utf8'));
    const shoppingLists = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'shoppingLists.json'), 'utf8'));
    
    // Check the counts
    expect(items.length).toBe(250);
    expect(stores.length).toBe(3);
    expect(shoppingLists.length).toBe(3);
    
    // Check that items have the required properties
    items.forEach(item => {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('name');
      expect(item).toHaveProperty('category');
      expect(typeof item.id).toBe('string');
      expect(typeof item.name).toBe('string');
      expect(typeof item.category).toBe('string');
    });
    
    // Check that stores have the required properties
    stores.forEach(store => {
      expect(store).toHaveProperty('id');
      expect(store).toHaveProperty('name');
      expect(store).toHaveProperty('address');
      expect(store).toHaveProperty('aisles');
      expect(Array.isArray(store.aisles)).toBe(true);
      expect(store.aisles.length).toBeGreaterThanOrEqual(10);
      expect(store.aisles.length).toBeLessThanOrEqual(20);
      
      // Check aisle properties
      store.aisles.forEach(aisle => {
        expect(aisle).toHaveProperty('number');
        expect(aisle).toHaveProperty('categories');
        expect(typeof aisle.number).toBe('number');
        expect(aisle.number).toBeGreaterThanOrEqual(1);
        expect(aisle.number).toBeLessThanOrEqual(20);
        expect(Array.isArray(aisle.categories)).toBe(true);
        expect(aisle.categories.length).toBeGreaterThanOrEqual(3);
        expect(aisle.categories.length).toBeLessThanOrEqual(6);
      });
    });
    
    // Check that shopping lists have the required properties
    shoppingLists.forEach(list => {
      expect(list).toHaveProperty('id');
      expect(list).toHaveProperty('storeId');
      expect(list).toHaveProperty('items');
      expect(typeof list.id).toBe('string');
      expect(typeof list.storeId).toBe('string');
      expect(Array.isArray(list.items)).toBe(true);
      
      // Verify that the storeId exists in the stores
      const storeExists = stores.some(store => store.id === list.storeId);
      expect(storeExists).toBe(true);
      
      // Check item properties
      list.items.forEach(item => {
        expect(item).toHaveProperty('id');
        expect(item).toHaveProperty('name');
        expect(item).toHaveProperty('category');
      });
    });
  });

  test('generates identical data on repeated runs', () => {
    // Generate data twice
    generateSampleData();
    
    // Save the first run data
    const firstRunItems = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'items.json'), 'utf8'));
    const firstRunStores = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'stores.json'), 'utf8'));
    const firstRunLists = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'shoppingLists.json'), 'utf8'));
    
    // Generate data again
    generateSampleData();
    
    // Read the second run data
    const secondRunItems = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'items.json'), 'utf8'));
    const secondRunStores = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'stores.json'), 'utf8'));
    const secondRunLists = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'shoppingLists.json'), 'utf8'));
    
    // Compare the data - should be identical
    expect(JSON.stringify(firstRunItems)).toBe(JSON.stringify(secondRunItems));
    expect(JSON.stringify(firstRunStores)).toBe(JSON.stringify(secondRunStores));
    expect(JSON.stringify(firstRunLists)).toBe(JSON.stringify(firstRunLists));
  });

  test('all items have unique IDs', () => {
    // Generate the data
    generateSampleData();
    
    // Read the items
    const items = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'items.json'), 'utf8'));
    
    // Extract all item IDs
    const itemIds = items.map(item => item.id);
    
    // Check for uniqueness by creating a Set and comparing sizes
    const uniqueIds = new Set(itemIds);
    expect(uniqueIds.size).toBe(items.length);
  });

  test('all aisle numbers are between 1 and 20', () => {
    // Generate the data
    generateSampleData();
    
    // Read the stores
    const stores = JSON.parse(fs.readFileSync(path.join(SAMPLE_DATA_DIR, 'stores.json'), 'utf8'));
    
    // Check all aisle numbers
    stores.forEach(store => {
      store.aisles.forEach(aisle => {
        expect(aisle.number).toBeGreaterThanOrEqual(1);
        expect(aisle.number).toBeLessThanOrEqual(20);
      });
    });
  });
});