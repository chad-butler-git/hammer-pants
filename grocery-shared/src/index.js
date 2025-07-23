/**
 * Grocery Shared Models and Utilities
 * 
 * This module exports shared models and utilities for the grocery application.
 */

// Export models
const Item = require('./models/Item');
const Aisle = require('./models/Aisle');
const Store = require('./models/Store');
const ShoppingList = require('./models/ShoppingList');
const RouteStep = require('./models/RouteStep');

// Export validators
const validators = require('./validators');

module.exports = {
  // Models
  Item,
  Aisle,
  Store,
  ShoppingList,
  RouteStep,
  
  // Schemas
  itemSchema: validators.itemSchema,
  aisleSchema: validators.aisleSchema,
  storeSchema: validators.storeSchema,
  shoppingListSchema: validators.shoppingListSchema,
  routeStepSchema: validators.routeStepSchema,
  
  // Export validators as a property for backward compatibility
  validators
};