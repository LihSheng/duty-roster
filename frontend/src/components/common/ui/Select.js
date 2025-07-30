import React from 'react';
import PropTypes from 'prop-types';

/**
 * Select component for dropdown selections with validation support
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Select ID
 * @param {string} props.name - Select name
 * @param {string|number} props.value - Selected value
 * @param {Function} props.onChange - Change handler function
 * @param {Array} props.options - Array of options objects with value and label properties
 * @param {string} props.placeholder - Optional placeholder text
 * @param {boolean} props.disabled - Whether the select is disabled
 * @param {boolean} props.required - Whether the select is required
 * @param {string|boolean} props.error - Error message or boolean indicating error state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const Select = ({
  id,
  name,
  value,
  onChange,
  options = [],
  placeholder = '',
  disabled = false,
  required = false,
  error = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) => {
  // Base classes for the select with responsive design
  const baseClasses = 'block w-full px-3 py-2 pr-10 text-sm sm:text-base rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 appearance-none bg-no-repeat';
  
  // Error state classes with better contrast
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600 hover:border-light-400 dark:hover:border-dark-500';
  
  // Disabled state classes
  const disabledClasses = disabled 
    ? 'bg-light-100 cursor-not-allowed opacity-60 dark:bg-dark-700' 
    : 'bg-white dark:bg-dark-800';
  
  // Text color classes
  const textClasses = 'text-dark-900 dark:text-light-100';
  
  // Add arrow indicator styling with dark mode support
  const arrowClasses = 'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] dark:bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%23d1d5db\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center]';
  
  // Combine all classes
  const selectClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${textClasses} ${arrowClasses} ${className}`;

  // Generate aria-describedby for error state
  const errorId = error && typeof error === 'string' ? `${id}-error` : undefined;
  const combinedAriaDescribedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Allow arrow keys, Enter, Escape, and Tab for navigation
    if (['ArrowUp', 'ArrowDown', 'Enter', 'Escape', 'Tab'].includes(e.key)) {
      // Let the browser handle these keys naturally
      return;
    }
    
    // For other keys, find matching option
    if (e.key.length === 1) {
      const matchingOption = options.find(option => 
        option.label.toLowerCase().startsWith(e.key.toLowerCase())
      );
      if (matchingOption && onChange) {
        const syntheticEvent = {
          target: { value: matchingOption.value, name }
        };
        onChange(syntheticEvent);
      }
    }
  };

  return (
    <select
      id={id}
      name={name}
      value={value || ''}
      onChange={onChange}
      onKeyDown={handleKeyDown}
      disabled={disabled}
      required={required}
      className={selectClasses}
      aria-invalid={!!error}
      aria-label={ariaLabel}
      aria-describedby={combinedAriaDescribedBy}
      aria-required={required}
      {...rest}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

Select.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default Select;