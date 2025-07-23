/**
 * In-memory data store singleton
 * 
 * Provides CRUD operations for grocery domain objects
 */
const { 
  Item, 
  Store, 
  ShoppingList,
  itemSchema,
  storeSchema,
  shoppingListSchema
} = require('grocery-shared');

/**
 * Singleton data store
 */
class DataStore {
  constructor() {
    this.items = [];
    this.stores = [];
    this.shoppingLists = [];
  }

  // Item CRUD operations
  
  /**
   * Get all items
   * @returns {Array} Array of Item objects
   */
  getItems() {
    return [...this.items];
  }

  /**
   * Get item by ID
   * @param {string} id - Item ID
   * @returns {Item|null} Item object or null if not found
   */
  getItemById(id) {
    return this.items.find(item => item.id === id) || null;
  }

  /**
   * Add a new item
   * @param {Object} itemData - Item data
   * @returns {Item} Created Item
   * @throws {Error} If validation fails
   */
  addItem(itemData) {
    // Validate using Joi schema
    const { error } = itemSchema.validate(itemData);
    if (error) {
      throw new Error(`Invalid Item: ${error.message}`);
    }

    const item = new Item(itemData);
    this.items.push(item);
    return item;
  }

  /**
   * Update an existing item
   * @param {string} id - Item ID
   * @param {Object} itemData - Updated item data
   * @returns {Item} Updated Item
   * @throws {Error} If item not found or validation fails
   */
  updateItem(id, itemData) {
    const index = this.items.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error(`Item not found with ID: ${id}`);
    }

    // Preserve the ID
    const updatedData = { ...itemData, id };

    // Validate using Joi schema
    const { error } = itemSchema.validate(updatedData);
    if (error) {
      throw new Error(`Invalid Item: ${error.message}`);
    }

    const updatedItem = new Item(updatedData);
    this.items[index] = updatedItem;
    return updatedItem;
  }

  /**
   * Delete an item
   * @param {string} id - Item ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteItem(id) {
    const initialLength = this.items.length;
    this.items = this.items.filter(item => item.id !== id);
    return this.items.length < initialLength;
  }

  // Store CRUD operations
  
  /**
   * Get all stores
   * @returns {Array} Array of Store objects
   */
  getStores() {
    return [...this.stores];
  }

  /**
   * Get store by ID
   * @param {string} id - Store ID
   * @returns {Store|null} Store object or null if not found
   */
  getStoreById(id) {
    return this.stores.find(store => store.id === id) || null;
  }

  /**
   * Add a new store
   * @param {Object} storeData - Store data
   * @returns {Store} Created Store
   * @throws {Error} If validation fails
   */
  addStore(storeData) {
    // Validate using Joi schema
    const { error } = storeSchema.validate(storeData);
    if (error) {
      throw new Error(`Invalid Store: ${error.message}`);
    }

    const store = new Store(storeData);
    this.stores.push(store);
    return store;
  }

  /**
   * Update an existing store
   * @param {string} id - Store ID
   * @param {Object} storeData - Updated store data
   * @returns {Store} Updated Store
   * @throws {Error} If store not found or validation fails
   */
  updateStore(id, storeData) {
    const index = this.stores.findIndex(store => store.id === id);
    if (index === -1) {
      throw new Error(`Store not found with ID: ${id}`);
    }

    // Preserve the ID
    const updatedData = { ...storeData, id };

    // Validate using Joi schema
    const { error } = storeSchema.validate(updatedData);
    if (error) {
      throw new Error(`Invalid Store: ${error.message}`);
    }

    const updatedStore = new Store(updatedData);
    this.stores[index] = updatedStore;
    return updatedStore;
  }

  /**
   * Delete a store
   * @param {string} id - Store ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteStore(id) {
    const initialLength = this.stores.length;
    this.stores = this.stores.filter(store => store.id !== id);
    return this.stores.length < initialLength;
  }

  // ShoppingList CRUD operations
  
  /**
   * Get all shopping lists
   * @returns {Array} Array of ShoppingList objects
   */
  getShoppingLists() {
    return [...this.shoppingLists];
  }

  /**
   * Get shopping list by ID
   * @param {string} id - ShoppingList ID
   * @returns {ShoppingList|null} ShoppingList object or null if not found
   */
  getShoppingListById(id) {
    return this.shoppingLists.find(list => list.id === id) || null;
  }

  /**
   * Add a new shopping list
   * @param {Object} listData - ShoppingList data
   * @returns {ShoppingList} Created ShoppingList
   * @throws {Error} If validation fails
   */
  addShoppingList(listData) {
    // Validate using Joi schema
    const { error } = shoppingListSchema.validate(listData);
    if (error) {
      throw new Error(`Invalid ShoppingList: ${error.message}`);
    }

    const shoppingList = new ShoppingList(listData);
    this.shoppingLists.push(shoppingList);
    return shoppingList;
  }

  /**
   * Update an existing shopping list
   * @param {string} id - ShoppingList ID
   * @param {Object} listData - Updated shopping list data
   * @returns {ShoppingList} Updated ShoppingList
   * @throws {Error} If shopping list not found or validation fails
   */
  updateShoppingList(id, listData) {
    const index = this.shoppingLists.findIndex(list => list.id === id);
    if (index === -1) {
      throw new Error(`ShoppingList not found with ID: ${id}`);
    }

    // Preserve the ID
    const updatedData = { ...listData, id };

    // Validate using Joi schema
    const { error } = shoppingListSchema.validate(updatedData);
    if (error) {
      throw new Error(`Invalid ShoppingList: ${error.message}`);
    }

    const updatedList = new ShoppingList(updatedData);
    this.shoppingLists[index] = updatedList;
    return updatedList;
  }

  /**
   * Delete a shopping list
   * @param {string} id - ShoppingList ID
   * @returns {boolean} True if deleted, false if not found
   */
  deleteShoppingList(id) {
    const initialLength = this.shoppingLists.length;
    this.shoppingLists = this.shoppingLists.filter(list => list.id !== id);
    return this.shoppingLists.length < initialLength;
  }
}

// Create and export singleton instance
const dataStore = new DataStore();
module.exports = dataStore;