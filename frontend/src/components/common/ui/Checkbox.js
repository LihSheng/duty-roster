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
  ...rest
}) => {
  // Base classes for the container
  const containerClasses = `flex items-center ${className}`;
  
  // Base classes for the checkbox input
  const baseInputClasses = 'h-4 w-4 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Error state classes
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600';
  
  // Checked state classes
  const checkedClasses = checked
    ? 'bg-primary-600 border-primary-600 dark:bg-primary-500 dark:border-primary-500'
    : 'bg-white dark:bg-dark-800';
  
  // Disabled state classes
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  
  // Combine all input classes
  const inputClasses = `${baseInputClasses} ${errorClasses} ${checkedClasses} ${disabledClasses} ${inputClassName}`;
  
  // Label classes
  const baseLabelClasses = 'ml-2 text-sm';
  const labelDisabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
  const combinedLabelClasses = `${baseLabelClasses} ${labelDisabledClasses} ${labelClassName}`;

  return (
    <div className={containerClasses}>
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={inputClasses}
        aria-invalid={!!error}
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
};

export default Checkbox;