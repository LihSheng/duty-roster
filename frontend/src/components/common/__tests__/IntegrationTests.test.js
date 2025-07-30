import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import components for integration testing
import ConfirmationModal from '../ConfirmationModal';
import AddDutyModal from '../../duties/AddDutyModal';
import EditAssigneeModal from '../../assignments/EditAssigneeModal';
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import TextArea from '../ui/TextArea';
import LoadingIndicator from '../ui/LoadingIndicator';
import BaseModal from '../modal/BaseModal';
import ModalHeader from '../modal/ModalHeader';
import ModalBody from '../modal/ModalBody';
import ModalFooter from '../modal/ModalFooter';
import FormGroup from '../ui/FormGroup';
import FormLabel from '../ui/FormLabel';
import FormError from '../ui/FormError';

// Mock axios for API calls
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
}));

// Mock react-toastify
jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

// Mock createPortal for modal testing
jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: (node) => node,
  };
});

describe('Integration Tests - Final Testing and Integration', () => {
  describe('Visual Consistency Tests', () => {
    test('all components should use consistent color scheme', () => {
      render(
        <div>
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="success">Success Button</Button>
          <TextInput id="test-input" name="test" value="" onChange={() => {}} />
          <Select id="test-select" name="test" value="" onChange={() => {}} options={[]} />
          <Checkbox id="test-checkbox" name="test" checked={false} onChange={() => {}} />
          <TextArea id="test-textarea" name="test" value="" onChange={() => {}} />
          <LoadingIndicator />
        </div>
      );

      const primaryButton = screen.getByText('Primary Button');
      const secondaryButton = screen.getByText('Secondary Button');
      const dangerButton = screen.getByText('Danger Button');
      const successButton = screen.getByText('Success Button');
      const input = screen.getByRole('textbox', { name: /test-input/i });
      const select = screen.getByRole('combobox');
      const checkbox = screen.getByRole('checkbox');
      const textarea = screen.getByRole('textbox', { name: /test-textarea/i });
      const loadingIndicator = screen.getByRole('status');

      // Check for consistent primary color usage
      expect(primaryButton.className).toMatch(/bg-primary-600/);
      expect(input.className).toMatch(/focus:ring-primary-500/);
      expect(select.className).toMatch(/focus:ring-primary-500/);
      expect(checkbox.className).toMatch(/text-primary-600/);
      expect(textarea.className).toMatch(/focus:ring-primary-500/);

      // Check for consistent secondary color usage
      expect(secondaryButton.className).toMatch(/bg-light-200/);

      // Check for consistent danger color usage
      expect(dangerButton.className).toMatch(/bg-danger-600/);

      // Check for consistent success color usage
      expect(successButton.className).toMatch(/bg-success-600/);
    });

    test('all components should have consistent typography', () => {
      render(
        <div>
          <Button size="small">Small Button</Button>
          <Button size="medium">Medium Button</Button>
          <Button size="large">Large Button</Button>
          <TextInput id="input" name="input" value="" onChange={() => {}} />
          <Select id="select" name="select" value="" onChange={() => {}} options={[]} />
          <LoadingIndicator size="small" text="Small Loading" />
          <LoadingIndicator size="medium" text="Medium Loading" />
          <LoadingIndicator size="large" text="Large Loading" />
        </div>
      );

      const smallButton = screen.getByText('Small Button');
      const mediumButton = screen.getByText('Medium Button');
      const largeButton = screen.getByText('Large Button');
      const input = screen.getByRole('textbox');
      const select = screen.getByRole('combobox');
      const smallLoadingText = screen.getByText('Small Loading');
      const mediumLoadingText = screen.getByText('Medium Loading');
      const largeLoadingText = screen.getByText('Large Loading');

      // Check for consistent text sizing
      expect(smallButton.className).toMatch(/text-xs.*sm:text-sm/);
      expect(mediumButton.className).toMatch(/text-sm.*sm:text-base/);
      expect(largeButton.className).toMatch(/text-base.*sm:text-lg/);
      expect(input.className).toMatch(/text-sm.*sm:text-base/);
      expect(select.className).toMatch(/text-sm.*sm:text-base/);
      expect(smallLoadingText.className).toMatch(/text-xs.*sm:text-sm/);
      expect(mediumLoadingText.className).toMatch(/text-sm.*sm:text-base/);
      expect(largeLoadingText.className).toMatch(/text-base.*sm:text-lg/);
    });

    test('all components should have consistent spacing', () => {
      render(
        <div>
          <FormGroup>
            <FormLabel htmlFor="test-field">Test Field</FormLabel>
            <TextInput id="test-field" name="test" value="" onChange={() => {}} />
            <FormError error="Test error" />
          </FormGroup>
          <Button size="small">Small</Button>
          <Button size="medium">Medium</Button>
          <Button size="large">Large</Button>
        </div>
      );

      const formGroup = screen.getByText('Test Field').closest('.mb-4, .sm\\:mb-6');
      const smallButton = screen.getByText('Small');
      const mediumButton = screen.getByText('Medium');
      const largeButton = screen.getByText('Large');

      // Check for consistent spacing patterns
      expect(smallButton.className).toMatch(/px-2.*py-1.*sm:px-3.*sm:py-1\.5/);
      expect(mediumButton.className).toMatch(/px-3.*py-2.*sm:px-4.*sm:py-2/);
      expect(largeButton.className).toMatch(/px-4.*py-2\.5.*sm:px-6.*sm:py-3/);
    });

    test('all components should support dark mode', () => {
      render(
        <div>
          <Button variant="primary">Button</Button>
          <TextInput id="input" name="input" value="" onChange={() => {}} />
          <Select id="select" name="select" value="" onChange={() => {}} options={[]} />
          <Checkbox id="checkbox" name="checkbox" checked={false} onChange={() => {}} />
          <TextArea id="textarea" name="textarea" value="" onChange={() => {}} />
          <FormError error="Test error" />
        </div>
      );

      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox', { name: /input/i });
      const select = screen.getByRole('combobox');
      const checkbox = screen.getByRole('checkbox');
      const textarea = screen.getByRole('textbox', { name: /textarea/i });
      const error = screen.getByRole('alert');

      // Check for dark mode classes
      expect(button.className).toMatch(/dark:/);
      expect(input.className).toMatch(/dark:/);
      expect(select.className).toMatch(/dark:/);
      expect(checkbox.className).toMatch(/dark:/);
      expect(textarea.className).toMatch(/dark:/);
      expect(error.className).toMatch(/dark:/);
    });
  });

  describe('Component Integration Tests', () => {
    test('BaseModal should work with all modal section components', () => {
      const onClose = jest.fn();
      
      render(
        <BaseModal isOpen onClose={onClose}>
          <ModalHeader onClose={onClose}>Test Modal</ModalHeader>
          <ModalBody>
            <p>Modal content goes here</p>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>Cancel</Button>
            <Button variant="primary" onClick={() => {}}>Save</Button>
          </ModalFooter>
        </BaseModal>
      );

      expect(screen.getByText('Test Modal')).toBeInTheDocument();
      expect(screen.getByText('Modal content goes here')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();

      // Test modal functionality
      fireEvent.click(screen.getByLabelText('Close modal'));
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('Form components should work together seamlessly', () => {
      const onChange = jest.fn();
      const onSubmit = jest.fn();

      render(
        <form onSubmit={onSubmit}>
          <FormGroup>
            <FormLabel htmlFor="name" required>Name</FormLabel>
            <TextInput
              id="name"
              name="name"
              value=""
              onChange={onChange}
              required
            />
            <FormError error="Name is required" />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextInput
              id="email"
              name="email"
              type="email"
              value=""
              onChange={onChange}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="role">Role</FormLabel>
            <Select
              id="role"
              name="role"
              value=""
              onChange={onChange}
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'user', label: 'User' }
              ]}
            />
          </FormGroup>
          
          <FormGroup>
            <Checkbox
              id="active"
              name="active"
              checked={false}
              onChange={onChange}
              label="Active user"
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel htmlFor="notes">Notes</FormLabel>
            <TextArea
              id="notes"
              name="notes"
              value=""
              onChange={onChange}
              rows={3}
            />
          </FormGroup>
          
          <Button type="submit" variant="primary">Submit</Button>
        </form>
      );

      // Verify all form elements are present and properly labeled
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Role')).toBeInTheDocument();
      expect(screen.getByLabelText('Active user')).toBeInTheDocument();
      expect(screen.getByLabelText('Notes')).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText('Submit')).toBeInTheDocument();

      // Test form interactions
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'John Doe' } });
      expect(onChange).toHaveBeenCalled();
    });

    test('Button should work with LoadingIndicator', () => {
      const onClick = jest.fn();
      
      const { rerender } = render(
        <Button onClick={onClick} isLoading={false}>
          Save Changes
        </Button>
      );

      const button = screen.getByRole('button');
      expect(screen.getByText('Save Changes')).toBeInTheDocument();
      expect(button).not.toHaveAttribute('aria-busy');

      // Test loading state
      rerender(
        <Button onClick={onClick} isLoading={true}>
          Save Changes
        </Button>
      );

      expect(button).toHaveAttribute('aria-busy', 'true');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(screen.getByText('Loading...')).toHaveClass('sr-only');
    });
  });

  describe('Refactored Modal Components Integration', () => {
    test('ConfirmationModal should use BaseModal and Button components', () => {
      const onConfirm = jest.fn();
      const onCancel = jest.fn();

      render(
        <ConfirmationModal
          isOpen={true}
          title="Delete Item"
          message="Are you sure you want to delete this item?"
          onConfirm={onConfirm}
          onCancel={onCancel}
          confirmText="Delete"
          cancelText="Cancel"
          confirmVariant="danger"
        />
      );

      // Verify modal structure
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Delete Item')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to delete this item?')).toBeInTheDocument();
      
      // Verify buttons use the Button component styling
      const deleteButton = screen.getByText('Delete');
      const cancelButton = screen.getByText('Cancel');
      
      expect(deleteButton.className).toMatch(/bg-danger-600/);
      expect(cancelButton.className).toMatch(/bg-light-200/);

      // Test functionality
      fireEvent.click(deleteButton);
      expect(onConfirm).toHaveBeenCalledTimes(1);

      fireEvent.click(cancelButton);
      expect(onCancel).toHaveBeenCalledTimes(1);
    });

    test('EditAssigneeModal should use BaseModal and form components', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({
        data: [
          { id: 1, name: 'John Doe' },
          { id: 2, name: 'Jane Smith' }
        ]
      });

      const onClose = jest.fn();
      const onAssigneeUpdated = jest.fn();
      const assignment = {
        id: 1,
        duty_name: 'Clean Kitchen',
        person_id: 1,
        assigned_date: '2024-01-15',
        due_date: '2024-01-15'
      };

      render(
        <EditAssigneeModal
          isOpen={true}
          assignment={assignment}
          onClose={onClose}
          onAssigneeUpdated={onAssigneeUpdated}
        />
      );

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByDisplayValue('Clean Kitchen')).toBeInTheDocument();
      });

      // Verify modal structure uses BaseModal
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Edit Assignee')).toBeInTheDocument();

      // Verify form components are used
      expect(screen.getByDisplayValue('Clean Kitchen')).toBeDisabled();
      expect(screen.getByDisplayValue('2024-01-15')).toBeDisabled();
      expect(screen.getByRole('combobox')).toBeInTheDocument();

      // Verify buttons use Button component
      const updateButton = screen.getByText('Update Assignee');
      const cancelButton = screen.getByText('Cancel');
      
      expect(updateButton.className).toMatch(/bg-primary-600/);
      expect(cancelButton.className).toMatch(/bg-light-200/);
    });

    test('AddDutyModal should use BaseModal and form components', async () => {
      const axios = require('axios');
      axios.get.mockResolvedValue({
        data: [
          { id: 1, name: 'Clean Kitchen', is_group_duty: 0 },
          { id: 2, name: 'Take out trash', is_group_duty: 1 }
        ]
      });

      const onClose = jest.fn();
      const onDutyAdded = jest.fn();

      render(
        <AddDutyModal
          isOpen={true}
          date="2024-01-15"
          onClose={onClose}
          onDutyAdded={onDutyAdded}
        />
      );

      // Wait for data to load
      await waitFor(() => {
        expect(screen.getByText('Use Existing Duty')).toBeInTheDocument();
      });

      // Verify modal structure uses BaseModal
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add Duty for 2024-01-15')).toBeInTheDocument();

      // Verify mode switching buttons use Button component
      const existingDutyButton = screen.getByText('Use Existing Duty');
      const newDutyButton = screen.getByText('Create New Duty');
      
      expect(existingDutyButton.className).toMatch(/bg-primary-600/);
      expect(newDutyButton.className).toMatch(/bg-light-200/);

      // Test switching to new duty mode
      fireEvent.click(newDutyButton);
      
      // Verify form components are present
      expect(screen.getByLabelText('Duty Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByRole('checkbox')).toBeInTheDocument();

      // Verify action buttons use Button component
      const createButton = screen.getByText('Create & Assign');
      const cancelButton = screen.getByText('Cancel');
      
      expect(createButton.className).toMatch(/bg-primary-600/);
      expect(cancelButton.className).toMatch(/bg-light-200/);
    });
  });

  describe('Responsive Design Integration', () => {
    test('modal components should be responsive', () => {
      render(
        <BaseModal isOpen onClose={() => {}} size="large">
          <ModalHeader onClose={() => {}}>Large Modal</ModalHeader>
          <ModalBody>
            <FormGroup>
              <FormLabel htmlFor="responsive-input">Responsive Input</FormLabel>
              <TextInput
                id="responsive-input"
                name="responsive"
                value=""
                onChange={() => {}}
              />
            </FormGroup>
            <Button size="large">Large Button</Button>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary">Cancel</Button>
            <Button variant="primary">Save</Button>
          </ModalFooter>
        </BaseModal>
      );

      const modal = screen.getByRole('dialog');
      const input = screen.getByRole('textbox');
      const largeButton = screen.getByText('Large Button');

      // Check for responsive classes
      expect(modal.className).toMatch(/max-w-lg.*sm:max-w-2xl.*lg:max-w-4xl/);
      expect(input.className).toMatch(/text-sm.*sm:text-base/);
      expect(largeButton.className).toMatch(/px-4.*py-2\.5.*text-base.*sm:px-6.*sm:py-3.*sm:text-lg/);
    });

    test('form layouts should be responsive', () => {
      render(
        <div>
          <FormGroup>
            <FormLabel htmlFor="field1">Field 1</FormLabel>
            <TextInput id="field1" name="field1" value="" onChange={() => {}} />
          </FormGroup>
          <FormGroup>
            <FormLabel htmlFor="field2">Field 2</FormLabel>
            <Select
              id="field2"
              name="field2"
              value=""
              onChange={() => {}}
              options={[{ value: '1', label: 'Option 1' }]}
            />
          </FormGroup>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button variant="secondary" className="flex-1">Cancel</Button>
            <Button variant="primary" className="flex-1">Submit</Button>
          </div>
        </div>
      );

      const input = screen.getByRole('textbox');
      const select = screen.getByRole('combobox');
      const buttons = screen.getAllByRole('button');

      // Check for responsive text sizing
      expect(input.className).toMatch(/text-sm.*sm:text-base/);
      expect(select.className).toMatch(/text-sm.*sm:text-base/);
      
      // Check button responsive sizing
      buttons.forEach(button => {
        expect(button.className).toMatch(/px-3.*py-2.*text-sm.*sm:px-4.*sm:py-2.*sm:text-base/);
      });
    });
  });

  describe('Accessibility Integration', () => {
    test('modal and form components should work together accessibly', async () => {
      const user = userEvent.setup();
      const onSubmit = jest.fn();
      const onClose = jest.fn();

      render(
        <BaseModal isOpen onClose={onClose}>
          <ModalHeader onClose={onClose}>Accessible Form Modal</ModalHeader>
          <ModalBody>
            <form onSubmit={onSubmit} id="accessible-form">
              <FormGroup>
                <FormLabel htmlFor="name" required>Name</FormLabel>
                <TextInput
                  id="name"
                  name="name"
                  value=""
                  onChange={() => {}}
                  required
                  error="Name is required"
                />
                <FormError error="Name is required" id="name-error" />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="category">Category</FormLabel>
                <Select
                  id="category"
                  name="category"
                  value=""
                  onChange={() => {}}
                  options={[
                    { value: 'work', label: 'Work' },
                    { value: 'personal', label: 'Personal' }
                  ]}
                />
              </FormGroup>
              
              <FormGroup>
                <Checkbox
                  id="urgent"
                  name="urgent"
                  checked={false}
                  onChange={() => {}}
                  label="Mark as urgent"
                />
              </FormGroup>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" form="accessible-form">
              Submit
            </Button>
          </ModalFooter>
        </BaseModal>
      );

      // Test keyboard navigation
      await user.tab(); // Should focus first focusable element
      expect(screen.getByLabelText('Name')).toHaveFocus();

      await user.tab(); // Should move to select
      expect(screen.getByLabelText('Category')).toHaveFocus();

      await user.tab(); // Should move to checkbox
      expect(screen.getByLabelText('Mark as urgent')).toHaveFocus();

      await user.tab(); // Should move to Cancel button
      expect(screen.getByText('Cancel')).toHaveFocus();

      await user.tab(); // Should move to Submit button
      expect(screen.getByText('Submit')).toHaveFocus();

      // Test escape key closes modal
      await user.keyboard('{Escape}');
      expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('error states should be properly announced', () => {
      render(
        <FormGroup>
          <FormLabel htmlFor="email" required>Email</FormLabel>
          <TextInput
            id="email"
            name="email"
            value=""
            onChange={() => {}}
            required
            error="Please enter a valid email"
            aria-describedby="email-error"
          />
          <FormError error="Please enter a valid email" id="email-error" />
        </FormGroup>
      );

      const input = screen.getByRole('textbox');
      const error = screen.getByRole('alert');

      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
      expect(error).toHaveAttribute('id', 'email-error');
      expect(error).toHaveAttribute('aria-live', 'polite');
    });
  });

  describe('Performance Integration', () => {
    test('components should not cause unnecessary re-renders', () => {
      let renderCount = 0;
      const TestComponent = React.memo(() => {
        renderCount++;
        return (
          <div>
            <Button onClick={() => {}}>Test Button</Button>
            <TextInput id="test" name="test" value="test" onChange={() => {}} />
            <LoadingIndicator />
          </div>
        );
      });

      const { rerender } = render(<TestComponent />);
      expect(renderCount).toBe(1);

      // Re-render with same props should not cause re-render
      rerender(<TestComponent />);
      expect(renderCount).toBe(1);
    });

    test('modal should clean up properly when unmounted', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = render(
        <BaseModal isOpen onClose={() => {}}>
          <div>Modal content</div>
        </BaseModal>
      );

      // Modal should add event listeners
      expect(addEventListenerSpy).toHaveBeenCalled();

      // Unmount should remove event listeners
      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalled();

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});