/**
 * Tests for the importSampleData script
 */
const fs = require('fs');
const path = require('path');
const nock = require('nock');
const { importSampleData } = require('../scripts/importSampleData');

// Sample data directory
const SAMPLE_DATA_DIR = path.join(__dirname, '..', 'sample-data');

// Mock data
const mockItems = [
  { id: '1', name: 'Item 1', category: 'Category 1' },
  { id: '2', name: 'Item 2', category: 'Category 2' }
];

const mockStores = [
  {
    id: '1',
    name: 'Store 1',
    address: '123 Main St',
    aisles: [
      { number: 1, categories: ['Category 1'] },
      { number: 2, categories: ['Category 2'] }
    ]
  }
];

const mockLists = [
  {
    id: '1',
    storeId: '1',
    items: [
      { id: '1', name: 'Item 1', category: 'Category 1' }
    ]
  }
];

describe('importSampleData', () => {
  // Mock the file system
  beforeEach(() => {
    // Create the sample-data directory if it doesn't exist
    if (!fs.existsSync(SAMPLE_DATA_DIR)) {
      fs.mkdirSync(SAMPLE_DATA_DIR, { recursive: true });
    }
    
    // Write mock data to files
    fs.writeFileSync(
      path.join(SAMPLE_DATA_DIR, 'items.json'),
      JSON.stringify(mockItems)
    );
    
    fs.writeFileSync(
      path.join(SAMPLE_DATA_DIR, 'stores.json'),
      JSON.stringify(mockStores)
    );
    
    fs.writeFileSync(
      path.join(SAMPLE_DATA_DIR, 'shoppingLists.json'),
      JSON.stringify(mockLists)
    );
    
    // Enable nock
    nock.disableNetConnect();
  });
  
  // Clean up after tests
  afterEach(() => {
    // Clean up nock
    nock.cleanAll();
    nock.enableNetConnect();
  });
  
  test('imports items, stores, and shopping lists successfully', async () => {
    // Mock API responses
    const api = nock('http://localhost:3000')
      // Items
      .post('/api/items', mockItems[0])
      .reply(201, mockItems[0])
      .post('/api/items', mockItems[1])
      .reply(201, mockItems[1])
      
      // Stores
      .post('/api/stores', mockStores[0])
      .reply(201, mockStores[0])
      
      // Shopping Lists
      .post('/api/lists', mockLists[0])
      .reply(201, mockLists[0]);
    
    // Import the data
    const result = await importSampleData();
    
    // Check that all requests were made
    expect(api.isDone()).toBe(true);
    
    // Check the results
    expect(result.items.success).toBe(2);
    expect(result.items.error).toBe(0);
    expect(result.items.conflict).toBe(0);
    
    expect(result.stores.success).toBe(1);
    expect(result.stores.error).toBe(0);
    expect(result.stores.conflict).toBe(0);
    
    expect(result.lists.success).toBe(1);
    expect(result.lists.error).toBe(0);
    expect(result.lists.conflict).toBe(0);
  });
  
  test('handles conflicts gracefully', async () => {
    // Mock API responses with conflicts
    const api = nock('http://localhost:3000')
      // Items - one success, one conflict
      .post('/api/items', mockItems[0])
      .reply(201, mockItems[0])
      .post('/api/items', mockItems[1])
      .reply(409, { error: 'Item already exists' })
      
      // Stores - conflict
      .post('/api/stores', mockStores[0])
      .reply(409, { error: 'Store already exists' })
      
      // Shopping Lists - conflict
      .post('/api/lists', mockLists[0])
      .reply(409, { error: 'Shopping list already exists' });
    
    // Import the data
    const result = await importSampleData();
    
    // Check that all requests were made
    expect(api.isDone()).toBe(true);
    
    // Check the results
    expect(result.items.success).toBe(1);
    expect(result.items.error).toBe(0);
    expect(result.items.conflict).toBe(1);
    
    expect(result.stores.success).toBe(0);
    expect(result.stores.error).toBe(0);
    expect(result.stores.conflict).toBe(1);
    
    expect(result.lists.success).toBe(0);
    expect(result.lists.error).toBe(0);
    expect(result.lists.conflict).toBe(1);
  });
  
  test('handles API errors gracefully', async () => {
    // Mock API responses with errors
    const api = nock('http://localhost:3000')
      // Items - one success, one error
      .post('/api/items', mockItems[0])
      .reply(201, mockItems[0])
      .post('/api/items', mockItems[1])
      .reply(500, { error: 'Internal server error' })
      
      // Stores - error
      .post('/api/stores', mockStores[0])
      .reply(400, { error: 'Bad request' })
      
      // Shopping Lists - error
      .post('/api/lists', mockLists[0])
      .reply(500, { error: 'Internal server error' });
    
    // Import the data
    const result = await importSampleData();
    
    // Check that all requests were made
    expect(api.isDone()).toBe(true);
    
    // Check the results
    expect(result.items.success).toBe(1);
    expect(result.items.error).toBe(1);
    expect(result.items.conflict).toBe(0);
    
    expect(result.stores.success).toBe(0);
    expect(result.stores.error).toBe(1);
    expect(result.stores.conflict).toBe(0);
    
    expect(result.lists.success).toBe(0);
    expect(result.lists.error).toBe(1);
    expect(result.lists.conflict).toBe(0);
  });
  
  test('uses custom base URL when provided', async () => {
    // Save the original argv
    const originalArgv = process.argv;
    
    // Mock argv with custom base URL
    process.argv = ['node', 'importSampleData.js', '--base-url', 'http://custom-api:4000/api'];
    
    // Mock API responses with custom base URL
    const api = nock('http://custom-api:4000')
      // Items
      .post('/api/items', mockItems[0])
      .reply(201, mockItems[0])
      .post('/api/items', mockItems[1])
      .reply(201, mockItems[1])
      
      // Stores
      .post('/api/stores', mockStores[0])
      .reply(201, mockStores[0])
      
      // Shopping Lists
      .post('/api/lists', mockLists[0])
      .reply(201, mockLists[0]);
    
    // Re-require the module to pick up the new argv
    jest.resetModules();
    const { importSampleData: importWithCustomUrl } = require('../scripts/importSampleData');
    
    // Import the data
    const result = await importWithCustomUrl();
    
    // Check that all requests were made
    expect(api.isDone()).toBe(true);
    
    // Restore the original argv
    process.argv = originalArgv;
  });
});