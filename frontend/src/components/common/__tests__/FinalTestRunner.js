/**
 * Final Test Runner for Reusable Components
 * 
 * This script performs comprehensive testing and integration verification
 * for all reusable components as part of task 8.
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Import all components
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
import ConfirmationModal from '../ConfirmationModal';

// Import refactored modals
import AddDutyModal from '../../duties/AddDutyModal';
import EditAssigneeModal from '../../assignments/EditAssigneeModal';

// Import visual consistency checker
import VisualConsistencyChecker from './VisualConsistencyChecker';

// Mock dependencies
jest.mock('axios', () => ({
  get: jest.fn(() => Promise.resolve({ data: [] })),
  post: jest.fn(() => Promise.resolve({ data: { id: 1 } })),
  put: jest.fn(() => Promise.resolve({ data: {} })),
}));

jest.mock('react-toastify', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

jest.mock('react-dom', () => {
  const original = jest.requireActual('react-dom');
  return {
    ...original,
    createPortal: (node) => node,
  };
});

/**
 * Test all individual components for basic functionality
 */
const testIndividualComponents = () => {
  console.log('🧪 Testing Individual Components...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  const componentTests = [
    {
      name: 'Button Component',
      test: () => {
        const onClick = jest.fn();
        render(<Button onClick={onClick}>Test Button</Button>);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        if (!onClick.mock.calls.length) throw new Error('onClick not called');
        cleanup();
      }
    },
    {
      name: 'TextInput Component',
      test: () => {
        const onChange = jest.fn();
        render(<TextInput id="test" name="test" value="" onChange={onChange} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'test' } });
        if (!onChange.mock.calls.length) throw new Error('onChange not called');
        cleanup();
      }
    },
    {
      name: 'Select Component',
      test: () => {
        const onChange = jest.fn();
        const options = [{ value: '1', label: 'Option 1' }];
        render(<Select id="test" name="test" value="" onChange={onChange} options={options} />);
        const select = screen.getByRole('combobox');
        fireEvent.change(select, { target: { value: '1' } });
        if (!onChange.mock.calls.length) throw new Error('onChange not called');
        cleanup();
      }
    },
    {
      name: 'Checkbox Component',
      test: () => {
        const onChange = jest.fn();
        render(<Checkbox id="test" name="test" checked={false} onChange={onChange} label="Test" />);
        const checkbox = screen.getByRole('checkbox');
        fireEvent.click(checkbox);
        if (!onChange.mock.calls.length) throw new Error('onChange not called');
        cleanup();
      }
    },
    {
      name: 'TextArea Component',
      test: () => {
        const onChange = jest.fn();
        render(<TextArea id="test" name="test" value="" onChange={onChange} />);
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'test' } });
        if (!onChange.mock.calls.length) throw new Error('onChange not called');
        cleanup();
      }
    },
    {
      name: 'LoadingIndicator Component',
      test: () => {
        render(<LoadingIndicator />);
        const indicator = screen.getByRole('status');
        if (!indicator) throw new Error('LoadingIndicator not rendered');
        cleanup();
      }
    },
    {
      name: 'BaseModal Component',
      test: () => {
        const onClose = jest.fn();
        render(<BaseModal isOpen onClose={onClose}><div>Content</div></BaseModal>);
        const modal = screen.getByRole('dialog');
        if (!modal) throw new Error('Modal not rendered');
        fireEvent.keyDown(document, { key: 'Escape' });
        if (!onClose.mock.calls.length) throw new Error('onClose not called on Escape');
        cleanup();
      }
    },
    {
      name: 'FormGroup Component',
      test: () => {
        render(<FormGroup><div>Test Content</div></FormGroup>);
        const content = screen.getByText('Test Content');
        if (!content) throw new Error('FormGroup content not rendered');
        cleanup();
      }
    },
    {
      name: 'FormLabel Component',
      test: () => {
        render(<FormLabel htmlFor="test">Test Label</FormLabel>);
        const label = screen.getByText('Test Label');
        if (!label.getAttribute('for')) throw new Error('Label not properly associated');
        cleanup();
      }
    },
    {
      name: 'FormError Component',
      test: () => {
        render(<FormError error="Test error" />);
        const error = screen.getByRole('alert');
        if (!error) throw new Error('FormError not rendered');
        cleanup();
      }
    }
  ];

  componentTests.forEach(test => {
    try {
      test.test();
      results.passed++;
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      results.failed++;
      results.errors.push({ component: test.name, error: error.message });
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  });

  console.log(`\n📊 Individual Components: ${results.passed} passed, ${results.failed} failed\n`);
  return results;
};

/**
 * Test component integration
 */
const testComponentIntegration = () => {
  console.log('🔗 Testing Component Integration...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  const integrationTests = [
    {
      name: 'Modal with Form Components',
      test: () => {
        const onClose = jest.fn();
        const onChange = jest.fn();
        
        render(
          <BaseModal isOpen onClose={onClose}>
            <ModalHeader onClose={onClose}>Test Modal</ModalHeader>
            <ModalBody>
              <FormGroup>
                <FormLabel htmlFor="test-input">Test Input</FormLabel>
                <TextInput id="test-input" name="test" value="" onChange={onChange} />
                <FormError error="Test error" />
              </FormGroup>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondary" onClick={onClose}>Cancel</Button>
              <Button variant="primary">Save</Button>
            </ModalFooter>
          </BaseModal>
        );

        // Verify all components are rendered
        if (!screen.getByText('Test Modal')) throw new Error('Modal header not rendered');
        if (!screen.getByLabelText('Test Input')) throw new Error('Form input not rendered');
        if (!screen.getByRole('alert')) throw new Error('Form error not rendered');
        if (!screen.getByText('Cancel')) throw new Error('Cancel button not rendered');
        if (!screen.getByText('Save')) throw new Error('Save button not rendered');

        cleanup();
      }
    },
    {
      name: 'Form with All Input Types',
      test: () => {
        const onChange = jest.fn();
        
        render(
          <form>
            <FormGroup>
              <FormLabel htmlFor="text">Text Input</FormLabel>
              <TextInput id="text" name="text" value="" onChange={onChange} />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="select">Select</FormLabel>
              <Select 
                id="select" 
                name="select" 
                value="" 
                onChange={onChange} 
                options={[{ value: '1', label: 'Option 1' }]} 
              />
            </FormGroup>
            <FormGroup>
              <Checkbox id="checkbox" name="checkbox" checked={false} onChange={onChange} label="Checkbox" />
            </FormGroup>
            <FormGroup>
              <FormLabel htmlFor="textarea">Text Area</FormLabel>
              <TextArea id="textarea" name="textarea" value="" onChange={onChange} />
            </FormGroup>
            <Button type="submit">Submit</Button>
          </form>
        );

        // Verify all form elements are present
        if (!screen.getByLabelText('Text Input')) throw new Error('Text input not found');
        if (!screen.getByLabelText('Select')) throw new Error('Select not found');
        if (!screen.getByLabelText('Checkbox')) throw new Error('Checkbox not found');
        if (!screen.getByLabelText('Text Area')) throw new Error('Text area not found');
        if (!screen.getByText('Submit')) throw new Error('Submit button not found');

        cleanup();
      }
    },
    {
      name: 'Button with Loading State',
      test: () => {
        const onClick = jest.fn();
        
        const { rerender } = render(
          <Button onClick={onClick} isLoading={false}>Save</Button>
        );

        let button = screen.getByRole('button');
        if (button.getAttribute('aria-busy')) throw new Error('Button should not be busy initially');

        rerender(<Button onClick={onClick} isLoading={true}>Save</Button>);
        
        button = screen.getByRole('button');
        if (button.getAttribute('aria-busy') !== 'true') throw new Error('Button should be busy when loading');
        if (!screen.getByText('Loading...')) throw new Error('Loading text not found');

        cleanup();
      }
    }
  ];

  integrationTests.forEach(test => {
    try {
      test.test();
      results.passed++;
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      results.failed++;
      results.errors.push({ component: test.name, error: error.message });
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  });

  console.log(`\n📊 Integration Tests: ${results.passed} passed, ${results.failed} failed\n`);
  return results;
};

/**
 * Test refactored modal components
 */
const testRefactoredModals = () => {
  console.log('🔄 Testing Refactored Modal Components...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  const modalTests = [
    {
      name: 'ConfirmationModal Refactoring',
      test: () => {
        const onConfirm = jest.fn();
        const onCancel = jest.fn();
        
        render(
          <ConfirmationModal
            isOpen={true}
            title="Test Confirmation"
            message="Are you sure?"
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        );

        // Verify modal structure
        if (!screen.getByRole('dialog')) throw new Error('Modal dialog not found');
        if (!screen.getByText('Test Confirmation')) throw new Error('Modal title not found');
        if (!screen.getByText('Are you sure?')) throw new Error('Modal message not found');
        
        // Verify buttons use Button component styling
        const confirmButton = screen.getByText('Confirm');
        const cancelButton = screen.getByText('Cancel');
        
        if (!confirmButton.className.includes('bg-primary-600')) throw new Error('Confirm button styling incorrect');
        if (!cancelButton.className.includes('bg-light-200')) throw new Error('Cancel button styling incorrect');

        // Test functionality
        fireEvent.click(confirmButton);
        if (!onConfirm.mock.calls.length) throw new Error('onConfirm not called');

        cleanup();
      }
    }
  ];

  modalTests.forEach(test => {
    try {
      test.test();
      results.passed++;
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      results.failed++;
      results.errors.push({ component: test.name, error: error.message });
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  });

  console.log(`\n📊 Refactored Modals: ${results.passed} passed, ${results.failed} failed\n`);
  return results;
};

/**
 * Test accessibility features
 */
const testAccessibility = () => {
  console.log('♿ Testing Accessibility Features...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  const accessibilityTests = [
    {
      name: 'Button Accessibility',
      test: () => {
        render(<Button onClick={() => {}} disabled>Disabled Button</Button>);
        const button = screen.getByRole('button');
        if (button.getAttribute('aria-disabled') !== 'true') throw new Error('Disabled button missing aria-disabled');
        cleanup();
      }
    },
    {
      name: 'Form Label Association',
      test: () => {
        render(
          <div>
            <FormLabel htmlFor="test-field">Test Field</FormLabel>
            <TextInput id="test-field" name="test" value="" onChange={() => {}} />
          </div>
        );
        
        const label = screen.getByText('Test Field');
        const input = screen.getByRole('textbox');
        
        if (label.getAttribute('for') !== 'test-field') throw new Error('Label not properly associated');
        if (input.getAttribute('id') !== 'test-field') throw new Error('Input missing proper id');
        
        cleanup();
      }
    },
    {
      name: 'Error State Accessibility',
      test: () => {
        render(
          <div>
            <TextInput 
              id="error-field" 
              name="test" 
              value="" 
              onChange={() => {}} 
              error="Test error"
              aria-describedby="error-field-error"
            />
            <FormError error="Test error" id="error-field-error" />
          </div>
        );
        
        const input = screen.getByRole('textbox');
        const error = screen.getByRole('alert');
        
        if (input.getAttribute('aria-invalid') !== 'true') throw new Error('Input missing aria-invalid');
        if (input.getAttribute('aria-describedby') !== 'error-field-error') throw new Error('Input not described by error');
        if (error.getAttribute('id') !== 'error-field-error') throw new Error('Error missing proper id');
        
        cleanup();
      }
    },
    {
      name: 'Modal Accessibility',
      test: () => {
        render(
          <BaseModal isOpen onClose={() => {}}>
            <div>Modal content</div>
          </BaseModal>
        );
        
        const modal = screen.getByRole('dialog');
        if (modal.getAttribute('aria-modal') !== 'true') throw new Error('Modal missing aria-modal');
        
        cleanup();
      }
    },
    {
      name: 'LoadingIndicator Accessibility',
      test: () => {
        render(<LoadingIndicator text="Loading data" />);
        
        const indicator = screen.getByRole('status');
        if (indicator.getAttribute('aria-live') !== 'polite') throw new Error('Loading indicator missing aria-live');
        if (indicator.getAttribute('aria-label') !== 'Loading') throw new Error('Loading indicator missing aria-label');
        
        cleanup();
      }
    }
  ];

  accessibilityTests.forEach(test => {
    try {
      test.test();
      results.passed++;
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      results.failed++;
      results.errors.push({ component: test.name, error: error.message });
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  });

  console.log(`\n📊 Accessibility Tests: ${results.passed} passed, ${results.failed} failed\n`);
  return results;
};

/**
 * Test responsive design
 */
const testResponsiveDesign = () => {
  console.log('📱 Testing Responsive Design...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    errors: []
  };

  const responsiveTests = [
    {
      name: 'Button Responsive Sizing',
      test: () => {
        render(<Button size="medium">Test Button</Button>);
        const button = screen.getByRole('button');
        if (!button.className.includes('sm:')) throw new Error('Button missing responsive classes');
        cleanup();
      }
    },
    {
      name: 'Input Responsive Text',
      test: () => {
        render(<TextInput id="test" name="test" value="" onChange={() => {}} />);
        const input = screen.getByRole('textbox');
        if (!input.className.includes('sm:text-base')) throw new Error('Input missing responsive text classes');
        cleanup();
      }
    },
    {
      name: 'Modal Responsive Sizing',
      test: () => {
        render(
          <BaseModal isOpen onClose={() => {}} size="large">
            <div>Content</div>
          </BaseModal>
        );
        const modal = screen.getByRole('dialog');
        if (!modal.className.includes('sm:max-w-2xl')) throw new Error('Modal missing responsive sizing');
        cleanup();
      }
    }
  ];

  responsiveTests.forEach(test => {
    try {
      test.test();
      results.passed++;
      console.log(`  ✅ ${test.name}`);
    } catch (error) {
      results.failed++;
      results.errors.push({ component: test.name, error: error.message });
      console.log(`  ❌ ${test.name}: ${error.message}`);
    }
  });

  console.log(`\n📊 Responsive Design Tests: ${results.passed} passed, ${results.failed} failed\n`);
  return results;
};

/**
 * Run all final tests
 */
export const runFinalTests = () => {
  console.log('🚀 Running Final Testing and Integration Suite\n');
  console.log('=' .repeat(60) + '\n');

  const testSuites = [
    { name: 'Individual Components', fn: testIndividualComponents },
    { name: 'Component Integration', fn: testComponentIntegration },
    { name: 'Refactored Modals', fn: testRefactoredModals },
    { name: 'Accessibility', fn: testAccessibility },
    { name: 'Responsive Design', fn: testResponsiveDesign }
  ];

  const allResults = {};
  let totalPassed = 0;
  let totalFailed = 0;

  // Run all test suites
  testSuites.forEach(suite => {
    const results = suite.fn();
    allResults[suite.name] = results;
    totalPassed += results.passed;
    totalFailed += results.failed;
  });

  // Run visual consistency checks
  console.log('🎨 Running Visual Consistency Checks...\n');
  const visualResults = VisualConsistencyChecker.runAllConsistencyChecks();
  allResults['Visual Consistency'] = visualResults;

  // Final summary
  console.log('\n' + '=' .repeat(60));
  console.log('📋 FINAL TEST SUMMARY');
  console.log('=' .repeat(60));
  
  console.log(`\n🧪 Functional Tests:`);
  console.log(`  ✅ Total Passed: ${totalPassed}`);
  console.log(`  ❌ Total Failed: ${totalFailed}`);

  const visualPassed = Object.values(visualResults).reduce((sum, result) => sum + result.passed.length, 0);
  const visualFailed = Object.values(visualResults).reduce((sum, result) => sum + result.failed.length, 0);
  
  console.log(`\n🎨 Visual Consistency:`);
  console.log(`  ✅ Total Passed: ${visualPassed}`);
  console.log(`  ❌ Total Failed: ${visualFailed}`);

  const grandTotalPassed = totalPassed + visualPassed;
  const grandTotalFailed = totalFailed + visualFailed;

  console.log(`\n🏆 GRAND TOTAL:`);
  console.log(`  ✅ Total Passed: ${grandTotalPassed}`);
  console.log(`  ❌ Total Failed: ${grandTotalFailed}`);
  console.log(`  📊 Success Rate: ${((grandTotalPassed / (grandTotalPassed + grandTotalFailed)) * 100).toFixed(1)}%`);

  if (grandTotalFailed === 0) {
    console.log('\n🎉 ALL TESTS PASSED! The reusable components are ready for production.');
  } else {
    console.log('\n🔧 Some issues found. Please review and fix the failed tests before deployment.');
    
    // Show detailed errors
    console.log('\n❌ Failed Tests Details:');
    Object.entries(allResults).forEach(([suiteName, results]) => {
      if (results.errors && results.errors.length > 0) {
        console.log(`\n  ${suiteName}:`);
        results.errors.forEach(error => {
          console.log(`    • ${error.component}: ${error.error}`);
        });
      }
    });
  }

  console.log('\n' + '=' .repeat(60));
  
  return allResults;
};

export default {
  runFinalTests,
  testIndividualComponents,
  testComponentIntegration,
  testRefactoredModals,
  testAccessibility,
  testResponsiveDesign
};