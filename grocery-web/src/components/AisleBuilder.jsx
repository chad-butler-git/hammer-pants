import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const DEFAULT_CATEGORIES = [
  'Produce',
  'Dairy',
  'Meat',
  'Bakery',
  'Frozen',
  'Canned Goods',
  'Dry Goods',
  'Beverages',
  'Snacks',
  'Household',
  'Personal Care',
  'Pet Supplies'
];

function AisleBuilder({ onAisleAdded, existingAisles = [] }) {
  const [selectedAisle, setSelectedAisle] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [error, setError] = useState('');
  const [availableAisles, setAvailableAisles] = useState([]);

  // Initialize available aisles (1-20)
  useEffect(() => {
    updateAvailableAisles();
  }, [existingAisles]);

  const updateAvailableAisles = () => {
    const existingAisleNumbers = existingAisles.map(aisle => aisle.number);
    const available = Array.from({ length: 20 }, (_, i) => i + 1)
      .filter(num => !existingAisleNumbers.includes(num));
    
    setAvailableAisles(available);
    
    // Reset selected aisle if it's no longer available
    if (available.length > 0 && !available.includes(selectedAisle)) {
      setSelectedAisle(available[0]);
    }
  };

  const handleAisleChange = (e) => {
    setSelectedAisle(Number(e.target.value));
    setError('');
  };

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
    setError('');
  };

  const handleAddAisle = () => {
    // Validation
    if (selectedCategories.length === 0) {
      setError('Please select at least one category for this aisle');
      return;
    }

    if (existingAisles.some(aisle => aisle.number === selectedAisle)) {
      setError(`Aisle ${selectedAisle} already exists`);
      return;
    }

    // Add the aisle
    const newAisle = {
      number: selectedAisle,
      categories: [...selectedCategories]
    };

    onAisleAdded(newAisle);

    // Reset selections
    setSelectedCategories([]);
    updateAvailableAisles();
  };

  return (
    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 mb-4">
      <h3 className="text-lg font-medium mb-3">Add Aisle Mapping</h3>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label htmlFor="aisleNumber" className="block text-gray-700 font-medium mb-2">
            Aisle Number
          </label>
          <select
            id="aisleNumber"
            value={selectedAisle}
            onChange={handleAisleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={availableAisles.length === 0}
          >
            {availableAisles.map(num => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
            {availableAisles.length === 0 && (
              <option value="">No available aisles</option>
            )}
          </select>
          {availableAisles.length === 0 && (
            <p className="text-sm text-red-600 mt-1">Maximum of 20 aisles reached</p>
          )}
        </div>
        
        <div>
          <button
            type="button"
            onClick={handleAddAisle}
            className="mt-8 w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:bg-green-300"
            disabled={availableAisles.length === 0 || selectedCategories.length === 0}
          >
            Add Aisle
          </button>
        </div>
      </div>
      
      <div>
        <label className="block text-gray-700 font-medium mb-2">
          Categories (select at least one)
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {DEFAULT_CATEGORIES.map(category => (
            <div key={category} className="flex items-center">
              <input
                type="checkbox"
                id={`category-${category}`}
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="mr-2"
              />
              <label htmlFor={`category-${category}`} className="text-sm">
                {category}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

AisleBuilder.propTypes = {
  onAisleAdded: PropTypes.func.isRequired,
  existingAisles: PropTypes.arrayOf(
    PropTypes.shape({
      number: PropTypes.number.isRequired,
      categories: PropTypes.arrayOf(PropTypes.string).isRequired
    })
  )
};

export default AisleBuilder;