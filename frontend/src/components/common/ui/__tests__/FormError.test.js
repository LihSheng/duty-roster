import React from 'react';
import { render, screen } from '@testing-library/react';
import FormError from '../FormError';

describe('FormError', () => {
  test('renders nothing when error is falsy', () => {
    const { container } = render(<FormError error={false} />);
    expect(container).toBeEmptyDOMElement();
    
    const { container: container2 } = render(<FormError error={null} />);
    expect(container2).toBeEmptyDOMElement();
    
    const { container: container3 } = render(<FormError error={undefined} />);
    expect(container3).toBeEmptyDOMElement();
  });

  test('renders default error message when error is true', () => {
    render(<FormError error={true} />);
    
    const errorMessage = screen.getByText('This field has an error');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage.parentElement).toHaveAttribute('role', 'alert');
  });

  test('renders custom error message when error is a string', () => {
    const errorMessage = 'This field is required';
    render(<FormError error={errorMessage} />);
    
    const errorElement = screen.getByText(errorMessage);
    expect(errorElement).toBeInTheDocument();
  });

  test('applies default classes', () => {
    render(<FormError error={true} />);
    
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveClass('mt-1 text-sm text-danger-600');
  });

  test('applies additional className', () => {
    render(<FormError error={true} className="test-class" />);
    
    const errorContainer = screen.getByRole('alert');
    expect(errorContainer).toHaveClass('test-class');
  });

  test('passes additional props', () => {
    render(<FormError error={true} data-testid="form-error" />);
    
    const errorContainer = screen.getByTestId('form-error');
    expect(errorContainer).toBeInTheDocument();
  });
});