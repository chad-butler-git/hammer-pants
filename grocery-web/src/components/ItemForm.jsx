import { useState, useEffect } from 'react';
import MarkdownEditor from './MarkdownEditor';

/**
 * Form for adding or editing grocery items with markdown notes
 */
function ItemForm({ item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    notes: ''
  });

  // Initialize form with item data if provided
  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || '',
        category: item.category || '',
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotesChange = (value) => {
    setFormData(prev => ({
      ...prev,
      notes: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Item Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a category</option>
          <option value="Produce">Produce</option>
          <option value="Dairy">Dairy</option>
          <option value="Meat">Meat</option>
          <option value="Seafood">Seafood</option>
          <option value="Bakery">Bakery</option>
          <option value="Frozen">Frozen</option>
          <option value="Snacks">Snacks</option>
          <option value="Beverages">Beverages</option>
          <option value="Condiments">Condiments</option>
          <option value="Canned Goods">Canned Goods</option>
          <option value="Household">Household</option>
          <option value="Personal Care">Personal Care</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes
        </label>
        <MarkdownEditor
          value={formData.notes}
          onChange={handleNotesChange}
          placeholder="Add any notes about this item (optional)..."
        />
      </div>

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          {item ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}

export default ItemForm;