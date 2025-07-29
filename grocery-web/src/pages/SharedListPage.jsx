import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import useAppStore from '../state/useAppStore';

function SharedListPage() {
  const { token } = useParams();
  const { getSharedList, isLoading, error } = useAppStore();
  const [sharedData, setSharedData] = useState(null);

  useEffect(() => {
    const fetchSharedList = async () => {
      if (token) {
        const data = await getSharedList(token);
        if (data) {
          setSharedData(data);
        }
      }
    };

    fetchSharedList();
  }, [token, getSharedList]);

  // Group items by aisle category
  const groupedItems = sharedData?.list?.items?.reduce((acc, item) => {
    const aisleCategory = item.aisleCategory || 'Uncategorized';
    if (!acc[aisleCategory]) {
      acc[aisleCategory] = [];
    }
    acc[aisleCategory].push(item);
    return acc;
  }, {}) || {};

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg mb-4">Loading shared shopping list...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Home
        </Link>
      </div>
    );
  }

  if (!sharedData || !sharedData.list) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg mb-4">This shared list is no longer available or has expired.</p>
        <Link to="/" className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Go to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
        <h1 className="text-2xl font-bold text-blue-800 mb-2">Shared Shopping List</h1>
        <p className="text-sm text-blue-600">
          This is a shared shopping list. The link will expire in 15 minutes from when it was created.
        </p>
      </div>

      {Object.keys(groupedItems).length === 0 ? (
        <div className="text-center py-8 bg-white rounded-lg shadow-md">
          <p className="text-lg text-gray-600 mb-4">This shopping list is empty.</p>
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
                  <li key={item.id} className="px-4 py-3">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      {item.notes && (
                        <div
                          className="text-sm text-gray-600 mt-1 markdown-content"
                          dangerouslySetInnerHTML={{
                            __html: item.renderedNotes || `<p>${item.notes}</p>`
                          }}
                        />
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link
          to="/"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
}

export default SharedListPage;