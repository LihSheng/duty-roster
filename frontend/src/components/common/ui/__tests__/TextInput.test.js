import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextInput from '../TextInput';

describe('TextInput', () => {
  const defaultProps = {
    id: 'test-input',
    name: 'test-input',
    value: '',
    onChange: jest.fn(),
  };

  test('renders with default props', () => {
    render(<TextInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('id', 'test-input');
    expect(input).toHaveAttribute('name', 'test-input');
  });

  test('renders with different input types', () => {
    const { rerender } = render(<TextInput {...defaultProps} type="email" />);
    let input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');

    rerender(<TextInput {...defaultProps} type="password" />);
    input = screen.getByLabelText('');
    expect(input).toHaveAttribute('type', 'password');
  });

  test('renders with placeholder', () => {
    const placeholder = 'Enter text';
    render(<TextInput {...defaultProps} placeholder={placeholder} />);
    const input = screen.getByPlaceholderText(placeholder);
    expect(input).toBeInTheDocument();
  });

  test('applies disabled state', () => {
    render(<TextInput {...defaultProps} disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('cursor-not-allowed');
  });

  test('applies required attribute', () => {
    render(<TextInput {...defaultProps} required />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('required');
  });

  test('applies error state', () => {
    render(<TextInput {...defaultProps} error />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-danger-600');
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  test('calls onChange when input changes', () => {
    render(<TextInput {...defaultProps} />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test value' } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('applies additional className', () => {
    render(<TextInput {...defaultProps} className="test-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('test-class');
  });
});
