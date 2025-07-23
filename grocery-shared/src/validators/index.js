/**
 * Validation schemas for grocery domain models
 * Using Joi for schema validation
 */
const Joi = require('joi');

// Item schema
const itemSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  name: Joi.string().required(),
  category: Joi.string().required()
});

// Aisle schema
const aisleSchema = Joi.object({
  number: Joi.number().integer().min(1).max(20).required(),
  categories: Joi.array().items(Joi.string()).default([])
});

// Store schema
const storeSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  name: Joi.string().required(),
  address: Joi.string().required(),
  aisles: Joi.array().items(Joi.object({
    number: Joi.number().integer().min(1).max(20).required(),
    categories: Joi.array().items(Joi.string()).default([])
  })).default([])
});

// ShoppingList schema
const shoppingListSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required(),
  storeId: Joi.string().guid({ version: 'uuidv4' }).required(),
  items: Joi.array().items(Joi.object({
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
    name: Joi.string().required(),
    category: Joi.string().required()
  })).default([])
});

// RouteStep schema
const routeStepSchema = Joi.object({
  aisleNumber: Joi.number().integer().min(1).max(20).required(),
  items: Joi.array().items(Joi.object({
    id: Joi.string().guid({ version: 'uuidv4' }).required(),
    name: Joi.string().required(),
    category: Joi.string().required()
  })).default([])
});

module.exports = {
  itemSchema,
  aisleSchema,
  storeSchema,
  shoppingListSchema,
  routeStepSchema
};