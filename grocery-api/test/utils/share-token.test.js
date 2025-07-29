/**
 * Tests for JWT share token functionality
 * 
 * These tests verify the JWT sharing functionality works with jsonwebtoken@8.5.1
 * and will fail when upgrading to jsonwebtoken@9.0.0 without code changes.
 */

const jwt = require('jsonwebtoken');
const { generateShareToken, verifyShareToken } = require('../../src/utils/auth');

describe('Share Token Functionality', () => {
  const listId = '12345678-1234-1234-1234-123456789012';
  let shareToken;

  test('generateShareToken should create a valid JWT token', () => {
    // Generate a share token
    shareToken = generateShareToken(listId);
    
    // Token should be a string
    expect(typeof shareToken).toBe('string');
    
    // Token should be a valid JWT format (header.payload.signature)
    expect(shareToken.split('.')).toHaveLength(3);
  });

  test('verifyShareToken should verify and decode a valid token', () => {
    // Verify the token
    const decodedListId = verifyShareToken(shareToken);
    
    // Should return the original list ID
    expect(decodedListId).toBe(listId);
  });

  test('verifyShareToken should reject an invalid token', () => {
    // Create an invalid token
    const invalidToken = shareToken + 'invalid';
    
    // Should throw an error
    expect(() => {
      verifyShareToken(invalidToken);
    }).toThrow();
  });

  test('verifyShareToken should reject an expired token', () => {
    // Create a token that's already expired
    const expiredToken = jwt.sign(
      { 
        listId,
        purpose: 'share',
        exp: Math.floor(Date.now() / 1000) - 60 // Expired 1 minute ago
      },
      'grocery-app-secret-key'
    );
    
    // Should throw an error
    expect(() => {
      verifyShareToken(expiredToken);
    }).toThrow();
  });

  /**
   * This test will fail when upgrading to jsonwebtoken@9.0.0 without code changes
   * because v9.0.0 requires the algorithms option in verify()
   */
  test('BREAKING CHANGE: Token verification without algorithms option', () => {
    // Create a token with HS256 algorithm
    const token = jwt.sign(
      { listId, purpose: 'share' },
      'grocery-app-secret-key',
      { algorithm: 'HS256' }
    );
    
    // In v8.5.1, this works without specifying algorithms
    const decoded = jwt.verify(token, 'grocery-app-secret-key');
    expect(decoded.listId).toBe(listId);
    
    // In v9.0.0, this will fail without { algorithms: ['HS256'] }
    // The fix would be:
    // const decoded = jwt.verify(token, 'grocery-app-secret-key', { algorithms: ['HS256'] });
  });
});