/**
 * Shopping Lists routes
 */
const express = require('express');
const router = express.Router();
const datastore = require('../data/datastore');
const { shoppingListSchema } = require('grocery-shared').validators;
const { generateShareToken, verifyShareToken } = require('../utils/auth');

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

/**
 * POST /lists/:id/share - Generate a share token for a shopping list
 */
router.post('/:id/share', (req, res) => {
  try {
    const list = datastore.getShoppingListById(req.params.id);
    
    if (!list) {
      return res.status(404).json({ error: `Shopping list not found with ID: ${req.params.id}` });
    }
    
    // Generate a short-lived token for sharing
    const token = generateShareToken(list.id);
    
    // Create a shareable URL
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const shareUrl = `${baseUrl}/api/shared/${token}`;
    
    res.json({
      token,
      shareUrl,
      expiresIn: '15m'
    });
  } catch (err) {
    console.error('Error sharing shopping list:', err);
    res.status(500).json({ error: err.message });
  }
});

/**
 * GET /shared/:token - Access a shared shopping list
 */
router.get('/shared/:token', (req, res) => {
  try {
    // Verify the share token and extract the list ID
    const listId = verifyShareToken(req.params.token);
    
    // Get the shopping list
    const list = datastore.getShoppingListById(listId);
    
    if (!list) {
      return res.status(404).json({ error: 'Shared shopping list not found' });
    }
    
    res.json({
      list,
      shared: true
    });
  } catch (err) {
    console.error('Error accessing shared shopping list:', err);
    res.status(401).json({ error: err.message });
  }
});

module.exports = router;