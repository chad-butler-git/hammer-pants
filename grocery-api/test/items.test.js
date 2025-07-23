const request = require('supertest');
const app = require('../src/index');
const datastore = require('../src/data/datastore');

// Mock the datastore methods
jest.mock('../src/data/datastore', () => ({
  getItems: jest.fn(),
  getItemById: jest.fn(),
  addItem: jest.fn(),
  updateItem: jest.fn(),
  deleteItem: jest.fn()
}));

describe('Items API Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/items', () => {
    it('should return all items', async () => {
      const mockItems = [
        { id: '1', name: 'Apples', category: 'Fruits' },
        { id: '2', name: 'Milk', category: 'Dairy' }
      ];
      
      datastore.getItems.mockReturnValue(mockItems);
      
      const res = await request(app).get('/api/items');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockItems);
      expect(datastore.getItems).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /api/items/:id', () => {
    it('should return a single item when it exists', async () => {
      const mockItem = { id: '1', name: 'Apples', category: 'Fruits' };
      
      datastore.getItemById.mockReturnValue(mockItem);
      
      const res = await request(app).get('/api/items/1');
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(mockItem);
      expect(datastore.getItemById).toHaveBeenCalledWith('1');
    });

    it('should return 404 when item does not exist', async () => {
      datastore.getItemById.mockReturnValue(null);
      
      const res = await request(app).get('/api/items/999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
      expect(datastore.getItemById).toHaveBeenCalledWith('999');
    });
  });

  describe('POST /api/items', () => {
    it('should create a new item with valid data', async () => {
      const newItem = { name: 'Bananas', category: 'Fruits' };
      const createdItem = { id: '3', ...newItem };
      
      datastore.addItem.mockReturnValue(createdItem);
      
      const res = await request(app)
        .post('/api/items')
        .send(newItem);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdItem);
      expect(datastore.addItem).toHaveBeenCalledWith(newItem);
    });

    it('should process template with user input (vulnerable to CVE-2021-23337)', async () => {
      const newItem = {
        name: '${constructor.constructor("return process.env")()} Apples',
        category: 'Fruits'
      };
      const createdItem = { id: '4', ...newItem };
      
      datastore.addItem.mockReturnValue(createdItem);
      
      const res = await request(app)
        .post('/api/items')
        .send(newItem);
      
      expect(res.statusCode).toBe(201);
      expect(res.body).toEqual(createdItem);
    });

    it('should return 400 with invalid data', async () => {
      const invalidItem = { name: 'Bananas' }; // Missing category
      
      datastore.addItem.mockImplementation(() => {
        throw new Error('Invalid Item');
      });
      
      const res = await request(app)
        .post('/api/items')
        .send(invalidItem);
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /api/items/:id', () => {
    it('should update an item with valid data', async () => {
      const updatedItem = { id: '1', name: 'Green Apples', category: 'Fruits' };
      
      datastore.updateItem.mockReturnValue(updatedItem);
      
      const res = await request(app)
        .put('/api/items/1')
        .send({ name: 'Green Apples', category: 'Fruits' });
      
      expect(res.statusCode).toBe(200);
      expect(res.body).toEqual(updatedItem);
      expect(datastore.updateItem).toHaveBeenCalledWith('1', { name: 'Green Apples', category: 'Fruits' });
    });

    it('should return 404 when item does not exist', async () => {
      datastore.updateItem.mockImplementation(() => {
        throw new Error('Item not found with ID: 999');
      });
      
      const res = await request(app)
        .put('/api/items/999')
        .send({ name: 'Green Apples', category: 'Fruits' });
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('DELETE /api/items/:id', () => {
    it('should delete an item when it exists', async () => {
      datastore.deleteItem.mockReturnValue(true);
      
      const res = await request(app).delete('/api/items/1');
      
      expect(res.statusCode).toBe(204);
      expect(datastore.deleteItem).toHaveBeenCalledWith('1');
    });

    it('should return 404 when item does not exist', async () => {
      datastore.deleteItem.mockReturnValue(false);
      
      const res = await request(app).delete('/api/items/999');
      
      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty('error');
    });
  });
});