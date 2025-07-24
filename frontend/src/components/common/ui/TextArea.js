import React from 'react';
import PropTypes from 'prop-types';

/**
 * TextArea component for multiline text input with validation support
 *
 * @param {Object} props - Component props
 * @param {string} props.id - TextArea ID
 * @param {string} props.name - TextArea name
 * @param {string} props.value - TextArea value
 * @param {Function} props.onChange - Change handler function
 * @param {string} props.placeholder - TextArea placeholder
 * @param {boolean} props.disabled - Whether the textarea is disabled
 * @param {boolean} props.required - Whether the textarea is required
 * @param {string|boolean} props.error - Error message or boolean indicating error state
 * @param {number} props.rows - Number of visible text rows
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const TextArea = ({
  id,
  name,
  value,
  onChange,
  placeholder = '',
  disabled = false,
  required = false,
  error = false,
  rows = 3,
  className = '',
  ...rest
}) => {
  // Base classes for the textarea
  const baseClasses =
    'block w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2';

  // Error state classes
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600';

  // Disabled state classes
  const disabledClasses = disabled
    ? 'bg-light-100 cursor-not-allowed dark:bg-dark-700'
    : 'bg-white dark:bg-dark-800';

  // Combine all classes
  const textareaClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${className}`;

  return (
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      rows={rows}
      className={textareaClasses}
      aria-invalid={!!error}
      {...rest}
    />
  );
};

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  rows: PropTypes.number,
  className: PropTypes.string,
};

export default TextArea;
