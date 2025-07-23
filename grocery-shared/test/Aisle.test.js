const Aisle = require('../src/models/Aisle');

describe('Aisle model', () => {
  test('should create a valid aisle', () => {
    const aisle = new Aisle({
      number: 5,
      categories: ['Dairy', 'Cheese']
    });
    
    expect(aisle.number).toBe(5);
    expect(aisle.categories).toEqual(['Dairy', 'Cheese']);
  });
  
  test('should throw error for invalid aisle number', () => {
    expect(() => {
      new Aisle({ number: 0 }); // Number below minimum
    }).toThrow();
    
    expect(() => {
      new Aisle({ number: 21 }); // Number above maximum
    }).toThrow();
  });
});