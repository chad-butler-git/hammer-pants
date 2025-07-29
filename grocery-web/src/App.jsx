import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import useAppStore from './state/useAppStore';
import NavigationHeader from './components/NavigationHeader';
import HomePage from './pages/HomePage';
import StoreOnboardPage from './pages/StoreOnboardPage';
import ShoppingListPage from './pages/ShoppingListPage';
import RouteViewPage from './pages/RouteViewPage';
import SharedListPage from './pages/SharedListPage';
import ItemEditPage from './pages/ItemEditPage';
import './App.css';

function App() {
  const { fetchItems, fetchStores } = useAppStore();

  // Initialize app data
  useEffect(() => {
    fetchItems();
    fetchStores();
  }, [fetchItems, fetchStores]);

  return (
    <div className="min-h-screen bg-gray-100">
      <NavigationHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboard" element={<StoreOnboardPage />} />
        <Route path="/list" element={<ShoppingListPage />} />
        <Route path="/route" element={<RouteViewPage />} />
        <Route path="/shared/:token" element={<SharedListPage />} />
        <Route path="/items/new" element={<ItemEditPage />} />
        <Route path="/items/edit/:id" element={<ItemEditPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;