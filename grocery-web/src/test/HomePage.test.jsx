import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import useAppStore from '../state/useAppStore';

// Mock the store with some test data
vi.mocked(useAppStore).mockReturnValue({
  items: [{ id: '1', name: 'Apples', aisleCategory: 'Produce' }],
  stores: [{ id: '1', name: 'Grocery Store', address: '123 Main St' }],
  selectedStore: null,
  currentList: null,
  isLoading: false,
  error: null,
  fetchItems: vi.fn(),
  fetchStores: vi.fn(),
  selectStore: vi.fn(),
  createShoppingList: vi.fn(),
  addItemToList: vi.fn(),
});

describe('HomePage', () => {
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Grocery Shopping App')).toBeInTheDocument();
  });
  
  it('calls fetchItems and fetchStores on mount', () => {
    const fetchItems = vi.fn();
    const fetchStores = vi.fn();
    
    vi.mocked(useAppStore).mockReturnValueOnce({
      ...vi.mocked(useAppStore)(),
      fetchItems,
      fetchStores,
    });
    
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    expect(fetchItems).toHaveBeenCalled();
    expect(fetchStores).toHaveBeenCalled();
  });
  
  it('disables the Start Shopping button when no list exists', () => {
    render(
      <BrowserRouter>
        <HomePage />
      </BrowserRouter>
    );
    
    const button = screen.getByText('Create a shopping list first');
    expect(button.closest('a')).toHaveClass('bg-gray-400');
    expect(button.closest('a')).toHaveClass('cursor-not-allowed');
  });
});