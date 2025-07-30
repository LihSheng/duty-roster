import React from 'react';
import PropTypes from 'prop-types';

/**
 * TextInput component for form inputs with validation support
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Input type (text, email, password, etc.)
 * @param {string} props.id - Input ID
 * @param {string} props.name - Input name
 * @param {string|number} props.value - Input value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.placeholder - Input placeholder
 * @param {boolean} props.disabled - Whether the input is disabled
 * @param {boolean} props.required - Whether the input is required
 * @param {string|boolean} props.error - Error message or boolean indicating error state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const TextInput = ({
  type = 'text',
  id,
  name,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  error = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) => {
  // Base classes for the input with responsive design
  const baseClasses = 'block w-full px-3 py-2 text-sm sm:text-base rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';
  
  // Error state classes with better contrast
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600 hover:border-light-400 dark:hover:border-dark-500';
  
  // Disabled state classes
  const disabledClasses = disabled 
    ? 'bg-light-100 cursor-not-allowed opacity-60 dark:bg-dark-700' 
    : 'bg-white dark:bg-dark-800';
  
  // Text color classes
  const textClasses = 'text-dark-900 dark:text-light-100 placeholder-light-500 dark:placeholder-dark-400';
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${textClasses} ${className}`;

  // Generate aria-describedby for error state
  const errorId = error && typeof error === 'string' ? `${id}-error` : undefined;
  const combinedAriaDescribedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={inputClasses}
      aria-invalid={!!error}
      aria-label={ariaLabel}
      aria-describedby={combinedAriaDescribedBy}
      aria-required={required}
      {...rest}
    />
  );
};

TextInput.propTypes = {
  type: PropTypes.string,
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default TextInput;