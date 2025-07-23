import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ShoppingListPage from '../pages/ShoppingListPage';
import useAppStore from '../state/useAppStore';

// Mock react-router-dom's useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock window.confirm
const originalConfirm = window.confirm;
window.confirm = vi.fn();

// Restore original confirm after tests
afterAll(() => {
  window.confirm = originalConfirm;
});

describe('ShoppingListPage', () => {
  const mockRemoveItemFromList = vi.fn();
  const mockFetchCurrentList = vi.fn();
  const mockFetchRoute = vi.fn();
  const mockClearList = vi.fn();
  
  const mockCurrentList = {
    id: 'list1',
    name: 'Test Shopping List',
    items: [
      { id: 'item1', name: 'Milk', aisleCategory: 'Dairy' },
      { id: 'item2', name: 'Bread', aisleCategory: 'Bakery' },
      { id: 'item3', name: 'Apples', aisleCategory: 'Produce' }
    ]
  };
  
  const mockSelectedStore = {
    id: 'store1',
    name: 'Test Store'
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    useAppStore.mockReturnValue({
      currentList: mockCurrentList,
      selectedStore: mockSelectedStore,
      fetchCurrentList: mockFetchCurrentList,
      removeItemFromList: mockRemoveItemFromList,
      fetchRoute: mockFetchRoute,
      clearList: mockClearList,
      isLoading: false,
      error: null
    });
    
    window.confirm.mockReturnValue(true);
  });
  
  it('renders the shopping list with grouped items', () => {
    render(
      <BrowserRouter>
        <ShoppingListPage />
      </BrowserRouter>
    );
    
    // Check that the page title is rendered
    expect(screen.getByText('Shopping List')).toBeInTheDocument();
    
    // Check that the store name is displayed
    expect(screen.getByText('Test Store')).toBeInTheDocument();
    
    // Check that items are grouped by aisle category
    expect(screen.getByText('Dairy')).toBeInTheDocument();
    expect(screen.getByText('Bakery')).toBeInTheDocument();
    expect(screen.getByText('Produce')).toBeInTheDocument();
    
    // Check that all items are displayed
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Bread')).toBeInTheDocument();
    expect(screen.getByText('Apples')).toBeInTheDocument();
  });
  
  it('calls fetchCurrentList on mount', () => {
    render(
      <BrowserRouter>
        <ShoppingListPage />
      </BrowserRouter>
    );
    
    expect(mockFetchCurrentList).toHaveBeenCalledWith(mockCurrentList.id);
  });
  
  it('removes an item when the remove button is clicked', async () => {
    render(
      <BrowserRouter>
        <ShoppingListPage />
      </BrowserRouter>
    );
    
    // Find all remove buttons
    const removeButtons = screen.getAllByText('Remove');
    
    // Click the first remove button (for Milk)
    fireEvent.click(removeButtons[0]);
    
    // Check that removeItemFromList was called with the correct item ID
    expect(mockRemoveItemFromList).toHaveBeenCalledWith('item1');
  });
  
  it('generates a route and navigates to the route page', async () => {
    render(
      <BrowserRouter>
        <ShoppingListPage />
      </BrowserRouter>
    );
    
    // Find the Generate Route button
    const generateButton = screen.getByText('Generate Route');
    
    // Click the button
    fireEvent.click(generateButton);
    
    // Check that fetchRoute was called with the correct planner type
    await waitFor(() => {
      expect(mockFetchRoute).toHaveBeenCalledWith('linear');
    });
    
    // Check that it navigates to the route page
    expect(mockNavigate).toHaveBeenCalledWith('/route');
  });
  
  it('clears the list and navigates to home when Clear List is clicked', async () => {
    render(
      <BrowserRouter>
        <ShoppingListPage />
      </BrowserRouter>
    );
    
    // Find the Clear List button
    const clearButton = screen.getByText('Clear List');
    
    // Click the button
    fireEvent.click(clearButton);
    
    // Check that window.confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to clear your shopping list?');
    
    // Check that clearList was called
    await waitFor(() => {
      expect(mockClearList).toHaveBeenCalled();
    });
    
    // Check that it navigates to the home page
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  it('does not clear the list if the user cancels the confirmation', async () => {
    // Mock window.confirm to return false
    window.confirm.mockReturnValueOnce(false);
    
    render(
      <BrowserRouter>
        <ShoppingListPage />
      </BrowserRouter>
    );
    
    // Find the Clear List button
    const clearButton = screen.getByText('Clear List');
    
    // Click the button
    fireEvent.click(clearButton);
    
    // Check that window.confirm was called
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to clear your shopping list?');
    
    // Check that clearList was not called
    expect(mockClearList).not.toHaveBeenCalled();
    
    // Check that it does not navigate
    expect(mockNavigate).not.toHaveBeenCalled();
  });
  
  it('redirects to home if no list or store is selected', () => {
    // Mock the store to return null for currentList and selectedStore
    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      currentList: null,
      selectedStore: null
    });
    
    render(
      <BrowserRouter>
        <ShoppingListPage />
      </BrowserRouter>
    );
    
    // Check that it shows the no list message
    expect(screen.getByText('No shopping list or store selected.')).toBeInTheDocument();
    
    // Check for the go back link
    expect(screen.getByText('Go back to home')).toBeInTheDocument();
  });
});