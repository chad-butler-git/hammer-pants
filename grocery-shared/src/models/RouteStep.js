/**
 * RouteStep model representing a step in a shopping route
 */
const validators = require('../validators');
const Item = require('./Item');

class RouteStep {
  /**
   * Create a new RouteStep
   * @param {Object} config - RouteStep configuration
   * @param {number} config.aisleNumber - Aisle number for this step
   * @param {Array} [config.items] - Array of Item objects or configs
   */
  constructor(config = {}) {
    this.aisleNumber = config.aisleNumber !== undefined ? config.aisleNumber : 1;
    
    // Convert item configs to Item instances if needed
    this.items = [];
    if (Array.isArray(config.items)) {
      this.items = config.items.map(item => 
        item instanceof Item ? item : new Item(item)
      );
    }

    // Validate using Joi schema
    const { error } = validators.routeStepSchema.validate(this);
    if (error) {
      throw new Error(`Invalid RouteStep: ${error.message}`);
    }
  }
}

module.exports = RouteStep;