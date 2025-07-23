const Store = require('../src/models/Store');
const Aisle = require('../src/models/Aisle');

describe('Store model', () => {
  test('should create a valid store', () => {
    const store = new Store({
      name: 'Grocery Store',
      address: '123 Main St',
      aisles: [
        { number: 1, categories: ['Produce'] },
        { number: 2, categories: ['Bakery'] }
      ]
    });
    
    expect(store.id).toBeDefined();
    expect(store.name).toBe('Grocery Store');
    expect(store.address).toBe('123 Main St');
    expect(store.aisles.length).toBe(2);
    expect(store.aisles[0]).toBeInstanceOf(Aisle);
    expect(store.aisles[0].number).toBe(1);
  });
  
  test('should throw error for invalid store', () => {
    expect(() => {
      new Store({ address: '123 Main St' }); // Missing name
    }).toThrow();
  });
});