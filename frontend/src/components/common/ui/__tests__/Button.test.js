import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  test('renders with default props', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByText('Click me');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary-600'); // primary variant
    expect(button).toHaveClass('px-4 py-2'); // medium size
  });

  test('renders with different variants', () => {
    const { rerender } = render(<Button variant="secondary">Secondary</Button>);
    let button = screen.getByText('Secondary');
    expect(button).toHaveClass('bg-light-200');

    rerender(<Button variant="danger">Danger</Button>);
    button = screen.getByText('Danger');
    expect(button).toHaveClass('bg-danger-600');

    rerender(<Button variant="success">Success</Button>);
    button = screen.getByText('Success');
    expect(button).toHaveClass('bg-secondary-600');
  });

  test('renders with different sizes', () => {
    const { rerender } = render(<Button size="small">Small</Button>);
    let button = screen.getByText('Small');
    expect(button).toHaveClass('px-2 py-1 text-xs');

    rerender(<Button size="medium">Medium</Button>);
    button = screen.getByText('Medium');
    expect(button).toHaveClass('px-4 py-2 text-sm');

    rerender(<Button size="large">Large</Button>);
    button = screen.getByText('Large');
    expect(button).toHaveClass('px-6 py-3 text-base');
  });

  test('applies disabled state', () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByText('Disabled');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');
  });

  test('renders loading state', () => {
    render(<Button isLoading>Loading</Button>);
    const button = screen.getByText('Loading');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('opacity-50 cursor-not-allowed');

    const loadingIndicator = document.querySelector('.animate-spin');
    expect(loadingIndicator).toBeInTheDocument();
  });

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when disabled', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('does not call onClick when loading', () => {
    const handleClick = jest.fn();
    render(
      <Button onClick={handleClick} isLoading>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByText('Click me'));
    expect(handleClick).not.toHaveBeenCalled();
  });

  test('applies additional className', () => {
    render(<Button className="test-class">Custom Class</Button>);
    const button = screen.getByText('Custom Class');
    expect(button).toHaveClass('test-class');
  });

  test('applies correct button type', () => {
    const { rerender } = render(<Button type="button">Button</Button>);
    let button = screen.getByText('Button');
    expect(button).toHaveAttribute('type', 'button');

    rerender(<Button type="submit">Submit</Button>);
    button = screen.getByText('Submit');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(<Button type="reset">Reset</Button>);
    button = screen.getByText('Reset');
    expect(button).toHaveAttribute('type', 'reset');
  });
});
