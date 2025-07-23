/**
 * Planner factory module
 * Provides a factory function to get the appropriate route planner
 */
const LinearAislePlanner = require('./LinearAislePlanner');

// Map of planner types to their constructor functions
// This allows easy registration of new planner types in the future
const PLANNER_TYPES = {
  linear: () => new LinearAislePlanner()
};

/**
 * Get a route planner instance by type
 * @param {string} type - The type of planner to get (default: "linear")
 * @returns {Object} A planner instance with a plan() method
 * @throws {Error} If the requested planner type is not supported
 */
function getPlanner(type = "linear") {
  const plannerFactory = PLANNER_TYPES[type];
  
  if (!plannerFactory) {
    throw new Error(`Unknown planner type: ${type}`);
  }
  
  return plannerFactory();
}

module.exports = {
  getPlanner
};