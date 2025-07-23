import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import StoreOnboardPage from '../pages/StoreOnboardPage';
import useAppStore from '../state/useAppStore';
import { toast } from 'react-toastify';

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

// Mock the useNavigate hook
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock useAppStore
vi.mock('../state/useAppStore', () => ({
  default: vi.fn()
}));

describe('StoreOnboardPage', () => {
  const mockCreateStore = vi.fn();
  const mockClearError = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    useAppStore.mockReturnValue({
      createStore: mockCreateStore,
      isLoading: false,
      error: null,
      clearError: mockClearError
    });
  });
  
  it('renders without crashing', () => {
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Add New Store')).toBeInTheDocument();
  });
  
  it('displays form fields for store information', () => {
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    expect(screen.getByLabelText('Store Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Store Address')).toBeInTheDocument();
    expect(screen.getByText('Aisle Mappings')).toBeInTheDocument();
  });
  
  it('disables submit button when no aisles are added', () => {
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    const submitButton = screen.getByText('Save Store');
    expect(submitButton).toBeDisabled();
  });
  
  it('allows adding an aisle with categories', () => {
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    // Select aisle number (default is 1)
    const aisleSelect = screen.getByLabelText('Aisle Number');
    expect(aisleSelect).toBeInTheDocument();
    
    // Select categories
    const produceCheckbox = screen.getByLabelText('Produce');
    const dairyCheckbox = screen.getByLabelText('Dairy');
    
    fireEvent.click(produceCheckbox);
    fireEvent.click(dairyCheckbox);
    
    // Add the aisle
    fireEvent.click(screen.getByText('Add Aisle'));
    
    // Check that the aisle was added to the table
    expect(screen.getByText('1')).toBeInTheDocument(); // Aisle number
    expect(screen.getAllByText('Produce')[1]).toBeInTheDocument(); // Category in table
    expect(screen.getAllByText('Dairy')[1]).toBeInTheDocument(); // Category in table
    
    // Submit button should be enabled now
    const submitButton = screen.getByText('Save Store');
    expect(submitButton).not.toBeDisabled();
  });
  
  it('prevents adding duplicate aisle numbers', async () => {
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    // Add first aisle
    const produceCheckbox = screen.getByLabelText('Produce');
    fireEvent.click(produceCheckbox);
    fireEvent.click(screen.getByText('Add Aisle'));
    
    // Try to add the same aisle again
    fireEvent.click(produceCheckbox);
    fireEvent.click(screen.getByText('Add Aisle'));
    
    // Should show an error
    await waitFor(() => {
      expect(screen.getByText('Aisle 1 already exists')).toBeInTheDocument();
    });
  });
  
  it('requires at least one category per aisle', () => {
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    // Try to add aisle without selecting categories
    fireEvent.click(screen.getByText('Add Aisle'));
    
    // Should show an error
    expect(screen.getByText('Please select at least one category for this aisle')).toBeInTheDocument();
  });
  
  it('calls createStore with correct payload when form is submitted', async () => {
    mockCreateStore.mockResolvedValue({ id: '123', name: 'Test Store' });
    
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Store Name'), {
      target: { value: 'Test Store' }
    });
    fireEvent.change(screen.getByLabelText('Store Address'), {
      target: { value: '123 Test St' }
    });
    
    // Add an aisle
    const produceCheckbox = screen.getByLabelText('Produce');
    const dairyCheckbox = screen.getByLabelText('Dairy');
    
    fireEvent.click(produceCheckbox);
    fireEvent.click(dairyCheckbox);
    fireEvent.click(screen.getByText('Add Aisle'));
    
    // Submit the form
    fireEvent.click(screen.getByText('Save Store'));
    
    // Check that createStore was called with the correct data
    await waitFor(() => {
      expect(mockCreateStore).toHaveBeenCalledWith({
        name: 'Test Store',
        address: '123 Test St',
        aisles: [
          {
            number: 1,
            categories: ['Produce', 'Dairy']
          }
        ]
      });
      
      expect(toast.success).toHaveBeenCalledWith('Store created successfully!');
    });
  });
  
  it('validates form fields before submission', async () => {
    render(
      <BrowserRouter>
        <StoreOnboardPage />
      </BrowserRouter>
    );
    
    // Add an aisle so the submit button is enabled
    const produceCheckbox = screen.getByLabelText('Produce');
    fireEvent.click(produceCheckbox);
    fireEvent.click(screen.getByText('Add Aisle'));
    
    // Submit without filling required fields
    fireEvent.click(screen.getByText('Save Store'));
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Store name is required')).toBeInTheDocument();
      expect(screen.getByText('Store address is required')).toBeInTheDocument();
    });
    
    // Verify createStore was not called
    expect(mockCreateStore).not.toHaveBeenCalled();
  });
});