import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ConfirmationModal from '../ConfirmationModal';

// Mock createPortal to make it work with testing-library
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: (node) => node,
  };
});

describe('ConfirmationModal', () => {
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();
  const defaultProps = {
    title: 'Confirmation',
    message: 'Are you sure you want to proceed?',
    onConfirm: mockOnConfirm,
    onCancel: mockOnCancel,
    isOpen: true
  };
  
  beforeEach(() => {
    mockOnConfirm.mockClear();
    mockOnCancel.mockClear();
  });

  test('renders with default props', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  test('renders with custom button text', () => {
    render(
      <ConfirmationModal 
        {...defaultProps} 
        confirmText="Yes, do it" 
        cancelText="No, go back" 
      />
    );
    
    expect(screen.getByText('Yes, do it')).toBeInTheDocument();
    expect(screen.getByText('No, go back')).toBeInTheDocument();
  });

  test('calls onConfirm when confirm button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when cancel button is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when close button in header is clicked', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when clicking outside the modal', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('calls onCancel when escape key is pressed', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test('renders with danger variant for confirm button', () => {
    render(<ConfirmationModal {...defaultProps} confirmVariant="danger" />);
    
    const confirmButton = screen.getByText('Confirm');
    expect(confirmButton).toHaveClass('bg-danger-600');
  });

  test('does not render when isOpen is false', () => {
    render(<ConfirmationModal {...defaultProps} isOpen={false} />);
    
    expect(screen.queryByText('Confirmation')).not.toBeInTheDocument();
    expect(screen.queryByText('Are you sure you want to proceed?')).not.toBeInTheDocument();
  });

  test('uses BaseModal component', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    // Verify that the modal container is present (from BaseModal)
    expect(screen.getByTestId('modal-container')).toBeInTheDocument();
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
  });

  test('supports different modal sizes', () => {
    render(<ConfirmationModal {...defaultProps} size="large" />);
    
    const modalContainer = screen.getByTestId('modal-container');
    expect(modalContainer).toHaveClass('max-w-2xl');
  });

  test('uses Button components for actions', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    const confirmButton = screen.getByText('Confirm');
    const cancelButton = screen.getByText('Cancel');
    
    // Verify buttons have the expected classes from Button component
    expect(confirmButton).toHaveClass('bg-primary-600');
    expect(cancelButton).toHaveClass('bg-light-200');
  });

  test('maintains all existing functionality after refactoring', () => {
    render(<ConfirmationModal {...defaultProps} />);
    
    // Test all the core functionality still works
    expect(screen.getByText('Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure you want to proceed?')).toBeInTheDocument();
    
    // Test button clicks
    fireEvent.click(screen.getByText('Confirm'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });
});