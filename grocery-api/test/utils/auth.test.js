const auth = require('../../src/utils/auth');

describe('Auth utilities', () => {
  test('should generate a valid JWT token', () => {
    const user = {
      id: '123',
      name: 'Test User',
      role: 'customer'
    };
    
    const token = auth.generateToken(user);
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });
  
  test('should verify a valid token', () => {
    const user = {
      id: '123',
      name: 'Test User',
      role: 'customer'
    };
    
    const token = auth.generateToken(user);
    const decoded = auth.verifyToken(token);
    
    expect(decoded).toBeDefined();
    expect(decoded.id).toBe(user.id);
    expect(decoded.name).toBe(user.name);
    expect(decoded.role).toBe(user.role);
  });
  
  test('should throw error for invalid token', () => {
    expect(() => {
      auth.verifyToken('invalid-token');
    }).toThrow();
  });
});