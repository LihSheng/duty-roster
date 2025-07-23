import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddDutyModal from '../AddDutyModal';

// Mock axios instead of importing it
const axios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn()
};

// Mock react-toastify
const toast = {
  success: jest.fn(),
  error: jest.fn(),
  warning: jest.fn(),
  info: jest.fn()
};

// Mock dependencies
jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn()
}));
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn()
  }
}));

// Mock createPortal to make it work with testing-library
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: (node) => node,
  };
});

// Mock FrequencySelector component
jest.mock('../FrequencySelector', () => {
  return function MockFrequencySelector({ frequency, days, onChange }) {
    return (
      <div data-testid="frequency-selector">
        <button 
          type="button" 
          data-testid="change-frequency"
          onClick={() => onChange('weekly', [1, 3, 5])}
        >
          Change Frequency
        </button>
        <div>Current frequency: {frequency}</div>
        <div>Selected days: {days ? days.join(', ') : 'none'}</div>
      </div>
    );
  };
});

describe('AddDutyModal', () => {
  const mockOnClose = jest.fn();
  const mockOnDutyAdded = jest.fn();
  const mockDate = '2023-01-01';
  
  const mockDuties = [
    { id: 1, name: 'Duty 1', description: 'Description 1', is_group_duty: 0 },
    { id: 2, name: 'Duty 2', description: 'Description 2', is_group_duty: 1 },
  ];
  
  const mockPeople = [
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
    { id: 3, name: 'Person 3' }
  ];
  
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockImplementation((url) => {
      if (url === '/api/duties') {
        return Promise.resolve({ data: mockDuties });
      } else if (url === '/api/people') {
        return Promise.resolve({ data: mockPeople });
      } else if (url.includes('/api/assignments')) {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    axios.post.mockResolvedValue({ data: { id: 123 } });
  });

  test('renders loading state initially', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // Wait for data to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/duties');
      expect(axios.get).toHaveBeenCalledWith('/api/people');
    });
  });

  test('renders existing duty form after loading', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Use Existing Duty')).toBeInTheDocument();
    });
    
    // Should be in "existing duty" mode by default
    expect(screen.getByText('Use Existing Duty')).toHaveClass('bg-primary-600');
    expect(screen.getByText('Create New Duty')).toHaveClass('bg-light-200');
    
    // Should have duty and person selects
    expect(screen.getByLabelText('Select Duty')).toBeInTheDocument();
    expect(screen.getByLabelText('Assign To')).toBeInTheDocument();
  });

  test('switches to new duty form when button is clicked', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Create New Duty')).toBeInTheDocument();
    });
    
    // Click the "Create New Duty" button
    fireEvent.click(screen.getByText('Create New Duty'));
    
    // Should now be in "new duty" mode
    expect(screen.getByText('Create New Duty')).toHaveClass('bg-primary-600');
    expect(screen.getByText('Use Existing Duty')).toHaveClass('bg-light-200');
    
    // Should have name and description inputs
    expect(screen.getByLabelText('Duty Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Description')).toBeInTheDocument();
    
    // Should have frequency selector
    expect(screen.getByTestId('frequency-selector')).toBeInTheDocument();
    
    // Should have group duty checkbox
    expect(screen.getByLabelText(/This is a group duty/)).toBeInTheDocument();
  });

  test('assigns existing duty successfully', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Assign Duty')).toBeInTheDocument();
    });
    
    // Select a duty and person
    fireEvent.change(screen.getByLabelText('Select Duty'), { target: { value: '1' } });
    fireEvent.change(screen.getByLabelText('Assign To'), { target: { value: '2' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Assign Duty'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/assignments', {
        duty_id: 1,
        person_id: 2,
        assigned_date: mockDate,
        due_date: mockDate,
      });
    });
    
    expect(toast.success).toHaveBeenCalledWith('Duty assigned successfully to 1 person');
    expect(mockOnDutyAdded).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('creates and assigns new duty successfully', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Create New Duty')).toBeInTheDocument();
    });
    
    // Switch to new duty mode
    fireEvent.click(screen.getByText('Create New Duty'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Duty Name'), { target: { value: 'New Duty' } });
    fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'New Description' } });
    
    // Change frequency using the mock
    fireEvent.click(screen.getByTestId('change-frequency'));
    
    // Select a person
    fireEvent.change(screen.getByLabelText('Assign To'), { target: { value: '3' } });
    
    // Submit the form
    fireEvent.click(screen.getByText('Create & Assign'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/duties', {
        name: 'New Duty',
        description: 'New Description',
        frequency: 'weekly',
        days_of_week: [1, 3, 5],
        is_group_duty: false
      });
    });
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/assignments', expect.any(Object));
    });
    
    expect(toast.success).toHaveBeenCalledWith('Duty assigned successfully to 1 person');
    expect(mockOnDutyAdded).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles group duty assignment', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByLabelText('Select Duty')).toBeInTheDocument();
    });
    
    // Select a group duty
    fireEvent.change(screen.getByLabelText('Select Duty'), { target: { value: '2' } });
    
    // Should now show multiple selection
    await waitFor(() => {
      expect(screen.getByText(/hold Ctrl\/Cmd to select multiple/)).toBeInTheDocument();
    });
    
    // Mock multiple selection (this is a bit tricky with jsdom)
    const multiSelect = screen.getByRole('listbox');
    fireEvent.change(multiSelect, { 
      target: { 
        options: [
          { value: '1', selected: true },
          { value: '2', selected: true },
          { value: '3', selected: false }
        ] 
      } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Assign Duty'));
    
    // Should create multiple assignments
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledTimes(2);
    });
    
    expect(toast.success).toHaveBeenCalledWith('Duty assigned successfully to 2 people');
  });

  test('creates group duty when checkbox is checked', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Create New Duty')).toBeInTheDocument();
    });
    
    // Switch to new duty mode
    fireEvent.click(screen.getByText('Create New Duty'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Duty Name'), { target: { value: 'New Group Duty' } });
    
    // Check the group duty checkbox
    fireEvent.click(screen.getByLabelText(/This is a group duty/));
    
    // Should now show multiple selection
    await waitFor(() => {
      expect(screen.getByText(/hold Ctrl\/Cmd to select multiple/)).toBeInTheDocument();
    });
    
    // Mock multiple selection
    const multiSelect = screen.getByRole('listbox');
    fireEvent.change(multiSelect, { 
      target: { 
        options: [
          { value: '1', selected: true },
          { value: '2', selected: true },
          { value: '3', selected: false }
        ] 
      } 
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Create & Assign'));
    
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/duties', expect.objectContaining({
        name: 'New Group Duty',
        is_group_duty: true
      }));
    });
  });

  test('shows error when no duty is selected', async () => {
    // Mock empty duties array
    axios.get.mockImplementation((url) => {
      if (url === '/api/duties') {
        return Promise.resolve({ data: [] });
      } else if (url === '/api/people') {
        return Promise.resolve({ data: mockPeople });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Create New Duty')).toBeInTheDocument();
    });
    
    // Try to submit the form
    fireEvent.click(screen.getByText('Assign Duty'));
    
    expect(toast.error).toHaveBeenCalledWith('Please select a duty');
  });

  test('shows error when no person is selected', async () => {
    // Mock empty people array
    axios.get.mockImplementation((url) => {
      if (url === '/api/duties') {
        return Promise.resolve({ data: mockDuties });
      } else if (url === '/api/people') {
        return Promise.resolve({ data: [] });
      }
      return Promise.reject(new Error('Not found'));
    });
    
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Create New Duty')).toBeInTheDocument();
    });
    
    // Switch to new duty mode
    fireEvent.click(screen.getByText('Create New Duty'));
    
    // Fill out the form
    fireEvent.change(screen.getByLabelText('Duty Name'), { target: { value: 'New Duty' } });
    
    // Try to submit the form
    fireEvent.click(screen.getByText('Create & Assign'));
    
    expect(toast.error).toHaveBeenCalledWith('Please select a person for this duty');
  });

  test('closes modal when cancel button is clicked', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('closes modal when close button in header is clicked', async () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
    });
    
    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('does not fetch data when modal is not open', () => {
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={false}
      />
    );
    
    expect(axios.get).not.toHaveBeenCalled();
  });

  test('handles API error when fetching data', async () => {
    axios.get.mockRejectedValue(new Error('API error'));
    
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load duties and people');
    });
  });

  test('handles API error when assigning duty', async () => {
    axios.post.mockRejectedValue(new Error('API error'));
    
    render(
      <AddDutyModal
        date={mockDate}
        onClose={mockOnClose}
        onDutyAdded={mockOnDutyAdded}
        isOpen={true}
      />
    );
    
    await waitFor(() => {
      expect(screen.getByText('Assign Duty')).toBeInTheDocument();
    });
    
    // Submit the form
    fireEvent.click(screen.getByText('Assign Duty'));
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to assign duty');
    });
  });
});