import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Checkbox from '../Checkbox';

describe('Checkbox', () => {
  const defaultProps = {
    id: 'test-checkbox',
    name: 'test-checkbox',
    checked: false,
    onChange: jest.fn(),
  };

  test('renders with default props', () => {
    render(<Checkbox {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveAttribute('id', 'test-checkbox');
    expect(checkbox).toHaveAttribute('name', 'test-checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('renders with label', () => {
    const label = 'Test Label';
    render(<Checkbox {...defaultProps} label={label} />);
    const labelElement = screen.getByText(label);
    expect(labelElement).toBeInTheDocument();
    expect(labelElement.tagName).toBe('LABEL');
    expect(labelElement).toHaveAttribute('for', 'test-checkbox');
  });

  test('renders checked state', () => {
    render(<Checkbox {...defaultProps} checked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    expect(checkbox).toHaveClass('bg-primary-600');
  });

  test('applies disabled state', () => {
    render(<Checkbox {...defaultProps} disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveClass('cursor-not-allowed');
  });

  test('applies required attribute', () => {
    render(<Checkbox {...defaultProps} required />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('required');
  });

  test('applies error state', () => {
    render(<Checkbox {...defaultProps} error />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('border-danger-600');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
  });

  test('calls onChange when checkbox changes', () => {
    render(<Checkbox {...defaultProps} />);
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('applies additional className to container', () => {
    render(<Checkbox {...defaultProps} className="test-container-class" />);
    const container = screen.getByRole('checkbox').parentElement;
    expect(container).toHaveClass('test-container-class');
  });

  test('applies additional className to input', () => {
    render(<Checkbox {...defaultProps} inputClassName="test-input-class" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveClass('test-input-class');
  });

  test('applies additional className to label', () => {
    render(<Checkbox {...defaultProps} label="Test" labelClassName="test-label-class" />);
    const label = screen.getByText('Test');
    expect(label).toHaveClass('test-label-class');
  });
});
