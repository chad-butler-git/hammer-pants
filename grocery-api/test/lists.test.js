const request = require('supertest');
const app = require('../src/index');
const datastore = require('../src/data/datastore');

// Mock the datastore methods
jest.mock('../src/data/datastore', () => ({
  getShoppingLists: jest.fn(),
  getShoppingListById: jest.fn(),
  addShoppingList: jest.fn(),
  updateShoppingList: jest.fn(),
  deleteShoppingList: jest.fn(),
  getStoreById: jest.fn()
}));

describe('Shopping Lists API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/lists', () => {
    it('should return all shopping lists', async () => {
      const mockLists = [
        { 
          id: '1', 
          storeId: 'store1',
          items: [
            { id: 'item1', name: 'Apples', category: 'Fruits' }
          ]
        },
        { 
          id: '2', 
          storeId: 'store2',
          items: [
            { id: 'item2', name: 'Milk', category: 'Dairy' }
          ]
        }
      ];
      
      datastore.getShoppingLists.mockReturnValue(mockLists);
      
      const res = await request(app).get('/api/lists');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockLists);
      expect(datastore.getShoppingLists).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/lists/:id', () => {
    it('should return a single shopping list when it exists', async () => {
      const mockList = { 
        id: '1', 
        storeId: 'store1',
        items: [
          { id: 'item1', name: 'Apples', category: 'Fruits' }
        ]
      };
      
      datastore.getShoppingListById.mockReturnValue(mockList);
      
      const res = await request(app).get('/api/lists/1');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockList);
      expect(datastore.getShoppingListById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when shopping list does not exist', async () => {
      datastore.getShoppingListById.mockReturnValue(null);
      
      const res = await request(app).get('/api/lists/999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(datastore.getShoppingListById).toHaveBeenCalledWith('999');
    });
  });

  describe('POST /api/lists', () => {
    it('should create a new shopping list with valid data', async () => {
      const newList = { 
        storeId: 'store1',
        items: [
          { id: 'item1', name: 'Apples', category: 'Fruits' }
        ]
      };
      
      const createdList = { id: '3', ...newList };
      
      datastore.getStoreById.mockReturnValue({ id: 'store1' });
      datastore.addShoppingList.mockReturnValue(createdList);
      
      const res = await request(app)
        .post('/api/lists')
        .send(newList);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdList);
      expect(datastore.addShoppingList).toHaveBeenCalledWith(newList);
    });

    it('should return 400 when store does not exist', async () => {
      const newList = { 
        storeId: 'nonexistent',
        items: [
          { id: 'item1', name: 'Apples', category: 'Fruits' }
        ]
      };
      
      datastore.getStoreById.mockReturnValue(null);
      
      const res = await request(app)
        .post('/api/lists')
        .send(newList);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error).toContain('Store not found');
    });

    it('should return 400 with invalid data', async () => {
      const invalidList = { items: [] }; // Missing storeId
      
      datastore.addShoppingList.mockImplementation(() => {
        throw new Error('Invalid ShoppingList');
      });
      
      const res = await request(app)
        .post('/api/lists')
        .send(invalidList);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/lists/:id', () => {
    it('should update a shopping list with valid data', async () => {
      const updatedList = { 
        id: '1', 
        storeId: 'store1',
        items: [
          { id: 'item1', name: 'Apples', category: 'Fruits' },
          { id: 'item3', name: 'Bananas', category: 'Fruits' }
        ]
      };
      
      datastore.getStoreById.mockReturnValue({ id: 'store1' });
      datastore.updateShoppingList.mockReturnValue(updatedList);
      
      const res = await request(app)
        .put('/api/lists/1')
        .send({ 
          storeId: 'store1',
          items: [
            { id: 'item1', name: 'Apples', category: 'Fruits' },
            { id: 'item3', name: 'Bananas', category: 'Fruits' }
          ]
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedList);
      expect(datastore.updateShoppingList).toHaveBeenCalledWith('1', { 
        storeId: 'store1',
        items: [
          { id: 'item1', name: 'Apples', category: 'Fruits' },
          { id: 'item3', name: 'Bananas', category: 'Fruits' }
        ]
      });
    });

    it('should return 404 when shopping list does not exist', async () => {
      datastore.updateShoppingList.mockImplementation(() => {
        throw new Error('ShoppingList not found with ID: 999');
      });
      
      const res = await request(app)
        .put('/api/lists/999')
        .send({ 
          storeId: 'store1',
          items: [
            { id: 'item1', name: 'Apples', category: 'Fruits' }
          ]
        });
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/lists/:id', () => {
    it('should delete a shopping list when it exists', async () => {
      datastore.deleteShoppingList.mockReturnValue(true);
      
      const res = await request(app).delete('/api/lists/1');
      
      expect(res.statusCode).toBe(204);
      expect(datastore.deleteShoppingList).toHaveBeenCalledWith('1');
    });

    it('should return 404 when shopping list does not exist', async () => {
      datastore.deleteShoppingList.mockReturnValue(false);
      
      const res = await request(app).delete('/api/lists/999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});