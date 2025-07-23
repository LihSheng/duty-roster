import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModalHeader from '../ModalHeader';

describe('ModalHeader', () => {
  const mockOnClose = jest.fn();
  
  beforeEach(() => {
    mockOnClose.mockClear();
  });

  test('renders children correctly', () => {
    render(
      <ModalHeader onClose={mockOnClose}>
        Modal Title
      </ModalHeader>
    );
    
    expect(screen.getByText('Modal Title')).toBeInTheDocument();
  });

  test('renders close button when onClose is provided', () => {
    render(
      <ModalHeader onClose={mockOnClose}>
        Modal Title
      </ModalHeader>
    );
    
    expect(screen.getByTestId('modal-close-button')).toBeInTheDocument();
  });

  test('does not render close button when showCloseButton is false', () => {
    render(
      <ModalHeader onClose={mockOnClose} showCloseButton={false}>
        Modal Title
      </ModalHeader>
    );
    
    expect(screen.queryByTestId('modal-close-button')).not.toBeInTheDocument();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <ModalHeader onClose={mockOnClose}>
        Modal Title
      </ModalHeader>
    );
    
    fireEvent.click(screen.getByTestId('modal-close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('applies custom className', () => {
    render(
      <ModalHeader onClose={mockOnClose} className="custom-header-class">
        Modal Title
      </ModalHeader>
    );
    
    // Get the parent div of the header
    const headerElement = screen.getByText('Modal Title').closest('div').parentElement;
    expect(headerElement).toHaveClass('custom-header-class');
  });
});