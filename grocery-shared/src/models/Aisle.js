/**
 * Aisle model representing a store aisle
 */
const validators = require('../validators');

class Aisle {
  /**
   * Create a new Aisle
   * @param {Object} config - Aisle configuration
   * @param {number} config.number - Aisle number (1-20)
   * @param {string[]} [config.categories] - Categories in this aisle
   */
  constructor(config = {}) {
    this.number = config.number !== undefined ? config.number : 1;
    this.categories = Array.isArray(config.categories) ? [...config.categories] : [];

    // Validate using Joi schema
    const { error } = validators.aisleSchema.validate(this);
    if (error) {
      throw new Error(`Invalid Aisle: ${error.message}`);
    }
  }
}

module.exports = Aisle;