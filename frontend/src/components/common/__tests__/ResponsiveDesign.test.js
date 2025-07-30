import React from 'react';
import { render, screen } from '@testing-library/react';

// Import all components to test
import Button from '../ui/Button';
import TextInput from '../ui/TextInput';
import Select from '../ui/Select';
import Checkbox from '../ui/Checkbox';
import TextArea from '../ui/TextArea';
import LoadingIndicator from '../ui/LoadingIndicator';
import FormGroup from '../ui/FormGroup';
import BaseModal from '../modal/BaseModal';
import ModalHeader from '../modal/ModalHeader';
import ModalBody from '../modal/ModalBody';
import ModalFooter from '../modal/ModalFooter';

describe('Responsive Design Tests', () => {
  describe('Button Component', () => {
    test('should have responsive sizing classes', () => {
      const { rerender } = render(<Button onClick={() => {}}>Test Button</Button>);
      
      ['small', 'medium', 'large'].forEach(size => {
        rerender(<Button size={size} onClick={() => {}}>Test Button</Button>);
        const button = screen.getByRole('button');
        
        // Check for responsive classes
        expect(button.className).toMatch(/sm:/);
        
        // Check for mobile-first approach
        if (size === 'small') {
          expect(button.className).toMatch(/px-2.*py-1.*text-xs.*sm:px-3.*sm:py-1\.5.*sm:text-sm/);
        } else if (size === 'medium') {
          expect(button.className).toMatch(/px-3.*py-2.*text-sm.*sm:px-4.*sm:py-2.*sm:text-base/);
        } else if (size === 'large') {
          expect(button.className).toMatch(/px-4.*py-2\.5.*text-base.*sm:px-6.*sm:py-3.*sm:text-lg/);
        }
      });
    });

    test('should have responsive focus ring offset', () => {
      render(<Button onClick={() => {}}>Test Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button.className).toMatch(/focus:ring-offset-white.*dark:focus:ring-offset-dark-900/);
    });
  });

  describe('TextInput Component', () => {
    test('should have responsive text sizing', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          value=""
          onChange={() => {}}
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input.className).toMatch(/text-sm.*sm:text-base/);
    });

    test('should have responsive error styling', () => {
      render(
        <TextInput
          id="test-input"
          name="test"
          value=""
          onChange={() => {}}
          error="Test error"
        />
      );
      
      const input = screen.getByRole('textbox');
      expect(input.className).toMatch(/bg-danger-50.*dark:bg-danger-900\/20/);
    });
  });

  describe('Select Component', () => {
    const options = [
      { value: '1', label: 'Option 1' },
      { value: '2', label: 'Option 2' },
    ];

    test('should have responsive text sizing and padding', () => {
      render(
        <Select
          id="test-select"
          name="test"
          value=""
          onChange={() => {}}
          options={options}
        />
      );
      
      const select = screen.getByRole('combobox');
      expect(select.className).toMatch(/text-sm.*sm:text-base/);
      expect(select.className).toMatch(/pr-10/); // Right padding for arrow
    });

    test('should have dark mode arrow support', () => {
      render(
        <Select
          id="test-select"
          name="test"
          value=""
          onChange={() => {}}
          options={options}
        />
      );
      
      const select = screen.getByRole('combobox');
      expect(select.className).toMatch(/dark:bg-\[url\(/);
    });
  });

  describe('Checkbox Component', () => {
    test('should have responsive sizing and spacing', () => {
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
      const container = checkbox.parentElement;
      
      expect(checkbox.className).toMatch(/h-4.*w-4.*sm:h-5.*sm:w-5/);
      expect(container.className).toMatch(/gap-2.*sm:gap-3/);
    });

    test('should have responsive label text sizing', () => {
      render(
        <Checkbox
          id="test-checkbox"
          name="test"
          checked={false}
          onChange={() => {}}
          label="Test checkbox"
        />
      );
      
      const label = screen.getByText('Test checkbox');
      expect(label.className).toMatch(/text-sm.*sm:text-base/);
    });
  });

  describe('TextArea Component', () => {
    test('should have responsive text sizing', () => {
      render(
        <TextArea
          id="test-textarea"
          name="test"
          value=""
          onChange={() => {}}
        />
      );
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toMatch(/text-sm.*sm:text-base/);
    });

    test('should have minimum height constraint', () => {
      render(
        <TextArea
          id="test-textarea"
          name="test"
          value=""
          onChange={() => {}}
        />
      );
      
      const textarea = screen.getByRole('textbox');
      expect(textarea.className).toMatch(/min-h-\[2\.5rem\]/);
    });
  });

  describe('LoadingIndicator Component', () => {
    test('should have responsive sizing for all sizes', () => {
      const { rerender } = render(<LoadingIndicator />);
      
      ['small', 'medium', 'large'].forEach(size => {
        rerender(<LoadingIndicator size={size} />);
        const container = screen.getByRole('status');
        
        if (size === 'small') {
          expect(container.innerHTML).toMatch(/w-4.*h-4/);
        } else if (size === 'medium') {
          expect(container.innerHTML).toMatch(/w-5.*h-5.*sm:w-6.*sm:h-6/);
        } else if (size === 'large') {
          expect(container.innerHTML).toMatch(/w-6.*h-6.*sm:w-8.*sm:h-8/);
        }
      });
    });

    test('should have responsive text sizing', () => {
      const { rerender } = render(<LoadingIndicator text="Loading" />);
      
      ['small', 'medium', 'large'].forEach(size => {
        rerender(<LoadingIndicator size={size} text="Loading" />);
        const text = screen.getByText('Loading');
        
        if (size === 'small') {
          expect(text.className).toMatch(/text-xs.*sm:text-sm/);
        } else if (size === 'medium') {
          expect(text.className).toMatch(/text-sm.*sm:text-base/);
        } else if (size === 'large') {
          expect(text.className).toMatch(/text-base.*sm:text-lg/);
        }
      });
    });

    test('should have responsive gap spacing', () => {
      render(<LoadingIndicator text="Loading" />);
      const container = screen.getByRole('status');
      
      expect(container.className).toMatch(/gap-2.*sm:gap-3/);
    });
  });

  describe('FormGroup Component', () => {
    test('should have responsive spacing', () => {
      render(
        <FormGroup>
          <div>Form content</div>
        </FormGroup>
      );
      
      const formGroup = screen.getByText('Form content').parentElement;
      expect(formGroup.className).toMatch(/mb-4.*sm:mb-6/);
    });

    test('should have responsive error styling', () => {
      render(
        <FormGroup error="Test error">
          <div>Form content</div>
        </FormGroup>
      );
      
      const formGroup = screen.getByText('Form content').parentElement;
      expect(formGroup.className).toMatch(/p-2.*sm:p-3/);
    });
  });

  describe('BaseModal Component', () => {
    test('should have responsive sizing for all sizes', () => {
      const { rerender } = render(
        <BaseModal isOpen onClose={() => {}}>
          <div>Modal content</div>
        </BaseModal>
      );
      
      ['small', 'medium', 'large'].forEach(size => {
        rerender(
          <BaseModal isOpen onClose={() => {}} size={size}>
            <div>Modal content</div>
          </BaseModal>
        );
        
        const modal = screen.getByRole('dialog');
        
        if (size === 'small') {
          expect(modal.className).toMatch(/max-w-sm.*sm:max-w-md/);
        } else if (size === 'medium') {
          expect(modal.className).toMatch(/max-w-md.*sm:max-w-lg/);
        } else if (size === 'large') {
          expect(modal.className).toMatch(/max-w-lg.*sm:max-w-2xl.*lg:max-w-4xl/);
        }
      });
    });

    test('should have responsive padding', () => {
      render(
        <BaseModal isOpen onClose={() => {}}>
          <div>Modal content</div>
        </BaseModal>
      );
      
      const overlay = screen.getByTestId('modal-overlay');
      expect(overlay.className).toMatch(/p-2.*sm:p-4/);
    });

    test('should have responsive max height', () => {
      render(
        <BaseModal isOpen onClose={() => {}}>
          <div>Modal content</div>
        </BaseModal>
      );
      
      const modal = screen.getByRole('dialog');
      expect(modal.className).toMatch(/max-h-\[90vh\]/);
    });
  });

  describe('ModalHeader Component', () => {
    test('should have responsive padding and text sizing', () => {
      render(
        <ModalHeader onClose={() => {}}>
          Modal Title
        </ModalHeader>
      );
      
      const header = screen.getByText('Modal Title').parentElement;
      expect(header.className).toMatch(/px-4.*sm:px-6.*py-3.*sm:py-4/);
      
      const title = screen.getByText('Modal Title');
      expect(title.className).toMatch(/text-base.*sm:text-lg/);
    });

    test('should have responsive close button sizing', () => {
      render(
        <ModalHeader onClose={() => {}}>
          Modal Title
        </ModalHeader>
      );
      
      const closeButton = screen.getByLabelText('Close modal');
      const svg = closeButton.querySelector('svg');
      expect(svg.className).toMatch(/h-4.*w-4.*sm:h-5.*sm:w-5/);
    });
  });

  describe('ModalBody Component', () => {
    test('should have responsive padding and text sizing', () => {
      render(
        <ModalBody>
          Modal body content
        </ModalBody>
      );
      
      const body = screen.getByText('Modal body content');
      expect(body.className).toMatch(/px-4.*sm:px-6.*py-4.*sm:py-6/);
      expect(body.className).toMatch(/text-sm.*sm:text-base/);
    });
  });

  describe('ModalFooter Component', () => {
    test('should have responsive layout and spacing', () => {
      render(
        <ModalFooter>
          <button>Cancel</button>
          <button>Save</button>
        </ModalFooter>
      );
      
      const footer = screen.getByText('Cancel').parentElement;
      expect(footer.className).toMatch(/px-4.*sm:px-6.*py-3.*sm:py-4/);
      expect(footer.className).toMatch(/flex-col-reverse.*sm:flex-row/);
      expect(footer.className).toMatch(/gap-2.*sm:gap-3/);
      expect(footer.className).toMatch(/items-stretch.*sm:items-center/);
    });
  });

  describe('Dark Mode Support', () => {
    test('should have dark mode classes for all components', () => {
      render(
        <div>
          <Button onClick={() => {}}>Button</Button>
          <TextInput id="input" name="input" value="" onChange={() => {}} />
          <Select id="select" name="select" value="" onChange={() => {}} options={[]} />
          <Checkbox id="checkbox" name="checkbox" checked={false} onChange={() => {}} />
          <TextArea id="textarea" name="textarea" value="" onChange={() => {}} />
          <LoadingIndicator />
        </div>
      );
      
      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox', { name: /input/i });
      const select = screen.getByRole('combobox');
      const checkbox = screen.getByRole('checkbox');
      const textarea = screen.getByRole('textbox', { name: /textarea/i });
      const loadingIndicator = screen.getByRole('status');
      
      // Check for dark mode classes
      expect(button.className).toMatch(/dark:/);
      expect(input.className).toMatch(/dark:/);
      expect(select.className).toMatch(/dark:/);
      expect(checkbox.className).toMatch(/dark:/);
      expect(textarea.className).toMatch(/dark:/);
      expect(loadingIndicator.innerHTML).toMatch(/dark:/);
    });
  });

  describe('Mobile-First Approach', () => {
    test('should use mobile-first responsive design pattern', () => {
      render(
        <div>
          <Button size="medium" onClick={() => {}}>Button</Button>
          <TextInput id="input" name="input" value="" onChange={() => {}} />
          <LoadingIndicator size="medium" />
        </div>
      );
      
      const button = screen.getByRole('button');
      const input = screen.getByRole('textbox');
      const loadingContainer = screen.getByRole('status');
      
      // Check that base classes come first, then sm: variants
      expect(button.className).toMatch(/px-3.*py-2.*text-sm.*sm:px-4.*sm:py-2.*sm:text-base/);
      expect(input.className).toMatch(/text-sm.*sm:text-base/);
      expect(loadingContainer.innerHTML).toMatch(/w-5.*h-5.*sm:w-6.*sm:h-6/);
    });
  });
});