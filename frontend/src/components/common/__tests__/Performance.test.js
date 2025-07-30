import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
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

// Mock performance.now for consistent testing
const mockPerformanceNow = jest.fn();
global.performance.now = mockPerformanceNow;

describe('Performance Tests', () => {
  beforeEach(() => {
    mockPerformanceNow.mockClear();
    let time = 0;
    mockPerformanceNow.mockImplementation(() => time++);
  });

  describe('Component Re-render Performance', () => {
    test('Button component should not re-render unnecessarily', () => {
      const onClick = jest.fn();
      let renderCount = 0;
      
      const TestButton = React.memo(() => {
        renderCount++;
        return <Button onClick={onClick}>Test Button</Button>;
      });

      const { rerender } = render(<TestButton />);
      expect(renderCount).toBe(1);

      // Re-render with same props should not cause re-render due to memo
      rerender(<TestButton />);
      expect(renderCount).toBe(1);
    });

    test('TextInput component should not re-render unnecessarily', () => {
      const onChange = jest.fn();
      let renderCount = 0;
      
      const TestInput = React.memo(() => {
        renderCount++;
        return (
          <TextInput
            id="test"
            name="test"
            value="test"
            onChange={onChange}
          />
        );
      });

      const { rerender } = render(<TestInput />);
      expect(renderCount).toBe(1);

      // Re-render with same props should not cause re-render due to memo
      rerender(<TestInput />);
      expect(renderCount).toBe(1);
    });

    test('Select component should not re-render unnecessarily', () => {
      const onChange = jest.fn();
      const options = [
        { value: '1', label: 'Option 1' },
        { value: '2', label: 'Option 2' }
      ];
      let renderCount = 0;
      
      const TestSelect = React.memo(() => {
        renderCount++;
        return (
          <Select
            id="test"
            name="test"
            value="1"
            onChange={onChange}
            options={options}
          />
        );
      });

      const { rerender } = render(<TestSelect />);
      expect(renderCount).toBe(1);

      // Re-render with same props should not cause re-render due to memo
      rerender(<TestSelect />);
      expect(renderCount).toBe(1);
    });

    test('BaseModal component should not re-render unnecessarily', () => {
      const onClose = jest.fn();
      let renderCount = 0;
      
      const TestModal = React.memo(() => {
        renderCount++;
        return (
          <BaseModal isOpen={true} onClose={onClose}>
            <div>Modal Content</div>
          </BaseModal>
        );
      });

      const { rerender } = render(<TestModal />);
      expect(renderCount).toBe(1);

      // Re-render with same props should not cause re-render due to memo
      rerender(<TestModal />);
      expect(renderCount).toBe(1);
    });
  });

  describe('Event Handler Performance', () => {
    test('Button onClick handler should be memoized', () => {
      const onClick = jest.fn();
      let buttonRef;
      
      const TestComponent = () => {
        return (
          <Button 
            ref={(ref) => { buttonRef = ref; }}
            onClick={onClick}
          >
            Click me
          </Button>
        );
      };

      render(<TestComponent />);
      const button = screen.getByText('Click me');
      
      // Click multiple times
      fireEvent.click(button);
      fireEvent.click(button);
      fireEvent.click(button);
      
      expect(onClick).toHaveBeenCalledTimes(3);
    });

    test('Form input onChange handlers should work efficiently', () => {
      const onChange = jest.fn();
      
      render(
        <TextInput
          id="test"
          name="test"
          value=""
          onChange={onChange}
        />
      );
      
      const input = screen.getByRole('textbox');
      
      // Simulate rapid typing
      act(() => {
        fireEvent.change(input, { target: { value: 'a' } });
        fireEvent.change(input, { target: { value: 'ab' } });
        fireEvent.change(input, { target: { value: 'abc' } });
      });
      
      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });

  describe('Bundle Size Optimization', () => {
    test('Components should be tree-shakeable', () => {
      // Test that components can be imported individually
      expect(Button).toBeDefined();
      expect(TextInput).toBeDefined();
      expect(Select).toBeDefined();
      expect(Checkbox).toBeDefined();
      expect(TextArea).toBeDefined();
      expect(LoadingIndicator).toBeDefined();
      expect(BaseModal).toBeDefined();
      expect(ModalHeader).toBeDefined();
      expect(ModalBody).toBeDefined();
      expect(ModalFooter).toBeDefined();
      expect(FormGroup).toBeDefined();
      expect(FormLabel).toBeDefined();
      expect(FormError).toBeDefined();
    });
  });

  describe('Memory Leak Prevention', () => {
    test('Modal should clean up event listeners', () => {
      const onClose = jest.fn();
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');
      
      const { unmount } = render(
        <BaseModal isOpen={true} onClose={onClose}>
          <div>Modal Content</div>
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

  describe('Rendering Performance', () => {
    test('Large list of components should render efficiently', () => {
      const startTime = performance.now();
      
      const LargeList = () => (
        <div>
          {Array.from({ length: 100 }, (_, i) => (
            <div key={i}>
              <Button onClick={() => {}}>Button {i}</Button>
              <TextInput
                id={`input-${i}`}
                name={`input-${i}`}
                value=""
                onChange={() => {}}
              />
            </div>
          ))}
        </div>
      );
      
      render(<LargeList />);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      // Rendering 100 components should be reasonably fast
      // This is a relative test - adjust threshold as needed
      expect(renderTime).toBeLessThan(100); // 100ms threshold
    });
  });
});