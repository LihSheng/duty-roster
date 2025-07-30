import React from 'react';
import PropTypes from 'prop-types';

/**
 * Checkbox component with validation support
 * 
 * @param {Object} props - Component props
 * @param {string} props.id - Checkbox ID
 * @param {string} props.name - Checkbox name
 * @param {boolean} props.checked - Whether the checkbox is checked
 * @param {Function} props.onChange - Change handler function
 * @param {React.ReactNode} props.label - Label content
 * @param {boolean} props.disabled - Whether the checkbox is disabled
 * @param {boolean} props.required - Whether the checkbox is required
 * @param {string|boolean} props.error - Error message or boolean indicating error state
 * @param {string} props.className - Additional CSS classes for the container
 * @param {string} props.inputClassName - Additional CSS classes for the input
 * @param {string} props.labelClassName - Additional CSS classes for the label
 * @returns {JSX.Element} - Rendered component
 */
const Checkbox = ({
  id,
  name,
  checked,
  onChange,
  label,
  disabled = false,
  required = false,
  error = false,
  className = '',
  inputClassName = '',
  labelClassName = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) => {
  // Base classes for the container with responsive design
  const containerClasses = `flex items-start gap-2 sm:gap-3 ${className}`;
  
  // Base classes for the checkbox input with responsive sizing
  const baseInputClasses = 'h-4 w-4 sm:h-5 sm:w-5 rounded border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-900 flex-shrink-0 mt-0.5';
  
  // Error state classes with better contrast
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600 hover:border-light-400 dark:hover:border-dark-500';
  
  // Checked state classes with better visual feedback
  const checkedClasses = checked
    ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500 hover:bg-primary-700 dark:hover:bg-primary-400'
    : 'bg-white dark:bg-dark-800 hover:bg-light-50 dark:hover:bg-dark-700';
  
  // Disabled state classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all input classes
  const inputClasses = `${baseInputClasses} ${errorClasses} ${checkedClasses} ${disabledClasses} ${inputClassName}`;
  
  // Label classes with responsive text sizing
  const baseLabelClasses = 'text-sm sm:text-base text-dark-900 dark:text-light-100 select-none';
  const labelDisabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const combinedLabelClasses = `${baseLabelClasses} ${labelDisabledClasses} ${labelClassName}`;

  // Generate aria-describedby for error state
  const errorId = error && typeof error === 'string' ? `${id}-error` : undefined;
  const combinedAriaDescribedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    // Toggle checkbox on Space key
    if (e.key === ' ') {
      e.preventDefault();
      if (!disabled) {
        const syntheticEvent = {
          target: { checked: !checked, name }
        };
        onChange(syntheticEvent);
      }
    }
  };

  return (
    <div className={containerClasses}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        required={required}
        className={inputClasses}
        aria-invalid={!!error}
        aria-label={ariaLabel}
        aria-describedby={combinedAriaDescribedBy}
        aria-required={required}
        {...rest}
      />
      {label && (
        <label htmlFor={id} className={combinedLabelClasses}>
          {label}
        </label>
      )}
    </div>
  );
};

Checkbox.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.node,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  labelClassName: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default Checkbox;