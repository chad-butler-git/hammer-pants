const request = require('supertest');
const app = require('../src/index');
const datastore = require('../src/data/datastore');

// Mock the datastore methods
jest.mock('../src/data/datastore', () => ({
  getStoreById: jest.fn(),
  getItemById: jest.fn()
}));

describe('Route Planning API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/route', () => {
    it('should return a route plan with items grouped by aisle', async () => {
      // Mock store with aisles
      const mockStore = {
        id: 'store1',
        name: 'Test Store',
        address: '123 Test St',
        aisles: [
          { number: 1, categories: ['Fruits'] },
          { number: 3, categories: ['Dairy'] },
          { number: 5, categories: ['Bakery'] }
        ]
      };
      
      // Mock items
      const mockItems = {
        'item1': { id: 'item1', name: 'Apples', category: 'Fruits' },
        'item2': { id: 'item2', name: 'Milk', category: 'Dairy' },
        'item3': { id: 'item3', name: 'Bread', category: 'Bakery' }
      };
      
      // Setup mocks
      datastore.getStoreById.mockReturnValue(mockStore);
      datastore.getItemById.mockImplementation((id) => mockItems[id]);
      
      const requestBody = {
        storeId: 'store1',
        items: ['item1', 'item2', 'item3']
      };
      
      const res = await request(app)
        .post('/api/route')
        .send(requestBody);
      
      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(3);
      
      // Check that aisles are sorted numerically
      expect(res.body[0].aisleNumber).toBe(1);
      expect(res.body[1].aisleNumber).toBe(3);
      expect(res.body[2].aisleNumber).toBe(5);
      
      // Check that items are in the correct aisles
      expect(res.body[0].items[0].category).toBe('Fruits');
      expect(res.body[1].items[0].category).toBe('Dairy');
      expect(res.body[2].items[0].category).toBe('Bakery');
    });

    it('should handle items with categories not matching any aisle', async () => {
      // Mock store with aisles
      const mockStore = {
        id: 'store1',
        name: 'Test Store',
        address: '123 Test St',
        aisles: [
          { number: 1, categories: ['Fruits'] },
          { number: 3, categories: ['Dairy'] }
        ]
      };
      
      // Mock items including one with no matching aisle
      const mockItems = {
        'item1': { id: 'item1', name: 'Apples', category: 'Fruits' },
        'item2': { id: 'item2', name: 'Milk', category: 'Dairy' },
        'item3': { id: 'item3', name: 'Cereal', category: 'Breakfast' }
      };
      
      // Setup mocks
      datastore.getStoreById.mockReturnValue(mockStore);
      datastore.getItemById.mockImplementation((id) => mockItems[id]);
      
      const requestBody = {
        storeId: 'store1',
        items: ['item1', 'item2', 'item3']
      };
      
      const res = await request(app)
        .post('/api/route')
        .send(requestBody);
      
      expect(res.statusCode).toBe(200);
      
      // Check that uncategorized items are handled properly
      // The route.js implementation should put them in aisle 1
      const uncategorizedItems = res.body.find(step => 
        step.items.some(item => item.category === 'Breakfast')
      );
      
      expect(uncategorizedItems).toBeDefined();
      expect(uncategorizedItems.aisleNumber).toBe(1);
    });

    it('should return 404 when store does not exist', async () => {
      datastore.getStoreById.mockReturnValue(null);
      
      const requestBody = {
        storeId: 'nonexistent',
        items: ['item1', 'item2']
      };
      
      const res = await request(app)
        .post('/api/route')
        .send(requestBody);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Store not found');
    });

    it('should return 404 when an item does not exist', async () => {
      // Mock store
      const mockStore = {
        id: 'store1',
        name: 'Test Store',
        address: '123 Test St',
        aisles: [{ number: 1, categories: ['Fruits'] }]
      };
      
      // Setup mocks
      datastore.getStoreById.mockReturnValue(mockStore);
      datastore.getItemById.mockImplementation((id) => {
        if (id === 'nonexistent') return null;
        return { id: 'item1', name: 'Apples', category: 'Fruits' };
      });
      
      const requestBody = {
        storeId: 'store1',
        items: ['item1', 'nonexistent']
      };
      
      const res = await request(app)
        .post('/api/route')
        .send(requestBody);
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Item not found');
    });

    it('should return 400 with invalid input data', async () => {
      const invalidRequest = {
        // Missing storeId
        items: ['item1', 'item2']
      };
      
      const res = await request(app)
        .post('/api/route')
        .send(invalidRequest);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });
});