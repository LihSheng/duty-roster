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
  ...rest
}) => {
  // Base classes for the input
  const baseClasses = 'block w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2';
  
  // Error state classes
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600';
  
  // Disabled state classes
  const disabledClasses = disabled ? 'bg-light-100 cursor-not-allowed dark:bg-dark-700' : 'bg-white dark:bg-dark-800';
  
  // Combine all classes
  const inputClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      className={inputClasses}
      aria-invalid={!!error}
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
};

export default TextInput;