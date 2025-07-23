/**
 * Shopping Lists routes
 */
const express = require('express');
const router = express.Router();
const datastore = require('../data/datastore');
const { shoppingListSchema } = require('grocery-shared').validators;

/**
 * GET /lists - List all shopping lists
 */
router.get('/', (req, res) => {
  res.json(datastore.getShoppingLists());
});

/**
 * GET /lists/:id - Get shopping list by ID
 */
router.get('/:id', (req, res) => {
  const list = datastore.getShoppingListById(req.params.id);
  
  if (!list) {
    return res.status(404).json({ error: `Shopping list not found with ID: ${req.params.id}` });
  }
  
  res.json(list);
});

/**
 * POST /lists - Create a new shopping list
 */
router.post('/', (req, res) => {
  try {
    // Check if store exists
    if (req.body.storeId && !datastore.getStoreById(req.body.storeId)) {
      return res.status(400).json({ error: `Store not found with ID: ${req.body.storeId}` });
    }

    // Add UUID if not provided
    const { v4: uuidv4 } = require('uuid');
    
    // Process items - convert from string IDs to objects if needed
    let processedItems = [];
    if (Array.isArray(req.body.items)) {
      processedItems = req.body.items.map(item => {
        // If item is just a string ID, convert it to an object
        if (typeof item === 'string') {
          const itemObj = datastore.getItemById(item);
          if (itemObj) {
            return itemObj;
          } else {
            console.warn(`Item with ID ${item} not found, skipping`);
            return null;
          }
        }
        return item;
      }).filter(item => item !== null); // Remove any null items
    }

    // Extract only the allowed fields
    const listData = {
      id: req.body.id || uuidv4(),
      storeId: req.body.storeId,
      items: processedItems
    };

    console.log('Creating shopping list with processed data:', JSON.stringify(listData, null, 2));

    // Validate request body
    const { error } = shoppingListSchema.validate(listData, {
      allowUnknown: true, // Allow additional fields
      stripUnknown: true  // Remove unknown fields
    });
    
    if (error) {
      console.error('Validation error:', error.message);
      return res.status(400).json({ error: error.message });
    }
    
    const newList = datastore.addShoppingList(listData);
    res.status(201).json(newList);
  } catch (err) {
    console.error('Error creating shopping list:', err);
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /lists/:id - Update a shopping list
 */
router.put('/:id', (req, res) => {
  try {
    // Check if store exists if storeId is provided
    if (req.body.storeId && !datastore.getStoreById(req.body.storeId)) {
      return res.status(400).json({ error: `Store not found with ID: ${req.body.storeId}` });
    }

    // Validate request body
    const { error } = shoppingListSchema.validate({ ...req.body, id: req.params.id }, { 
      allowUnknown: true,
      stripUnknown: true
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    const updatedList = datastore.updateShoppingList(req.params.id, req.body);
    res.json(updatedList);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /lists/:id - Delete a shopping list
 */
router.delete('/:id', (req, res) => {
  const deleted = datastore.deleteShoppingList(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({ error: `Shopping list not found with ID: ${req.params.id}` });
  }
  
  res.status(204).end();
});

module.exports = router;