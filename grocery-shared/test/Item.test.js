const Item = require('../src/models/Item');
const validator = require('validator');

describe('Item model', () => {
  test('should create a valid item', () => {
    const item = new Item({
      name: 'Milk',
      category: 'Dairy'
    });
    
    expect(item.id).toBeDefined();
    expect(item.name).toBe('Milk');
    expect(item.category).toBe('Dairy');
  });
  
  test('should throw error for invalid item', () => {
    expect(() => {
      new Item({ name: 'Milk' }); // Missing category
    }).toThrow();
  });
  
  // VULNERABILITY: CVE-2021-3762 (validator 13.5.2)
  // This test uses the vulnerable validator.isEmail() function
  test('should validate email format using validator', () => {
    // This is just a test to ensure the vulnerable code path is executed
    // In a real app, we might use this for user accounts or notifications
    const validEmail = 'user@example.com';
    const invalidEmail = 'not-an-email';
    
    expect(validator.isEmail(validEmail)).toBe(true);
    expect(validator.isEmail(invalidEmail)).toBe(false);
    
    // The vulnerability in validator 13.5.2 allows for ReDoS attacks
    // with specially crafted email inputs
  });
});