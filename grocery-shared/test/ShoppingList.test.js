const ShoppingList = require('../src/models/ShoppingList');
const Item = require('../src/models/Item');
const { v4: uuidv4 } = require('uuid');

describe('ShoppingList model', () => {
  test('should create a valid shopping list', () => {
    const storeId = uuidv4();
    const shoppingList = new ShoppingList({
      storeId,
      items: [
        { name: 'Milk', category: 'Dairy' },
        { name: 'Bread', category: 'Bakery' }
      ]
    });
    
    expect(shoppingList.id).toBeDefined();
    expect(shoppingList.storeId).toBe(storeId);
    expect(shoppingList.items.length).toBe(2);
    expect(shoppingList.items[0]).toBeInstanceOf(Item);
    expect(shoppingList.items[0].name).toBe('Milk');
  });
  
  test('should throw error for invalid shopping list', () => {
    expect(() => {
      new ShoppingList({}); // Missing storeId
    }).toThrow();
  });
});