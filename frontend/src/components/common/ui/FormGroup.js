import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * FormGroup component for grouping form elements
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form elements to group
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const FormGroup = ({
  children,
  className = '',
  error,
  ...rest
}) => {
  // Base classes for the form group with responsive spacing
  const baseClasses = 'mb-4 sm:mb-6';
  
  // Error state classes for better visual grouping
  const errorClasses = error ? 'p-2 sm:p-3 rounded-md bg-danger-50 dark:bg-danger-900/10 border border-danger-200 dark:border-danger-800' : '';
  
  // Combine all classes
  const formGroupClasses = `${baseClasses} ${errorClasses} ${className}`;

  return (
    <div 
      className={formGroupClasses} 
      role={error ? 'group' : undefined}
      aria-invalid={!!error}
      {...rest}
    >
      {children}
    </div>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  error: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
};

export default memo(FormGroup);