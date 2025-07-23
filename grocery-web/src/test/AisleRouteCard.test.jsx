import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AisleRouteCard from '../components/AisleRouteCard';

describe('AisleRouteCard', () => {
  const mockOnComplete = vi.fn();
  
  const mockStep = {
    id: 'step1',
    aisle: 'Dairy',
    completed: false,
    items: [
      { id: 'item1', name: 'Milk', notes: null },
      { id: 'item2', name: 'Cheese', notes: 'Get the sharp cheddar' }
    ]
  };
  
  const mockCompletedStep = {
    ...mockStep,
    completed: true
  };
  
  it('renders the step information correctly', () => {
    render(
      <AisleRouteCard 
        step={mockStep} 
        index={0} 
        onComplete={mockOnComplete} 
      />
    );
    
    // Check that the aisle name is displayed
    expect(screen.getByText('Step 1: Dairy')).toBeInTheDocument();
    
    // Check that the item count is displayed
    expect(screen.getByText('2 items')).toBeInTheDocument();
    
    // Check that the items are displayed
    expect(screen.getByText('Milk')).toBeInTheDocument();
    expect(screen.getByText('Cheese')).toBeInTheDocument();
    
    // Check that the item notes are displayed
    expect(screen.getByText('(Get the sharp cheddar)')).toBeInTheDocument();
    
    // Check that the Mark Complete button is displayed
    expect(screen.getByText('Mark Complete')).toBeInTheDocument();
  });
  
  it('calls onComplete when the Mark Complete button is clicked', () => {
    render(
      <AisleRouteCard 
        step={mockStep} 
        index={0} 
        onComplete={mockOnComplete} 
      />
    );
    
    // Find the Mark Complete button
    const completeButton = screen.getByText('Mark Complete');
    
    // Click the button
    fireEvent.click(completeButton);
    
    // Check that onComplete was called with the correct step ID
    expect(mockOnComplete).toHaveBeenCalledWith('step1');
  });
  
  it('displays completed state correctly', () => {
    render(
      <AisleRouteCard 
        step={mockCompletedStep} 
        index={0} 
        onComplete={mockOnComplete} 
      />
    );
    
    // Check that the Completed button is displayed
    expect(screen.getByText('Completed')).toBeInTheDocument();
    
    // Check that the button is disabled
    const completeButton = screen.getByText('Completed');
    expect(completeButton).toBeDisabled();
    
    // Check that the items have line-through styling
    const items = screen.getAllByRole('listitem');
    items.forEach(item => {
      expect(item).toHaveClass('line-through');
      expect(item).toHaveClass('text-gray-500');
    });
  });
  
  it('applies the correct styling based on completion status', () => {
    const { rerender } = render(
      <AisleRouteCard 
        step={mockStep} 
        index={0} 
        onComplete={mockOnComplete} 
      />
    );
    
    // Check that the incomplete step has blue border
    const incompleteCard = screen.getByText('Step 1: Dairy').closest('div');
    expect(incompleteCard).toHaveClass('border-blue-500');
    expect(incompleteCard).not.toHaveClass('border-green-500');
    expect(incompleteCard).not.toHaveClass('bg-green-50');
    
    // Rerender with completed step
    rerender(
      <AisleRouteCard 
        step={mockCompletedStep} 
        index={0} 
        onComplete={mockOnComplete} 
      />
    );
    
    // Check that the completed step has green border and background
    const completeCard = screen.getByText('Step 1: Dairy').closest('div');
    expect(completeCard).toHaveClass('border-green-500');
    expect(completeCard).toHaveClass('bg-green-50');
    expect(completeCard).not.toHaveClass('border-blue-500');
  });
  
  it('renders with different index values', () => {
    const { rerender } = render(
      <AisleRouteCard 
        step={mockStep} 
        index={0} 
        onComplete={mockOnComplete} 
      />
    );
    
    // Check that the step number is correct
    expect(screen.getByText('Step 1: Dairy')).toBeInTheDocument();
    
    // Rerender with a different index
    rerender(
      <AisleRouteCard 
        step={mockStep} 
        index={2} 
        onComplete={mockOnComplete} 
      />
    );
    
    // Check that the step number is updated
    expect(screen.getByText('Step 3: Dairy')).toBeInTheDocument();
  });
});