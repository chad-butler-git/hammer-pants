import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../state/useAppStore';
import ItemSelector from '../components/ItemSelector';
import StorePicker from '../components/StorePicker';

function HomePage() {
  const {
    fetchItems,
    fetchStores,
    currentList,
    selectedStore,
    removeItemFromList,
    isLoading,
    error
  } = useAppStore();

  useEffect(() => {
    fetchItems();
    fetchStores();
  }, [fetchItems, fetchStores]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Grocery Shopping App</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <StorePicker />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Item Selector</h2>
          <ItemSelector />
        </div>
      </div>

      {currentList && currentList.items && currentList.items.length > 0 && (
        <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Shopping List Preview</h2>
            <span className="text-sm text-gray-600">{currentList.items.length} items</span>
          </div>
          <div className="max-h-60 overflow-y-auto">
            <ul className="divide-y divide-gray-200">
              {currentList.items.slice(0, 5).map(item => (
                <li key={item.id} className="py-2 flex justify-between items-center">
                  <span>{item.name}</span>
                  <button
                    onClick={() => removeItemFromList(item.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            {currentList.items.length > 5 && (
              <div className="mt-2 text-center text-sm text-gray-600">
                +{currentList.items.length - 5} more items
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <Link
          to={currentList ? '/list' : '#'}
          className={`px-6 py-3 rounded-lg text-white font-medium text-lg ${
            currentList
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
          onClick={e => !currentList && e.preventDefault()}
        >
          {isLoading ? 'Loading...' : (currentList ? 'Start Shopping' : 'Create a shopping list first')}
        </Link>
      </div>
    </div>
  );
}

export default HomePage;