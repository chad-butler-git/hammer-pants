/**
 * ShoppingList model representing a shopping list for a specific store
 */
const { v4: uuidv4 } = require('uuid');
const validators = require('../validators');
const Item = require('./Item');

class ShoppingList {
  /**
   * Create a new ShoppingList
   * @param {Object} config - ShoppingList configuration
   * @param {string} [config.id] - UUID v4 string (generated if not provided)
   * @param {string} config.storeId - ID of the store this list is for
   * @param {Array} [config.items] - Array of Item objects or configs
   */
  constructor(config = {}) {
    this.id = config.id || uuidv4();
    this.storeId = config.storeId || '';
    
    // Convert item configs to Item instances if needed
    this.items = [];
    if (Array.isArray(config.items)) {
      this.items = config.items.map(item => 
        item instanceof Item ? item : new Item(item)
      );
    }

    // Validate using Joi schema
    const { error } = validators.shoppingListSchema.validate(this);
    if (error) {
      throw new Error(`Invalid ShoppingList: ${error.message}`);
    }
  }
}

module.exports = ShoppingList;