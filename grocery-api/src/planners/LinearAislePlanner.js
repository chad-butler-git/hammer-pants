/**
 * LinearAislePlanner - Route planner that groups items by aisle and sorts by aisle number
 */
const { RouteStep } = require('grocery-shared');

class LinearAislePlanner {
  /**
   * Plan a shopping route by grouping items by aisle and sorting aisles numerically
   * @param {Object} store - Store object with aisles
   * @param {Array} items - Array of Item objects
   * @returns {Array} Array of RouteStep objects sorted by aisle number
   */
  plan(store, items) {
    if (!store || !Array.isArray(store.aisles)) {
      throw new Error('Invalid store provided');
    }
    
    if (!Array.isArray(items)) {
      throw new Error('Items must be an array');
    }
    
    // Map each item to its aisle number
    const itemsByAisle = {};
    
    // For each item, find which aisle it belongs to based on its category
    items.forEach(item => {
      let aisleFound = false;
      
      // Check each aisle in the store to see if it contains the item's category
      store.aisles.forEach(aisle => {
        if (aisle.categories.includes(item.category)) {
          // Initialize the aisle array if it doesn't exist
          if (!itemsByAisle[aisle.number]) {
            itemsByAisle[aisle.number] = [];
          }
          
          // Add the item to the appropriate aisle
          itemsByAisle[aisle.number].push(item);
          aisleFound = true;
        }
      });
      
      // If no matching aisle was found, put the item in a special "uncategorized" section
      if (!aisleFound) {
        if (!itemsByAisle[0]) {
          itemsByAisle[0] = [];
        }
        itemsByAisle[0].push(item);
      }
    });
    
    // Create RouteStep objects sorted by aisle number
    const route = Object.keys(itemsByAisle)
      .map(Number)
      .sort((a, b) => a - b)
      .map(aisleNumber => {
        // Use aisle 1 for uncategorized items (aisle 0)
        const actualAisleNumber = aisleNumber === 0 ? 1 : aisleNumber;
        return new RouteStep({
          aisleNumber: actualAisleNumber,
          items: itemsByAisle[aisleNumber]
        });
      });
    
    return route;
  }
}

module.exports = LinearAislePlanner;