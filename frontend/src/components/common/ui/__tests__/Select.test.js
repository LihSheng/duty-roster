import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Select from '../Select';

describe('Select', () => {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const defaultProps = {
    id: 'test-select',
    name: 'test-select',
    value: '',
    onChange: jest.fn(),
    options,
  };

  test('renders with default props', () => {
    render(<Select {...defaultProps} />);
    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();
    expect(select).toHaveAttribute('id', 'test-select');
    expect(select).toHaveAttribute('name', 'test-select');
    
    const optionElements = screen.getAllByRole('option');
    expect(optionElements).toHaveLength(3);
    expect(optionElements[0]).toHaveTextContent('Option 1');
    expect(optionElements[1]).toHaveTextContent('Option 2');
    expect(optionElements[2]).toHaveTextContent('Option 3');
  });

  test('renders with placeholder', () => {
    const placeholder = 'Select an option';
    render(<Select {...defaultProps} placeholder={placeholder} />);
    const placeholderOption = screen.getByText(placeholder);
    expect(placeholderOption).toBeInTheDocument();
    expect(placeholderOption).toHaveAttribute('disabled');
  });

  test('applies disabled state', () => {
    render(<Select {...defaultProps} disabled />);
    const select = screen.getByRole('combobox');
    expect(select).toBeDisabled();
    expect(select).toHaveClass('cursor-not-allowed');
  });

  test('applies required attribute', () => {
    render(<Select {...defaultProps} required />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('required');
  });

  test('applies error state', () => {
    render(<Select {...defaultProps} error />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('border-danger-600');
    expect(select).toHaveAttribute('aria-invalid', 'true');
  });

  test('calls onChange when selection changes', () => {
    render(<Select {...defaultProps} />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'option2' } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('applies additional className', () => {
    render(<Select {...defaultProps} className="test-class" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('test-class');
  });

  test('selects the correct option based on value', () => {
    render(<Select {...defaultProps} value="option2" />);
    const select = screen.getByRole('combobox');
    expect(select).toHaveValue('option2');
  });
});