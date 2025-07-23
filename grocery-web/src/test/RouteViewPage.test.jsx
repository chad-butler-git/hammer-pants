import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import RouteViewPage from '../pages/RouteViewPage';
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

describe('RouteViewPage', () => {
  const mockFetchRoute = vi.fn();
  const mockCompleteRouteStep = vi.fn();
  const mockResetRoute = vi.fn();
  
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
  
  const mockRoute = {
    id: 'route1',
    steps: [
      {
        id: 'step1',
        aisle: 'Dairy',
        completed: false,
        items: [{ id: 'item1', name: 'Milk', notes: null }]
      },
      {
        id: 'step2',
        aisle: 'Bakery',
        completed: false,
        items: [{ id: 'item2', name: 'Bread', notes: null }]
      },
      {
        id: 'step3',
        aisle: 'Produce',
        completed: false,
        items: [{ id: 'item3', name: 'Apples', notes: null }]
      }
    ]
  };
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    useAppStore.mockReturnValue({
      currentList: mockCurrentList,
      selectedStore: mockSelectedStore,
      currentRoute: mockRoute,
      fetchRoute: mockFetchRoute,
      completeRouteStep: mockCompleteRouteStep,
      resetRoute: mockResetRoute,
      isLoading: false,
      error: null
    });
  });
  
  it('renders the route view with steps', () => {
    render(
      <BrowserRouter>
        <RouteViewPage />
      </BrowserRouter>
    );
    
    // Check that the page title is rendered
    expect(screen.getByText('Shopping Route')).toBeInTheDocument();
    
    // Check that the store name is displayed
    expect(screen.getByText('Test Store')).toBeInTheDocument();
    
    // Check that the planner type selector is displayed
    expect(screen.getByLabelText('Route Planner Type:')).toBeInTheDocument();
    
    // Check that all steps are displayed
    expect(screen.getByText('Step 1: Dairy')).toBeInTheDocument();
    expect(screen.getByText('Step 2: Bakery')).toBeInTheDocument();
    expect(screen.getByText('Step 3: Produce')).toBeInTheDocument();
    
    // Check that all items are displayed
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Bread')).toBeInTheDocument();
    expect(screen.getByText('Apples')).toBeInTheDocument();
  });
  
  it('fetches a route on mount', () => {
    render(
      <BrowserRouter>
        <RouteViewPage />
      </BrowserRouter>
    );
    
    expect(mockFetchRoute).toHaveBeenCalledWith('linear');
  });
  
  it('changes planner type and fetches a new route', async () => {
    render(
      <BrowserRouter>
        <RouteViewPage />
      </BrowserRouter>
    );
    
    // Find the planner type selector
    const plannerSelect = screen.getByLabelText('Route Planner Type:');
    
    // Change the selection to 'optimized'
    fireEvent.change(plannerSelect, { target: { value: 'optimized' } });
    
    // Check that fetchRoute was called with the new planner type
    expect(mockFetchRoute).toHaveBeenCalledWith('optimized');
  });
  
  it('marks a step as completed', async () => {
    render(
      <BrowserRouter>
        <RouteViewPage />
      </BrowserRouter>
    );
    
    // Find all 'Mark Complete' buttons
    const completeButtons = screen.getAllByText('Mark Complete');
    
    // Click the first button (for Dairy step)
    fireEvent.click(completeButtons[0]);
    
    // Check that completeRouteStep was called with the correct step ID
    expect(mockCompleteRouteStep).toHaveBeenCalledWith('step1');
  });
  
  it('resets the route when Reset Route button is clicked', async () => {
    render(
      <BrowserRouter>
        <RouteViewPage />
      </BrowserRouter>
    );
    
    // Find the Reset Route button
    const resetButton = screen.getAllByText('Reset Route')[0]; // There are two, get the first one
    
    // Click the button
    fireEvent.click(resetButton);
    
    // Check that resetRoute was called
    expect(mockResetRoute).toHaveBeenCalled();
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
        <RouteViewPage />
      </BrowserRouter>
    );
    
    // Check that it shows the no list message
    expect(screen.getByText('No shopping list or store selected.')).toBeInTheDocument();
    
    // Check for the go back link
    expect(screen.getByText('Go back to home')).toBeInTheDocument();
    
    // Check that it tries to navigate to home
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
  
  it('shows loading state when generating route', () => {
    // Mock the store to return true for isLoading
    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      isLoading: true,
      currentRoute: null
    });
    
    render(
      <BrowserRouter>
        <RouteViewPage />
      </BrowserRouter>
    );
    
    // Check that it shows the loading message
    expect(screen.getByText('Generating your shopping route...')).toBeInTheDocument();
  });
  
  it('shows empty state when no route is available', () => {
    // Mock the store to return null for currentRoute
    useAppStore.mockReturnValueOnce({
      ...useAppStore(),
      currentRoute: null,
      isLoading: false
    });
    
    render(
      <BrowserRouter>
        <RouteViewPage />
      </BrowserRouter>
    );
    
    // Check that it shows the no route message
    expect(screen.getByText('No route available.')).toBeInTheDocument();
    
    // Check for the generate route button
    const generateButton = screen.getByText('Generate Route');
    expect(generateButton).toBeInTheDocument();
    
    // Click the button
    fireEvent.click(generateButton);
    
    // Check that fetchRoute was called
    expect(mockFetchRoute).toHaveBeenCalledWith('linear');
  });
});