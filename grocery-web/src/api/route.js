import api from './axios';

/**
 * Fetch an optimized shopping route
 * @param {Object} routeParams - Parameters for route optimization
 * @param {string} routeParams.storeId - ID of the store to shop at
 * @param {string} routeParams.listId - ID of the shopping list
 * @param {string} [routeParams.plannerType] - Optional planner type (e.g., 'linear')
 * @returns {Promise<Array>} Array of RouteStep objects
 */
export const fetchRoute = async ({ storeId, listId, plannerType }) => {
  try {
    const params = {};
    if (plannerType) {
      params.plannerType = plannerType;
    }

    return await api.post('/route', {
      storeId,
      listId,
      ...params,
    });
  } catch (error) {
    console.error('Error fetching shopping route:', error);
    throw error;
  }
};

/**
 * Mark a route step as completed
 * @param {string} routeId - Route ID
 * @param {string} stepId - Step ID
 * @returns {Promise<Object>} Updated route
 */
export const completeRouteStep = async (routeId, stepId) => {
  try {
    return await api.patch(`/route/${routeId}/steps/${stepId}/complete`);
  } catch (error) {
    console.error(`Error marking route step ${stepId} as completed:`, error);
    throw error;
  }
};

/**
 * Reset a route (mark all steps as not completed)
 * @param {string} routeId - Route ID
 * @returns {Promise<Object>} Reset route
 */
export const resetRoute = async (routeId) => {
  try {
    return await api.post(`/route/${routeId}/reset`);
  } catch (error) {
    console.error(`Error resetting route ${routeId}:`, error);
    throw error;
  }
};