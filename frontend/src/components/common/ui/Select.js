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
  ...rest
}) => {
  // Base classes for the select
  const baseClasses = 'block w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 appearance-none bg-no-repeat';
  
  // Error state classes
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600';
  
  // Disabled state classes
  const disabledClasses = disabled ? 'bg-light-100 cursor-not-allowed dark:bg-dark-700' : 'bg-white dark:bg-dark-800';
  
  // Add arrow indicator styling
  const arrowClasses = 'bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 20 20\'%3E%3Cpath stroke=\'%236b7280\' stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'1.5\' d=\'m6 8 4 4 4-4\'/%3E%3C/svg%3E")] bg-[length:1.25em_1.25em] bg-[right_0.5rem_center]';
  
  // Combine all classes
  const selectClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${arrowClasses} ${className}`;

  return (
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      className={selectClasses}
      aria-invalid={!!error}
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
};

export default Select;