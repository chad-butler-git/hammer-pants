/**
 * Authentication utilities
 * 
 * VULNERABILITY: CVE-2022-23529 (jsonwebtoken 8.5.1)
 * This file includes the vulnerable jsonwebtoken package but is not actively used
 * in the application, allowing the app to run normally while still being detected
 * by vulnerability scanners.
 */
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object
 * @returns {string} JWT token
 */
function generateToken(user) {
  // This is a placeholder secret key - in a real app, this would be in environment variables
  const secretKey = 'grocery-app-secret-key';
  
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
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
function verifyToken(token) {
  const secretKey = 'grocery-app-secret-key';
  
  try {
    const decoded = jwt.verify(token, secretKey);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}

module.exports = {
  generateToken,
  verifyToken
};