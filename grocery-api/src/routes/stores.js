/**
 * Stores routes
 */
const express = require('express');
const router = express.Router();
const datastore = require('../data/datastore');
const { storeSchema } = require('grocery-shared').validators;

/**
 * GET /stores - List all stores
 */
router.get('/', (req, res) => {
  res.json(datastore.getStores());
});

/**
 * GET /stores/:id - Get store by ID
 */
router.get('/:id', (req, res) => {
  const store = datastore.getStoreById(req.params.id);
  
  if (!store) {
    return res.status(404).json({ error: `Store not found with ID: ${req.params.id}` });
  }
  
  res.json(store);
});

/**
 * POST /stores - Create a new store
 */
router.post('/', (req, res) => {
  try {
    // Validate request body
    const { error } = storeSchema.validate(req.body, { 
      allowUnknown: true, // Allow ID to be generated
      stripUnknown: true  // Remove unknown fields
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    const newStore = datastore.addStore(req.body);
    res.status(201).json(newStore);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /stores/:id - Update a store
 */
router.put('/:id', (req, res) => {
  try {
    // Validate request body
    const { error } = storeSchema.validate({ ...req.body, id: req.params.id }, { 
      allowUnknown: true,
      stripUnknown: true
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    const updatedStore = datastore.updateStore(req.params.id, req.body);
    res.json(updatedStore);
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /stores/:id - Delete a store
 */
router.delete('/:id', (req, res) => {
  const deleted = datastore.deleteStore(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({ error: `Store not found with ID: ${req.params.id}` });
  }
  
  res.status(204).end();
});

module.exports = router;