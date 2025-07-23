/**
 * Tests for the datastore and seeding functionality
 */
const datastore = require('../src/data/datastore');
const { seedData } = require('../src/seed/seedData');

describe('DataStore', () => {
  // Test the datastore CRUD operations
  describe('CRUD Operations', () => {
    beforeEach(() => {
      // Clear the datastore before each test
      datastore.items = [];
      datastore.stores = [];
      datastore.shoppingLists = [];
    });

    describe('Item Operations', () => {
      test('should add and retrieve an item', () => {
        const item = datastore.addItem({
          name: 'Test Item',
          category: 'Test Category'
        });

        expect(item.id).toBeDefined();
        expect(item.name).toBe('Test Item');
        expect(item.category).toBe('Test Category');

        const retrievedItem = datastore.getItemById(item.id);
        expect(retrievedItem).toEqual(item);
      });

      test('should update an item', () => {
        const item = datastore.addItem({
          name: 'Test Item',
          category: 'Test Category'
        });

        const updatedItem = datastore.updateItem(item.id, {
          name: 'Updated Item',
          category: 'Updated Category'
        });

        expect(updatedItem.id).toBe(item.id);
        expect(updatedItem.name).toBe('Updated Item');
        expect(updatedItem.category).toBe('Updated Category');

        const retrievedItem = datastore.getItemById(item.id);
        expect(retrievedItem).toEqual(updatedItem);
      });

      test('should delete an item', () => {
        const item = datastore.addItem({
          name: 'Test Item',
          category: 'Test Category'
        });

        const result = datastore.deleteItem(item.id);
        expect(result).toBe(true);

        const retrievedItem = datastore.getItemById(item.id);
        expect(retrievedItem).toBeNull();
      });

      test('should throw on invalid item data', () => {
        expect(() => {
          datastore.addItem({
            // Missing required name
            category: 'Test Category'
          });
        }).toThrow();
      });
    });

    describe('Store Operations', () => {
      test('should add and retrieve a store', () => {
        const store = datastore.addStore({
          name: 'Test Store',
          address: 'Test Address',
          aisles: [{ number: 1, categories: ['Test Category'] }]
        });

        expect(store.id).toBeDefined();
        expect(store.name).toBe('Test Store');
        expect(store.address).toBe('Test Address');
        expect(store.aisles).toHaveLength(1);

        const retrievedStore = datastore.getStoreById(store.id);
        expect(retrievedStore).toEqual(store);
      });

      test('should throw on invalid aisle number', () => {
        expect(() => {
          datastore.addStore({
            name: 'Test Store',
            address: 'Test Address',
            aisles: [{ number: 25, categories: ['Test Category'] }] // Invalid aisle number (> 20)
          });
        }).toThrow();
      });
    });
  });

  // Test the seeding functionality
  describe('Seed Data', () => {
    beforeAll(async () => {
      // Seed the datastore before all tests
      await seedData();
    });

    test('should seed approximately 250 items', () => {
      const items = datastore.getItems();
      expect(items.length).toBeGreaterThanOrEqual(240);
      expect(items.length).toBeLessThanOrEqual(260);
    });

    test('should seed 3 stores', () => {
      const stores = datastore.getStores();
      expect(stores.length).toBe(3);
    });

    test('each store should have 10-20 aisles', () => {
      const stores = datastore.getStores();
      stores.forEach(store => {
        expect(store.aisles.length).toBeGreaterThanOrEqual(10);
        expect(store.aisles.length).toBeLessThanOrEqual(20);
      });
    });

    test('each aisle should have 3-6 categories', () => {
      const stores = datastore.getStores();
      stores.forEach(store => {
        store.aisles.forEach(aisle => {
          expect(aisle.categories.length).toBeGreaterThanOrEqual(3);
          expect(aisle.categories.length).toBeLessThanOrEqual(6);
        });
      });
    });

    test('all aisle numbers should be between 1 and 20', () => {
      const stores = datastore.getStores();
      stores.forEach(store => {
        store.aisles.forEach(aisle => {
          expect(aisle.number).toBeGreaterThanOrEqual(1);
          expect(aisle.number).toBeLessThanOrEqual(20);
        });
      });
    });

    test('all items should have valid categories', () => {
      const validCategories = [
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

      const items = datastore.getItems();
      items.forEach(item => {
        expect(validCategories).toContain(item.category);
      });
    });
  });
});