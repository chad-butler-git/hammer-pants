import api from './axios';

/**
 * Fetch all stores
 * @returns {Promise<Array>} Array of stores
 */
export const fetchStores = async () => {
  try {
    return await api.get('/stores');
  } catch (error) {
    console.error('Error fetching stores:', error);
    throw error;
  }
};

/**
 * Fetch a single store by ID
 * @param {string} id - Store ID
 * @returns {Promise<Object>} Store object
 */
export const fetchStoreById = async (id) => {
  try {
    return await api.get(`/stores/${id}`);
  } catch (error) {
    console.error(`Error fetching store ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new store
 * @param {Object} storeData - Store data including name, address, and aisle categories
 * @returns {Promise<Object>} Created store
 */
export const createStore = async (storeData) => {
  try {
    return await api.post('/stores', storeData);
  } catch (error) {
    console.error('Error creating store:', error);
    throw error;
  }
};

/**
 * Update an existing store
 * @param {string} id - Store ID
 * @param {Object} storeData - Updated store data
 * @returns {Promise<Object>} Updated store
 */
export const updateStore = async (id, storeData) => {
  try {
    return await api.put(`/stores/${id}`, storeData);
  } catch (error) {
    console.error(`Error updating store ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a store
 * @param {string} id - Store ID
 * @returns {Promise<void>}
 */
export const deleteStore = async (id) => {
  try {
    return await api.delete(`/stores/${id}`);
  } catch (error) {
    console.error(`Error deleting store ${id}:`, error);
    throw error;
  }
};