import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAppStore from '../state/useAppStore';
import ItemForm from '../components/ItemForm';

/**
 * Page for adding or editing an item with markdown notes
 */
function ItemEditPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { items, fetchItems, createItem, updateItem, isLoading, error } = useAppStore();
  const [currentItem, setCurrentItem] = useState(null);

  // Fetch items if needed
  useEffect(() => {
    if (items.length === 0) {
      fetchItems();
    }
  }, [items, fetchItems]);

  // Find the current item if editing
  useEffect(() => {
    if (id && items.length > 0) {
      const item = items.find(item => item.id === id);
      if (item) {
        setCurrentItem(item);
      } else {
        navigate('/');
      }
    }
  }, [id, items, navigate]);

  const handleSubmit = async (formData) => {
    try {
      if (id) {
        // Update existing item
        await updateItem(id, formData);
      } else {
        // Create new item
        await createItem(formData);
      }
      navigate('/');
    } catch (err) {
      console.error('Error saving item:', err);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          {id ? 'Edit Item' : 'Add New Item'}
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">Loading...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6">
            <ItemForm
              item={currentItem}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ItemEditPage;