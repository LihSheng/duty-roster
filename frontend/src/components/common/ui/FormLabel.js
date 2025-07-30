import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * FormLabel component for consistent form labels
 * 
 * @param {Object} props - Component props
 * @param {string} props.htmlFor - ID of the form element this label is for
 * @param {React.ReactNode} props.children - Label content
 * @param {boolean} props.required - Whether the field is required
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const FormLabel = ({
  htmlFor,
  children,
  required = false,
  className = '',
  ...rest
}) => {
  // Base classes for the form label with responsive design
  const baseClasses = 'block mb-1 sm:mb-2 text-sm sm:text-base font-medium text-dark-900 dark:text-light-100';
  
  // Combine all classes
  const labelClasses = `${baseClasses} ${className}`;

  return (
    <label htmlFor={htmlFor} className={labelClasses} {...rest}>
      <span className="flex items-center gap-1">
        {children}
        {required && (
          <span 
            className="text-danger-600 dark:text-danger-400 text-base" 
            aria-label="required"
            title="This field is required"
          >
            *
          </span>
        )}
      </span>
    </label>
  );
};

FormLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default memo(FormLabel);