import React from 'react';
import { render, screen } from '@testing-library/react';
import ModalFooter from '../ModalFooter';

describe('ModalFooter', () => {
  test('renders children correctly', () => {
    render(
      <ModalFooter>
        <button>Cancel</button>
        <button>Confirm</button>
      </ModalFooter>
    );
    
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Confirm')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(
      <ModalFooter className="custom-footer-class">
        <button>Cancel</button>
        <button>Confirm</button>
      </ModalFooter>
    );
    
    // Get the parent div of the buttons
    const footerElement = screen.getByText('Cancel').closest('div');
    expect(footerElement).toHaveClass('custom-footer-class');
  });
});