const request = require('supertest');
const app = require('../src/index');
const datastore = require('../src/data/datastore');

// Mock the datastore methods
jest.mock('../src/data/datastore', () => ({
  getStores: jest.fn(),
  getStoreById: jest.fn(),
  addStore: jest.fn(),
  updateStore: jest.fn(),
  deleteStore: jest.fn()
}));

describe('Stores API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/stores', () => {
    it('should return all stores', async () => {
      const mockStores = [
        { 
          id: '1', 
          name: 'Grocery Store 1', 
          address: '123 Main St',
          aisles: [{ number: 1, categories: ['Fruits'] }]
        },
        { 
          id: '2', 
          name: 'Grocery Store 2', 
          address: '456 Oak Ave',
          aisles: [{ number: 1, categories: ['Dairy'] }]
        }
      ];
      
      datastore.getStores.mockReturnValue(mockStores);
      
      const res = await request(app).get('/api/stores');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockStores);
      expect(datastore.getStores).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/stores/:id', () => {
    it('should return a single store when it exists', async () => {
      const mockStore = { 
        id: '1', 
        name: 'Grocery Store 1', 
        address: '123 Main St',
        aisles: [{ number: 1, categories: ['Fruits'] }]
      };
      
      datastore.getStoreById.mockReturnValue(mockStore);
      
      const res = await request(app).get('/api/stores/1');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockStore);
      expect(datastore.getStoreById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when store does not exist', async () => {
      datastore.getStoreById.mockReturnValue(null);
      
      const res = await request(app).get('/api/stores/999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(datastore.getStoreById).toHaveBeenCalledWith('999');
    });
  });

  describe('POST /api/stores', () => {
    it('should create a new store with valid data', async () => {
      const newStore = { 
        name: 'New Grocery Store', 
        address: '789 Pine Rd',
        aisles: [{ number: 1, categories: ['Produce'] }]
      };
      
      const createdStore = { id: '3', ...newStore };
      
      datastore.addStore.mockReturnValue(createdStore);
      
      const res = await request(app)
        .post('/api/stores')
        .send(newStore);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdStore);
      expect(datastore.addStore).toHaveBeenCalledWith(newStore);
    });

    it('should return 400 with invalid data', async () => {
      const invalidStore = { name: 'Invalid Store' }; // Missing address
      
      datastore.addStore.mockImplementation(() => {
        throw new Error('Invalid Store');
      });
      
      const res = await request(app)
        .post('/api/stores')
        .send(invalidStore);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/stores/:id', () => {
    it('should update a store with valid data', async () => {
      const updatedStore = { 
        id: '1', 
        name: 'Updated Store', 
        address: '123 Main St',
        aisles: [{ number: 1, categories: ['Fruits', 'Vegetables'] }]
      };
      
      datastore.updateStore.mockReturnValue(updatedStore);
      
      const res = await request(app)
        .put('/api/stores/1')
        .send({ 
          name: 'Updated Store', 
          address: '123 Main St',
          aisles: [{ number: 1, categories: ['Fruits', 'Vegetables'] }]
        });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedStore);
      expect(datastore.updateStore).toHaveBeenCalledWith('1', { 
        name: 'Updated Store', 
        address: '123 Main St',
        aisles: [{ number: 1, categories: ['Fruits', 'Vegetables'] }]
      });
    });

    it('should return 404 when store does not exist', async () => {
      datastore.updateStore.mockImplementation(() => {
        throw new Error('Store not found with ID: 999');
      });
      
      const res = await request(app)
        .put('/api/stores/999')
        .send({ 
          name: 'Updated Store', 
          address: '123 Main St',
          aisles: [{ number: 1, categories: ['Fruits'] }]
        });
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/stores/:id', () => {
    it('should delete a store when it exists', async () => {
      datastore.deleteStore.mockReturnValue(true);
      
      const res = await request(app).delete('/api/stores/1');
      
      expect(res.statusCode).toBe(204);
      expect(datastore.deleteStore).toHaveBeenCalledWith('1');
    });

    it('should return 404 when store does not exist', async () => {
      datastore.deleteStore.mockReturnValue(false);
      
      const res = await request(app).delete('/api/stores/999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});