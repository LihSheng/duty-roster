import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';

// Import all components to test
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import TextArea from '../ui/TextArea';
import LoadingIndicator from '../ui/LoadingIndicator';
import FormGroup from '../ui/FormGroup';
import FormLabel from '../ui/FormLabel';
import FormError from '../ui/FormError';
import BaseModal from '../modal/BaseModal';
import ModalHeader from '../modal/ModalHeader';
import ModalBody from '../modal/ModalBody';
import ModalFooter from '../modal/ModalFooter';

// Extend Jest matchers
expect.extend(toHaveNoViolations);

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <Button onClick={() => {}}>Test Button</Button>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();
      
      render(<Button onClick={handleClick}>Test Button</Button>);
      const button = screen.getByRole('button');
      
      await user.tab();
      expect(button).toHaveFocus();
      
      await user.keyboard('{Enter}');
      expect(handleClick).toHaveBeenCalledTimes(1);
      
      await user.keyboard(' ');
      expect(handleClick).toHaveBeenCalledTimes(2);
    });

    test('should have proper ARIA attributes when loading', () => {
      render(<Button isLoading onClick={() => {}}>Loading Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('Loading...')).toHaveClass('sr-only');
    });

    test('should have proper ARIA attributes when disabled', () => {
      render(<Button disabled onClick={() => {}}>Disabled Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).toBeDisabled();
    });
  });

  describe('TextInput Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-input">Test Input</label>
          <TextInput
            id="test-input"
            name="test"
            value=""
            onChange={() => {}}
          />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          value=""
          onChange={() => {}}
          required
          error="Test error"
          aria-label="Test input"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('aria-required', 'true');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-label', 'Test input');
    });
  });

  describe('Select Component', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];

    test('should not have accessibility violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-select">Test Select</label>
          <Select
            id="test-select"
            name="test"
            value=""
            onChange={() => {}}
            options={options}
          />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(
        <Select
          id="test-select"
          name="test"
          value=""
          onChange={handleChange}
          options={options}
        />
      );
      
      const select = screen.getByRole('combobox');
      await user.tab();
      expect(select).toHaveFocus();
      
      // Test arrow key navigation
      await user.keyboard('{ArrowDown}');
      // Note: Actual option selection behavior depends on browser implementation
    });
  });

  describe('Checkbox Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <Checkbox
          id="test-checkbox"
          name="test"
          checked={false}
          onChange={() => {}}
          label="Test checkbox"
        />
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      const handleChange = jest.fn();
      
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          checked={false}
          onChange={handleChange}
          label="Test checkbox"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      await user.tab();
      expect(checkbox).toHaveFocus();
      
      await user.keyboard(' ');
      expect(handleChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({ checked: true })
        })
      );
    });

    test('should have proper label association', () => {
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          checked={false}
          onChange={() => {}}
          label="Test checkbox"
        />
      );
      
      const checkbox = screen.getByRole('checkbox');
      const label = screen.getByText('Test checkbox');
      
      expect(checkbox).toHaveAttribute('id', 'test-checkbox');
      expect(label).toHaveAttribute('for', 'test-checkbox');
    });
  });

  describe('TextArea Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <div>
          <label htmlFor="test-textarea">Test TextArea</label>
          <TextArea
            id="test-textarea"
            name="test"
            value=""
            onChange={() => {}}
          />
        </div>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      render(
        <TextArea
          id="test-textarea"
          name="test"
          value=""
          onChange={() => {}}
          required
          error="Test error"
        />
      );
      
      const textarea = screen.getByRole('textbox');
      expect(textarea).toHaveAttribute('aria-required', 'true');
      expect(textarea).toHaveAttribute('aria-invalid', 'true');
    });
  });

  describe('LoadingIndicator Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(<LoadingIndicator />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      render(<LoadingIndicator text="Loading data" />);
      
      const indicator = screen.getByRole('status');
      expect(indicator).toHaveAttribute('aria-live', 'polite');
      expect(indicator).toHaveAttribute('aria-label', 'Loading');
      expect(screen.getAllByText('Loading data')).toHaveLength(2); // One visible, one screen reader only
    });

    test('should have screen reader text', () => {
      render(<LoadingIndicator />);
      expect(screen.getByText('Loading')).toHaveClass('sr-only');
    });
  });

  describe('FormError Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(<FormError error="Test error" />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      render(<FormError error="Test error" id="error-1" />);
      
      const error = screen.getByRole('alert');
      expect(error).toHaveAttribute('aria-live', 'polite');
      expect(error).toHaveAttribute('id', 'error-1');
    });

    test('should not render when no error', () => {
      const { container } = render(<FormError error={false} />);
      expect(container.firstChild).toBeNull();
    });
  });

  describe('FormLabel Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <FormLabel htmlFor="test-input">Test Label</FormLabel>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper label association', () => {
      render(<FormLabel htmlFor="test-input">Test Label</FormLabel>);
      
      const label = screen.getByText('Test Label').closest('label');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    test('should indicate required fields', () => {
      render(
        <FormLabel htmlFor="test-input" required>
          Test Label
        </FormLabel>
      );
      
      const requiredIndicator = screen.getByTitle('This field is required');
      expect(requiredIndicator).toHaveAttribute('aria-label', 'required');
    });
  });

  describe('BaseModal Component', () => {
    test('should not have accessibility violations', async () => {
      const { container } = render(
        <BaseModal isOpen onClose={() => {}}>
          <div>Modal content</div>
        </BaseModal>
      );
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('should have proper ARIA attributes', () => {
      render(
        <BaseModal 
          isOpen 
          onClose={() => {}} 
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <div>Modal content</div>
        </BaseModal>
      );
      
      const overlay = screen.getByRole('dialog');
      const modal = screen.getByTestId('modal-container');
      expect(overlay).toHaveAttribute('aria-modal', 'true');
      expect(modal).toHaveAttribute('aria-labelledby', 'modal-title');
      expect(modal).toHaveAttribute('aria-describedby', 'modal-description');
    });

    test('should trap focus within modal', async () => {
      const user = userEvent.setup();
      
      render(
        <BaseModal isOpen onClose={() => {}}>
          <button>First button</button>
          <button>Second button</button>
        </BaseModal>
      );
      
      const firstButton = screen.getByText('First button');
      const secondButton = screen.getByText('Second button');
      
      // Focus should be trapped within the modal
      await user.tab();
      expect(firstButton).toHaveFocus();
      
      await user.tab();
      expect(secondButton).toHaveFocus();
      
      // Tab from last element should go to first
      await user.tab();
      expect(firstButton).toHaveFocus();
    });

    test('should close on Escape key', async () => {
      const user = userEvent.setup();
      const handleClose = jest.fn();
      
      render(
        <BaseModal isOpen onClose={handleClose}>
          <div>Modal content</div>
        </BaseModal>
      );
      
      await user.keyboard('{Escape}');
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Form Integration', () => {
    test('should have proper form field associations', async () => {
      const { container } = render(
        <FormGroup>
          <FormLabel htmlFor="test-field" required>
            Test Field
          </FormLabel>
          <TextInput
            id="test-field"
            name="test"
            value=""
            onChange={() => {}}
            error="Test error"
          />
          <FormError error="Test error" id="test-field-error" />
        </FormGroup>
      );
      
      const results = await axe(container);
      expect(results).toHaveNoViolations();
      
      const input = screen.getByRole('textbox');
      const label = screen.getByText('Test Field').closest('label');
      const error = screen.getByRole('alert');
      
      expect(input).toHaveAttribute('id', 'test-field');
      expect(label).toHaveAttribute('for', 'test-field');
      expect(input).toHaveAttribute('aria-describedby', 'test-field-error');
      expect(error).toHaveAttribute('id', 'test-field-error');
    });
  });

  describe('Responsive Design', () => {
    test('should have responsive classes', () => {
      render(
        <div>
          <Button size="small">Small Button</Button>
          <TextInput
            id="responsive-input"
            name="test"
            value=""
            onChange={() => {}}
          />
          <LoadingIndicator size="large" />
        </div>
      );
      
      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox');
      const loadingContainer = screen.getByRole('status');
      
      // Check for responsive classes (sm: prefix indicates responsive design)
      expect(button.className).toMatch(/sm:/);
      expect(input.className).toMatch(/sm:/);
      expect(loadingContainer.className).toMatch(/sm:/);
    });
  });
});