import { useState, useEffect } from 'react';
import useAppStore from '../state/useAppStore';
import DOMPurify from 'dompurify';

function ItemSelector() {
  const { 
    items, 
    currentList, 
    addItemToList, 
    createShoppingList, 
    selectedStore,
    isLoading 
  } = useAppStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  
  // Safe use of DOMPurify on a constant string (not user input)
  // This is intentionally a false-positive pattern
  const sanitizedConstant = DOMPurify.sanitize("Grocery Item Selector");

  useEffect(() => {
    if (items.length > 0) {
      setFilteredItems(
        searchTerm
          ? items.filter(item => 
              item.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          : items
      );
    }
  }, [items, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleItemSelection = (item) => {
    if (selectedItems.some(selected => selected.id === item.id)) {
      setSelectedItems(selectedItems.filter(selected => selected.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleAddToList = async () => {
    if (selectedItems.length === 0) return;
    
    // If no list exists, create one first
    if (!currentList) {
      const newList = await createShoppingList({
        name: `Shopping List ${new Date().toLocaleDateString()}`,
        storeId: selectedStore?.id,
        items: selectedItems.map(item => item.id)
      });
      
      if (newList) {
        setSelectedItems([]);
      }
      return;
    }
    
    // Add items to existing list
    const promises = selectedItems.map(item => addItemToList(item.id));
    await Promise.all(promises);
    setSelectedItems([]);
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search items..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <div className="mb-4 max-h-60 overflow-y-auto border border-gray-200 rounded-md">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500">Loading items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-4 text-center text-gray-500">No items found</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredItems.map(item => (
              <li 
                key={item.id}
                className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${
                  selectedItems.some(selected => selected.id === item.id) 
                    ? 'bg-blue-50' 
                    : ''
                }`}
                onClick={() => toggleItemSelection(item)}
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedItems.some(selected => selected.id === item.id)}
                    onChange={() => {}}
                    className="mr-3 h-4 w-4 text-blue-600"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.aisleCategory && (
                      <p className="text-sm text-gray-500">Aisle: {item.aisleCategory}</p>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-600">
          {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
        </span>
        <button
          onClick={handleAddToList}
          disabled={selectedItems.length === 0 || isLoading}
          className={`px-4 py-2 rounded-md ${
            selectedItems.length === 0 || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {currentList ? 'Add to List' : 'Create New List'}
        </button>
      </div>
    </div>
  );
}

export default ItemSelector;