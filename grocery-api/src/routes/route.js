/**
 * Route planning routes
 */
const express = require('express');
const router = express.Router();
const datastore = require('../data/datastore');
const { RouteStep } = require('grocery-shared');
const Joi = require('joi');
const { getPlanner } = require('../planners');

// Input schema for route planning
const routeInputSchema = Joi.object({
  storeId: Joi.string().guid({ version: 'uuidv4' }).required(),
  items: Joi.array().items(Joi.string().guid({ version: 'uuidv4' })).required(),
  plannerType: Joi.string().valid('linear').optional()
});

/**
 * POST /route - Plan a shopping route
 * Groups items by aisle and sorts aisles numerically
 */
router.post('/', (req, res) => {
  try {
    // Validate request body
    const { error } = routeInputSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Check if store exists
    const store = datastore.getStoreById(req.body.storeId);
    if (!store) {
      return res.status(404).json({ error: `Store not found with ID: ${req.body.storeId}` });
    }

    // Get all items
    const itemIds = req.body.items;
    const items = itemIds.map(id => {
      const item = datastore.getItemById(id);
      if (!item) {
        throw new Error(`Item not found with ID: ${id}`);
      }
      return item;
    });

    // Validate that all items exist in the chosen store
    items.forEach(item => {
      let itemInStore = false;
      store.aisles.forEach(aisle => {
        if (aisle.categories.includes(item.category)) {
          itemInStore = true;
        }
      });
      
      if (!itemInStore) {
        throw new Error(`Item "${item.name}" (category: ${item.category}) is not available in store "${store.name}"`);
      }
    });

    // Get the appropriate planner and generate the route
    const planner = getPlanner(req.body.plannerType || "linear");
    const route = planner.plan(store, items);
    
    res.json(route);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;