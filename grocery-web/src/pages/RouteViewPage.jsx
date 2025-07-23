import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../state/useAppStore';
import AisleRouteCard from '../components/AisleRouteCard';

function RouteViewPage() {
  const navigate = useNavigate();
  const { 
    currentList, 
    selectedStore,
    currentRoute,
    fetchRoute,
    completeRouteStep,
    resetRoute,
    isLoading, 
    error 
  } = useAppStore();

  const [plannerType, setPlannerType] = useState('linear');

  useEffect(() => {
    if (!currentList || !selectedStore) {
      navigate('/');
      return;
    }

    // Always fetch a fresh route when the page loads
    fetchRoute(plannerType);
  }, [currentList, selectedStore, currentRoute, fetchRoute, navigate, plannerType]);

  const handleChangePlannerType = (e) => {
    setPlannerType(e.target.value);
    fetchRoute(e.target.value);
  };

  const handleCompleteStep = (stepId) => {
    completeRouteStep(stepId);
  };

  const handleResetRoute = () => {
    resetRoute();
  };

  if (!currentList || !selectedStore) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg mb-4">No shopping list or store selected.</p>
        <Link to="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shopping Route</h1>
        <div>
          <span className="text-gray-600 mr-2">Shopping at:</span>
          <span className="font-medium">{selectedStore.name}</span>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-6 bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <label htmlFor="plannerType" className="block text-sm font-medium text-gray-700 mb-1">
              Route Planner Type:
            </label>
            <select
              id="plannerType"
              value={plannerType}
              onChange={handleChangePlannerType}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="linear">Linear (Default)</option>
              <option value="optimized">Optimized</option>
            </select>
          </div>
          
          <button
            onClick={handleResetRoute}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:bg-yellow-300"
            disabled={isLoading || !currentRoute}
          >
            Reset Route
          </button>
        </div>
      </div>
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Calculating optimal shopping route...</p>
        </div>
      ) : (
        <>
          {!currentRoute || !currentRoute.steps || currentRoute.steps.length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600 mb-4">
                {isLoading ? 'Generating your shopping route...' : 'No route available.'}
              </p>
              {!isLoading && (
                <button
                  onClick={() => fetchRoute(plannerType)}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Generate Route
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {currentRoute.steps.map((step, index) => (
                <div key={step.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <AisleRouteCard 
                    step={step} 
                    index={index} 
                    onComplete={handleCompleteStep} 
                  />
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <Link
              to="/list"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Back to List
            </Link>
            
            <div className="flex space-x-2">
              <button
                onClick={handleResetRoute}
                disabled={isLoading || !currentRoute}
                className={`px-4 py-2 rounded-md ${
                  isLoading || !currentRoute
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-yellow-500 text-white hover:bg-yellow-600'
                }`}
              >
                Reset Route
              </button>
              
              <Link
                to="/"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
              >
                Finish Shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RouteViewPage;