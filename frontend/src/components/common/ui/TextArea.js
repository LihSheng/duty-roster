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
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) => {
  // Base classes for the textarea with responsive design
  const baseClasses = 'block w-full px-3 py-2 text-sm sm:text-base rounded-md border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 resize-y min-h-[2.5rem]';
  
  // Error state classes with better contrast
  const errorClasses = error
    ? 'border-danger-600 focus:border-danger-600 focus:ring-danger-500 bg-danger-50 dark:bg-danger-900/20'
    : 'border-light-300 focus:border-primary-500 focus:ring-primary-500 dark:border-dark-600 hover:border-light-400 dark:hover:border-dark-500';
  
  // Disabled state classes
  const disabledClasses = disabled 
    ? 'bg-light-100 cursor-not-allowed opacity-60 dark:bg-dark-700 resize-none' 
    : 'bg-white dark:bg-dark-800';
  
  // Text color classes
  const textClasses = 'text-dark-900 dark:text-light-100 placeholder-light-500 dark:placeholder-dark-400';
  
  // Combine all classes
  const textareaClasses = `${baseClasses} ${errorClasses} ${disabledClasses} ${textClasses} ${className}`;

  // Generate aria-describedby for error state
  const errorId = error && typeof error === 'string' ? `${id}-error` : undefined;
  const combinedAriaDescribedBy = [ariaDescribedBy, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <textarea
      id={id}
      name={name}
      value={value || ''}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      rows={rows}
      className={textareaClasses}
      aria-invalid={!!error}
      aria-label={ariaLabel}
      aria-describedby={combinedAriaDescribedBy}
      aria-required={required}
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
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default TextArea;