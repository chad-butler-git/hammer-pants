import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAppStore from '../state/useAppStore';

function ShoppingListPage() {
  const navigate = useNavigate();
  const {
    currentList,
    selectedStore,
    fetchCurrentList,
    removeItemFromList,
    fetchRoute,
    clearList,
    isLoading,
    error
  } = useAppStore();
  
  const [generatingRoute, setGeneratingRoute] = useState(false);

  useEffect(() => {
    if (currentList) {
      fetchCurrentList(currentList.id);
    } else {
      navigate('/');
    }
  }, [currentList, fetchCurrentList, navigate]);

  // Group items by aisle category
  const groupedItems = currentList?.items?.reduce((acc, item) => {
    const aisleCategory = item.aisleCategory || 'Uncategorized';
    if (!acc[aisleCategory]) {
      acc[aisleCategory] = [];
    }
    acc[aisleCategory].push(item);
    return acc;
  }, {}) || {};

  const handleRemoveItem = (itemId) => {
    removeItemFromList(itemId);
  };
  
  const handleGenerateRoute = async () => {
    if (!currentList || !selectedStore) return;
    
    setGeneratingRoute(true);
    try {
      await fetchRoute('linear');
      navigate('/route');
    } catch (err) {
      console.error('Error generating route:', err);
    } finally {
      setGeneratingRoute(false);
    }
  };
  
  const handleClearList = async () => {
    if (window.confirm('Are you sure you want to clear your shopping list?')) {
      await clearList();
      navigate('/');
    }
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
        <h1 className="text-3xl font-bold">Shopping List</h1>
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
      
      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-lg text-gray-600">Loading shopping list...</p>
        </div>
      ) : (
        <>
          {Object.keys(groupedItems).length === 0 ? (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-lg text-gray-600 mb-4">Your shopping list is empty.</p>
              <Link to="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add items
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedItems).map(([category, items]) => (
                <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-blue-500 text-white px-4 py-2">
                    <h2 className="text-xl font-semibold">{category}</h2>
                  </div>
                  <ul className="divide-y divide-gray-200">
                    {items.map(item => (
                      <li key={item.id} className="px-4 py-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          {item.notes && <p className="text-sm text-gray-600">{item.notes}</p>}
                        </div>
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700"
                          aria-label="Remove item"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-8 flex justify-between">
            <Link
              to="/"
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            >
              Back to Home
            </Link>
            
            <div className="flex space-x-2">
              <button
                onClick={handleClearList}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Clear List
              </button>
              
              <button
                onClick={handleGenerateRoute}
                disabled={generatingRoute || isLoading}
                className={`px-4 py-2 rounded-md ${
                  generatingRoute || isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {generatingRoute ? 'Generating...' : 'Generate Route'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default ShoppingListPage;