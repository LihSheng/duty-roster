import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BaseModal from '../BaseModal';

// Mock createPortal to make it work with testing-library
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');

  return {
    ...original,
    createPortal: (node) => node,
  };
});

describe('BaseModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
    // Create a div where the portal would normally be rendered
    const portalRoot = document.createElement('div');
    portalRoot.setAttribute('id', 'portal-root');
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    const portalRoot = document.getElementById('portal-root');
    if (portalRoot) {
      document.body.removeChild(portalRoot);
    }
  });

  test('renders when isOpen is true', () => {
    render(
      <BaseModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
    expect(screen.getByTestId('modal-overlay')).toBeInTheDocument();
  });

  test('does not render when isOpen is false', () => {
    render(
      <BaseModal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    expect(screen.queryByTestId('modal-overlay')).not.toBeInTheDocument();
  });

  test('calls onClose when escape key is pressed', () => {
    render(
      <BaseModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when escape key is pressed if closeOnEsc is false', () => {
    render(
      <BaseModal isOpen={true} onClose={mockOnClose} closeOnEsc={false}>
        <div>Modal Content</div>
      </BaseModal>
    );

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('calls onClose when clicking outside the modal', () => {
    render(
      <BaseModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test('does not call onClose when clicking inside the modal', () => {
    render(
      <BaseModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </BaseModal>
    );

    fireEvent.click(screen.getByText('Modal Content'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('does not call onClose when clicking outside if closeOnOutsideClick is false', () => {
    render(
      <BaseModal isOpen={true} onClose={mockOnClose} closeOnOutsideClick={false}>
        <div>Modal Content</div>
      </BaseModal>
    );

    fireEvent.click(screen.getByTestId('modal-overlay'));
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  test('applies size classes correctly', () => {
    const { rerender } = render(
      <BaseModal isOpen={true} onClose={mockOnClose} size="small">
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.getByTestId('modal-container')).toHaveClass('max-w-md');

    rerender(
      <BaseModal isOpen={true} onClose={mockOnClose} size="medium">
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.getByTestId('modal-container')).toHaveClass('max-w-lg');

    rerender(
      <BaseModal isOpen={true} onClose={mockOnClose} size="large">
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.getByTestId('modal-container')).toHaveClass('max-w-2xl');
  });

  test('applies custom className and overlayClassName', () => {
    render(
      <BaseModal
        isOpen={true}
        onClose={mockOnClose}
        className="custom-modal-class"
        overlayClassName="custom-overlay-class"
      >
        <div>Modal Content</div>
      </BaseModal>
    );

    expect(screen.getByTestId('modal-container')).toHaveClass('custom-modal-class');
    expect(screen.getByTestId('modal-overlay')).toHaveClass('custom-overlay-class');
  });
});
