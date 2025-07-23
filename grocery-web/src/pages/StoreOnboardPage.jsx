import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useAppStore from '../state/useAppStore';
import AisleBuilder from '../components/AisleBuilder';

function StoreOnboardPage() {
  const navigate = useNavigate();
  const { createStore, isLoading, error, clearError } = useAppStore();
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  
  const [aisles, setAisles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleAddAisle = (newAisle) => {
    setAisles(prev => [...prev, newAisle]);
    
    // Clear aisle-related errors
    setFormErrors(prev => ({
      ...prev,
      aisles: ''
    }));
  };

  const handleRemoveAisle = (aisleNumber) => {
    setAisles(prev => prev.filter(aisle => aisle.number !== aisleNumber));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Store name is required';
    }
    
    if (!formData.address.trim()) {
      errors.address = 'Store address is required';
    }
    
    if (aisles.length === 0) {
      errors.aisles = 'At least one aisle mapping is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) {
      return;
    }
    
    const storeData = {
      name: formData.name,
      address: formData.address,
      aisles: aisles
    };
    
    const newStore = await createStore(storeData);
    if (newStore) {
      toast.success('Store created successfully!');
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Add New Store</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
            Store Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.name ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formErrors.name && (
            <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700 font-medium mb-2">
            Store Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-3 py-2 border ${formErrors.address ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {formErrors.address && (
            <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
          )}
        </div>
        
        <div className="mb-4">
          <h3 className="text-lg font-medium mb-2">Aisle Mappings</h3>
          
          <AisleBuilder
            onAisleAdded={handleAddAisle}
            existingAisles={aisles}
          />
          
          {formErrors.aisles && (
            <p className="text-red-500 text-sm mb-2">{formErrors.aisles}</p>
          )}
          
          {aisles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 mb-4">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b text-left">Aisle #</th>
                    <th className="py-2 px-4 border-b text-left">Categories</th>
                    <th className="py-2 px-4 border-b text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {aisles.sort((a, b) => a.number - b.number).map(aisle => (
                    <tr key={aisle.number} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{aisle.number}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex flex-wrap gap-1">
                          {aisle.categories.map(category => (
                            <span
                              key={category}
                              className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveAisle(aisle.number)}
                          className="text-red-600 hover:text-red-800"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 italic mb-4">No aisles added yet. Use the form above to add aisle mappings.</p>
          )}
        </div>
        
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            disabled={isLoading || aisles.length === 0}
          >
            {isLoading ? 'Saving...' : 'Save Store'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default StoreOnboardPage;