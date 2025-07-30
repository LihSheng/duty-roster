import React from 'react';
import PropTypes from 'prop-types';

/**
 * FormError component for displaying validation errors
 * 
 * @param {Object} props - Component props
 * @param {string|boolean} props.error - Error message or boolean indicating error state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element|null} - Rendered component or null if no error
 */
const FormError = ({
  error,
  id,
  className = '',
  ...rest
}) => {
  // If no error, don't render anything
  if (!error) return null;
  
  // Base classes for the error message with responsive design
  const baseClasses = 'mt-1 text-xs sm:text-sm text-danger-600 dark:text-danger-400 flex items-start gap-1';
  
  // Combine all classes
  const errorClasses = `${baseClasses} ${className}`;

  return (
    <div 
      id={id}
      className={errorClasses} 
      role="alert" 
      aria-live="polite"
      {...rest}
    >
      {/* Error icon for better visual indication */}
      <svg 
        className="w-3 h-3 sm:w-4 sm:h-4 mt-0.5 flex-shrink-0" 
        fill="currentColor" 
        viewBox="0 0 20 20"
        aria-hidden="true"
      >
        <path 
          fillRule="evenodd" 
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
          clipRule="evenodd" 
        />
      </svg>
      <span>
        {typeof error === 'string' ? error : 'This field has an error'}
      </span>
    </div>
  );
};

FormError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  id: PropTypes.string,
  className: PropTypes.string,
};

export default FormError;