import React from 'react';
import { render, screen } from '@testing-library/react';
import FormLabel from '../FormLabel';

describe('FormLabel', () => {
  test('renders with default props', () => {
    render(<FormLabel htmlFor="test-input">Label Text</FormLabel>);
    
    const label = screen.getByText('Label Text');
    expect(label).toBeInTheDocument();
    expect(label).toHaveAttribute('for', 'test-input');
    expect(label).toHaveClass('block mb-2 text-sm font-medium');
  });

  test('renders required indicator when required is true', () => {
    render(<FormLabel htmlFor="test-input" required>Label Text</FormLabel>);
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-danger-600');
  });

  test('does not render required indicator when required is false', () => {
    render(<FormLabel htmlFor="test-input">Label Text</FormLabel>);
    
    const labelText = screen.getByText('Label Text');
    expect(labelText).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  test('applies additional className', () => {
    render(<FormLabel htmlFor="test-input" className="test-class">Label Text</FormLabel>);
    
    const label = screen.getByText('Label Text').closest('label');
    expect(label).toHaveClass('test-class');
  });

  test('passes additional props', () => {
    render(<FormLabel htmlFor="test-input" data-testid="form-label">Label Text</FormLabel>);
    
    const label = screen.getByTestId('form-label');
    expect(label).toBeInTheDocument();
  });
});