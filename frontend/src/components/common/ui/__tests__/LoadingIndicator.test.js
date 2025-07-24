import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingIndicator from '../LoadingIndicator';

describe('LoadingIndicator', () => {
  test('renders with default props', () => {
    render(<LoadingIndicator />);
    const indicator = document.querySelector('.animate-spin');
    expect(indicator).toBeInTheDocument();
    expect(indicator).toHaveClass('w-6 h-6'); // medium size
  });

  test('renders with small size', () => {
    render(<LoadingIndicator size="small" />);
    const indicator = document.querySelector('.animate-spin');
    expect(indicator).toHaveClass('w-4 h-4');
  });

  test('renders with large size', () => {
    render(<LoadingIndicator size="large" />);
    const indicator = document.querySelector('.animate-spin');
    expect(indicator).toHaveClass('w-8 h-8');
  });

  test('renders with text', () => {
    const loadingText = 'Loading...';
    render(<LoadingIndicator text={loadingText} />);
    expect(screen.getByText(loadingText)).toBeInTheDocument();
  });

  test('renders centered when centered prop is true', () => {
    render(<LoadingIndicator centered />);
    const container = document.querySelector('.inline-flex');
    expect(container).toHaveClass('justify-center');
  });

  test('applies additional className', () => {
    render(<LoadingIndicator className="test-class" />);
    const container = document.querySelector('.inline-flex');
    expect(container).toHaveClass('test-class');
  });
});
