import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAppStore from '../state/useAppStore';

function StorePicker() {
  const { 
    stores, 
    fetchStores, 
    selectedStore, 
    selectStore,
    isLoading 
  } = useAppStore();

  useEffect(() => {
    if (stores.length === 0) {
      fetchStores();
    }
  }, [stores.length, fetchStores]);

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Select Store</h2>
      
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="text-center py-4">
          <p className="text-gray-600 mb-4">No stores available.</p>
          <Link
            to="/onboard"
            className="inline-block bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Add New Store
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {stores.map(store => (
            <button
              key={store.id}
              onClick={() => selectStore(store.id)}
              className={`block w-full text-left px-4 py-3 rounded-md ${
                selectedStore?.id === store.id
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <div className="font-medium">{store.name}</div>
              {store.address && (
                <div className="text-sm mt-1 truncate">
                  {selectedStore?.id === store.id ? 'white' : 'text-gray-600'}
                  {store.address}
                </div>
              )}
            </button>
          ))}
          
          <div className="pt-2">
            <Link
              to="/onboard"
              className="inline-block w-full text-center bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Add New Store
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default StorePicker;