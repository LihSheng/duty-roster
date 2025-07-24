import React from 'react';
import { render, screen } from '@testing-library/react';
import ModalBody from '../ModalBody';

describe('ModalBody', () => {
  test('renders children correctly', () => {
    render(
      <ModalBody>
        <p>Modal Content</p>
      </ModalBody>
    );

    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  test('applies custom className', () => {
    render(
      <ModalBody className="custom-body-class">
        <p>Modal Content</p>
      </ModalBody>
    );

    // Get the parent div of the content
    const bodyElement = screen.getByText('Modal Content').closest('div');
    expect(bodyElement).toHaveClass('custom-body-class');
  });
});
