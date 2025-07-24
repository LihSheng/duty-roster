import React from 'react';
import { render, screen } from '@testing-library/react';
import FormGroup from '../FormGroup';

describe('FormGroup', () => {
  test('renders children', () => {
    render(
      <FormGroup>
        <div data-testid="test-child">Test Child</div>
      </FormGroup>
    );

    const child = screen.getByTestId('test-child');
    expect(child).toBeInTheDocument();
    expect(child).toHaveTextContent('Test Child');
  });

  test('applies default classes', () => {
    render(
      <FormGroup>
        <div>Test Child</div>
      </FormGroup>
    );

    const formGroup = screen.getByText('Test Child').parentElement;
    expect(formGroup).toHaveClass('mb-4');
  });

  test('applies additional className', () => {
    render(
      <FormGroup className="test-class">
        <div>Test Child</div>
      </FormGroup>
    );

    const formGroup = screen.getByText('Test Child').parentElement;
    expect(formGroup).toHaveClass('test-class');
  });

  test('passes additional props', () => {
    render(
      <FormGroup data-testid="form-group">
        <div>Test Child</div>
      </FormGroup>
    );

    const formGroup = screen.getByTestId('form-group');
    expect(formGroup).toBeInTheDocument();
  });
});
