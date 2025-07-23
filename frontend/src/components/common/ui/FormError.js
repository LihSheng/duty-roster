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
  className = '',
  ...rest
}) => {
  // If no error, don't render anything
  if (!error) return null;
  
  // Base classes for the error message
  const baseClasses = 'mt-1 text-sm text-danger-600';
  
  // Combine all classes
  const errorClasses = `${baseClasses} ${className}`;

  return (
    <div className={errorClasses} role="alert" {...rest}>
      {typeof error === 'string' ? error : 'This field has an error'}
    </div>
  );
};

FormError.propTypes = {
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  className: PropTypes.string,
};

export default FormError;