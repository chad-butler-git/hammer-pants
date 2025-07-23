/**
 * Store model representing a grocery store
 */
const { v4: uuidv4 } = require('uuid');
const validators = require('../validators');
const Aisle = require('./Aisle');

class Store {
  /**
   * Create a new Store
   * @param {Object} config - Store configuration
   * @param {string} [config.id] - UUID v4 string (generated if not provided)
   * @param {string} config.name - Store name
   * @param {string} config.address - Store address
   * @param {Array} [config.aisles] - Array of Aisle objects or configs
   */
  constructor(config = {}) {
    this.id = config.id || uuidv4();
    this.name = config.name || '';
    this.address = config.address || '';
    
    // Convert aisle configs to Aisle instances if needed
    this.aisles = [];
    if (Array.isArray(config.aisles)) {
      this.aisles = config.aisles.map(aisle => 
        aisle instanceof Aisle ? aisle : new Aisle(aisle)
      );
    }

    // Validate using Joi schema
    const { error } = validators.storeSchema.validate(this);
    if (error) {
      throw new Error(`Invalid Store: ${error.message}`);
    }
  }
}

module.exports = Store;