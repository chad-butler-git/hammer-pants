import api from './axios';

/**
 * Fetch all items
 * @returns {Promise<Array>} Array of items
 */
export const fetchItems = async () => {
  try {
    return await api.get('/items');
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

/**
 * Fetch a single item by ID
 * @param {string} id - Item ID
 * @returns {Promise<Object>} Item object
 */
export const fetchItemById = async (id) => {
  try {
    return await api.get(`/items/${id}`);
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new item
 * @param {Object} itemData - Item data
 * @returns {Promise<Object>} Created item
 */
export const createItem = async (itemData) => {
  try {
    return await api.post('/items', itemData);
  } catch (error) {
    console.error('Error creating item:', error);
    throw error;
  }
};

/**
 * Update an existing item
 * @param {string} id - Item ID
 * @param {Object} itemData - Updated item data
 * @returns {Promise<Object>} Updated item
 */
export const updateItem = async (id, itemData) => {
  try {
    return await api.put(`/items/${id}`, itemData);
  } catch (error) {
    console.error(`Error updating item ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an item
 * @param {string} id - Item ID
 * @returns {Promise<void>}
 */
export const deleteItem = async (id) => {
  try {
    return await api.delete(`/items/${id}`);
  } catch (error) {
    console.error(`Error deleting item ${id}:`, error);
    throw error;
  }
};