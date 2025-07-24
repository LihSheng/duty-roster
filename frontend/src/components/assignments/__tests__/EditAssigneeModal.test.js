import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import EditAssigneeModal from '../EditAssigneeModal';

// Mock dependencies
jest.mock('axios');
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock createPortal to make it work with testing-library
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');

  return {
    ...original,
    createPortal: (node) => node,
  };
});

describe('EditAssigneeModal', () => {
  const mockOnClose = jest.fn();
  const mockOnAssigneeUpdated = jest.fn();
  const mockAssignment = {
    id: 1,
    duty_name: 'Test Duty',
    person_id: 2,
    assigned_date: '2023-01-01',
    due_date: '2023-01-31',
  };

  const mockPeople = [
    { id: 1, name: 'Person 1' },
    { id: 2, name: 'Person 2' },
    { id: 3, name: 'Person 3' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockPeople });
    axios.put.mockResolvedValue({ data: {} });
  });

  test('renders loading state initially', async () => {
    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={true}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/people');
    });
  });

  test('renders form with assignment data after loading', async () => {
    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Duty')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Duty')).toHaveValue('Test Duty');
    expect(screen.getByLabelText('Duty')).toBeDisabled();
    expect(screen.getByLabelText('Date')).toHaveValue('2023-01-01');
    expect(screen.getByLabelText('Date')).toBeDisabled();
    expect(screen.getByLabelText('Assign To')).toHaveValue('2');
  });

  test('selects current assignee by default', async () => {
    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Assign To')).toBeInTheDocument();
    });

    expect(screen.getByLabelText('Assign To')).toHaveValue('2');
  });

  test('updates assignee when form is submitted', async () => {
    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Assign To')).toBeInTheDocument();
    });

    // Change the selected person
    fireEvent.change(screen.getByLabelText('Assign To'), { target: { value: '3' } });

    // Submit the form
    fireEvent.click(screen.getByText('Update Assignee'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/assignments/1', {
        person_id: 3,
        assigned_date: '2023-01-01',
        due_date: '2023-01-31',
      });
    });

    expect(toast.success).toHaveBeenCalledWith('Assignee updated successfully');
    expect(mockOnAssigneeUpdated).toHaveBeenCalledWith({
      ...mockAssignment,
      person_id: 3,
      person_name: 'Person 3',
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('shows error toast when API call fails', async () => {
    axios.put.mockRejectedValue(new Error('API error'));

    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Assign To')).toBeInTheDocument();
    });

    // Submit the form
    fireEvent.click(screen.getByText('Update Assignee'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalled();
    });

    expect(toast.error).toHaveBeenCalledWith('Failed to update assignee');
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('shows error toast when people API call fails', async () => {
    axios.get.mockRejectedValue(new Error('API error'));

    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={true}
      />
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to load people');
    });
  });

  test('closes modal when cancel button is clicked', async () => {
    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
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
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={true}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('does not fetch people when modal is not open', () => {
    render(
      <EditAssigneeModal
        assignment={mockAssignment}
        onClose={mockOnClose}
        onAssigneeUpdated={mockOnAssigneeUpdated}
        isOpen={false}
      />
    );

    expect(axios.get).not.toHaveBeenCalled();
  });
});
