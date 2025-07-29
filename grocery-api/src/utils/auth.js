/**
 * Authentication utilities
 * 
 * VULNERABILITY: CVE-2022-23529 (jsonwebtoken 8.5.1)
 * This file includes the vulnerable jsonwebtoken package but is not actively used
 * in the application, allowing the app to run normally while still being detected
 * by vulnerability scanners.
 */
const jwt = require('jsonwebtoken');

// This is a placeholder secret key - in a real app, this would be in environment variables
const secretKey = 'grocery-app-secret-key';

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
  // Create a token with user information
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role
    },
    secretKey,
    { expiresIn: '24h' }
  );
  
  return token;
}

/**
 * Generate a short-lived JWT token for sharing a shopping list
 * @param {string} listId - Shopping list ID
 * @returns {string} JWT token
 */
function generateShareToken(listId) {
  // Create a token with list ID and minimal permissions
  const token = jwt.sign(
    {
      listId,
      purpose: 'share',
      // No user information included for shared links
    },
    secretKey,
    {
      expiresIn: '15m', // Short-lived token (15 minutes)
      algorithm: 'HS256' // Explicitly set algorithm
    }
  );
  
  return token;
}

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

/**
 * Verify a share token and extract the list ID
 * @param {string} token - Share token to verify
 * @returns {string} List ID from the token
 */
function verifyShareToken(token) {
  try {
    const decoded = jwt.verify(token, secretKey, { algorithms: ['HS256'] });
    
    // Validate that this is a share token
    if (decoded.purpose !== 'share' || !decoded.listId) {
      throw new Error('Invalid share token');
    }
    
    return decoded.listId;
  } catch (err) {
    throw new Error('Invalid or expired share token');
  }
}

module.exports = {
  generateToken,
  verifyToken,
  generateShareToken,
  verifyShareToken
};