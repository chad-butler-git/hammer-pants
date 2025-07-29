/**
 * Items routes
 */
const express = require('express');
const router = express.Router();
const datastore = require('../data/datastore');
const { itemSchema } = require('grocery-shared').validators;
const { sanitizeAndRenderMarkdown } = require('grocery-shared/src/markdown');
const _ = require('lodash');

/**
 * GET /items - List all items
 */
router.get('/', (req, res) => {
  res.json(datastore.getItems());
});

/**
 * GET /items/:id - Get item by ID
 */
router.get('/:id', (req, res) => {
  const item = datastore.getItemById(req.params.id);
  
  if (!item) {
    return res.status(404).json({ error: `Item not found with ID: ${req.params.id}` });
  }
  
  // If the item has markdown notes, include both raw and rendered versions
  if (item.notes) {
    item.renderedNotes = sanitizeAndRenderMarkdown(item.notes);
  }
  
  res.json(item);
});

/**
 * POST /items - Create a new item
 */
router.post('/', (req, res) => {
  try {
    // Validate request body
    const { error } = itemSchema.validate(req.body, {
      allowUnknown: true, // Allow ID to be generated
      stripUnknown: true  // Remove unknown fields
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // VULNERABILITY: CVE-2021-23337 - Prototype Pollution in lodash
    // Using _.template on user input without sanitization
    if (req.body.name) {
      const compiled = _.template('<div>${name}</div>');
      const rendered = compiled({ 'name': req.body.name });
      console.log('Rendered template:', rendered);
    }
    
    // Process markdown notes if present
    if (req.body.notes) {
      // Store the raw markdown, but also include rendered HTML in the response
      const renderedNotes = sanitizeAndRenderMarkdown(req.body.notes);
      const newItem = datastore.addItem(req.body);
      res.status(201).json({
        ...newItem,
        renderedNotes
      });
    } else {
      const newItem = datastore.addItem(req.body);
      res.status(201).json(newItem);
    }
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PUT /items/:id - Update an item
 */
router.put('/:id', (req, res) => {
  try {
    // Validate request body
    const { error } = itemSchema.validate({ ...req.body, id: req.params.id }, { 
      allowUnknown: true,
      stripUnknown: true
    });
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    
    // Process markdown notes if present
    if (req.body.notes) {
      // Store the raw markdown, but also include rendered HTML in the response
      const renderedNotes = sanitizeAndRenderMarkdown(req.body.notes);
      const updatedItem = datastore.updateItem(req.params.id, req.body);
      res.json({
        ...updatedItem,
        renderedNotes
      });
    } else {
      const updatedItem = datastore.updateItem(req.params.id, req.body);
      res.json(updatedItem);
    }
  } catch (err) {
    if (err.message.includes('not found')) {
      return res.status(404).json({ error: err.message });
    }
    res.status(400).json({ error: err.message });
  }
});

/**
 * DELETE /items/:id - Delete an item
 */
router.delete('/:id', (req, res) => {
  const deleted = datastore.deleteItem(req.params.id);
  
  if (!deleted) {
    return res.status(404).json({ error: `Item not found with ID: ${req.params.id}` });
  }
  
  res.status(204).end();
});

module.exports = router;