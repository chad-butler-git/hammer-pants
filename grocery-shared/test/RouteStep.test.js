const RouteStep = require('../src/models/RouteStep');
const Item = require('../src/models/Item');

describe('RouteStep model', () => {
  test('should create a valid route step', () => {
    const routeStep = new RouteStep({
      aisleNumber: 3,
      items: [
        { name: 'Milk', category: 'Dairy' },
        { name: 'Cheese', category: 'Dairy' }
      ]
    });
    
    expect(routeStep.aisleNumber).toBe(3);
    expect(routeStep.items.length).toBe(2);
    expect(routeStep.items[0]).toBeInstanceOf(Item);
    expect(routeStep.items[0].name).toBe('Milk');
  });
  
  test('should throw error for invalid aisle number', () => {
    expect(() => {
      new RouteStep({ aisleNumber: 0 }); // Number below minimum
    }).toThrow();
    
    expect(() => {
      new RouteStep({ aisleNumber: 21 }); // Number above maximum
    }).toThrow();
  });
});