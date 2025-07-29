/**
 * Item model representing a grocery item
 */
const { v4: uuidv4 } = require('uuid');
const validators = require('../validators');

class Item {
  /**
   * Create a new Item
   * @param {Object} config - Item configuration
   * @param {string} [config.id] - UUID v4 string (generated if not provided)
   * @param {string} config.name - Item name
   * @param {string} config.category - Item category
   * @param {string} [config.notes] - Markdown notes for the item (optional)
   */
  constructor(config = {}) {
    this.id = config.id || uuidv4();
    this.name = config.name || '';
    this.category = config.category || '';
    this.notes = config.notes || '';

    // Validate using Joi schema
    const { error } = validators.itemSchema.validate(this);
    if (error) {
      throw new Error(`Invalid Item: ${error.message}`);
    }
  }
}

module.exports = Item;