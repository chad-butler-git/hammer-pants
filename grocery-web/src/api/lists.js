import api from './axios';

/**
 * Fetch all shopping lists
 * @returns {Promise<Array>} Array of shopping lists
 */
export const fetchLists = async () => {
  try {
    return await api.get('/lists');
  } catch (error) {
    console.error('Error fetching shopping lists:', error);
    throw error;
  }
};

/**
 * Fetch a single shopping list by ID
 * @param {string} id - Shopping list ID
 * @returns {Promise<Object>} Shopping list object
 */
export const fetchListById = async (id) => {
  try {
    return await api.get(`/lists/${id}`);
  } catch (error) {
    console.error(`Error fetching shopping list ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new shopping list
 * @param {Object} listData - Shopping list data including items
 * @returns {Promise<Object>} Created shopping list
 */
export const createList = async (listData) => {
  try {
    return await api.post('/lists', listData);
  } catch (error) {
    console.error('Error creating shopping list:', error);
    throw error;
  }
};

/**
 * Update an existing shopping list
 * @param {string} id - Shopping list ID
 * @param {Object} listData - Updated shopping list data
 * @returns {Promise<Object>} Updated shopping list
 */
export const updateList = async (id, listData) => {
  try {
    return await api.put(`/lists/${id}`, listData);
  } catch (error) {
    console.error(`Error updating shopping list ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a shopping list
 * @param {string} id - Shopping list ID
 * @returns {Promise<void>}
 */
export const deleteList = async (id) => {
  try {
    return await api.delete(`/lists/${id}`);
  } catch (error) {
    console.error(`Error deleting shopping list ${id}:`, error);
    throw error;
  }
};

/**
 * Add an item to a shopping list
 * @param {string} listId - Shopping list ID
 * @param {string} itemId - Item ID to add
 * @returns {Promise<Object>} Updated shopping list
 */
export const addItemToList = async (listId, itemId) => {
  try {
    return await api.post(`/lists/${listId}/items`, { itemId });
  } catch (error) {
    console.error(`Error adding item to shopping list ${listId}:`, error);
    throw error;
  }
};

/**
 * Remove an item from a shopping list
 * @param {string} listId - Shopping list ID
 * @param {string} itemId - Item ID to remove
 * @returns {Promise<Object>} Updated shopping list
 */
export const removeItemFromList = async (listId, itemId) => {
  try {
    return await api.delete(`/lists/${listId}/items/${itemId}`);
  } catch (error) {
    console.error(`Error removing item from shopping list ${listId}:`, error);
    throw error;
  }
};

/**
 * Generate a share token for a shopping list
 * @param {string} listId - Shopping list ID
 * @returns {Promise<Object>} Object containing token and shareUrl
 */
export const shareList = async (listId) => {
  try {
    return await api.post(`/lists/${listId}/share`);
  } catch (error) {
    console.error(`Error sharing shopping list ${listId}:`, error);
    throw error;
  }
};

/**
 * Access a shared shopping list using a token
 * @param {string} token - Share token
 * @returns {Promise<Object>} Shared shopping list
 */
export const getSharedList = async (token) => {
  try {
    return await api.get(`/shared/${token}`);
  } catch (error) {
    console.error('Error accessing shared shopping list:', error);
    throw error;
  }
};