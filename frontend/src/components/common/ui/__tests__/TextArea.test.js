import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TextArea from '../TextArea';

describe('TextArea', () => {
  const defaultProps = {
    id: 'test-textarea',
    name: 'test-textarea',
    value: '',
    onChange: jest.fn(),
  };

  test('renders with default props', () => {
    render(<TextArea {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveAttribute('id', 'test-textarea');
    expect(textarea).toHaveAttribute('name', 'test-textarea');
    expect(textarea).toHaveAttribute('rows', '3'); // Default rows
  });

  test('renders with custom rows', () => {
    render(<TextArea {...defaultProps} rows={5} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  test('renders with placeholder', () => {
    const placeholder = 'Enter text';
    render(<TextArea {...defaultProps} placeholder={placeholder} />);
    const textarea = screen.getByPlaceholderText(placeholder);
    expect(textarea).toBeInTheDocument();
  });

  test('applies disabled state', () => {
    render(<TextArea {...defaultProps} disabled />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass('cursor-not-allowed');
  });

  test('applies required attribute', () => {
    render(<TextArea {...defaultProps} required />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('required');
  });

  test('applies error state', () => {
    render(<TextArea {...defaultProps} error />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-danger-600');
    expect(textarea).toHaveAttribute('aria-invalid', 'true');
  });

  test('calls onChange when textarea changes', () => {
    render(<TextArea {...defaultProps} />);
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'test value' } });
    expect(defaultProps.onChange).toHaveBeenCalledTimes(1);
  });

  test('applies additional className', () => {
    render(<TextArea {...defaultProps} className="test-class" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('test-class');
  });

  test('renders with initial value', () => {
    const value = 'Initial text';
    render(<TextArea {...defaultProps} value={value} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveValue(value);
  });
});
