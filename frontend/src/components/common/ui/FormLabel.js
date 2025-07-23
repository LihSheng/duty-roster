import React from 'react';
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
  // Base classes for the form label
  const baseClasses = 'block mb-2 text-sm font-medium';
  
  // Combine all classes
  const labelClasses = `${baseClasses} ${className}`;

  return (
    <label htmlFor={htmlFor} className={labelClasses} {...rest}>
      {children}
      {required && <span className="ml-1 text-danger-600">*</span>}
    </label>
  );
};

FormLabel.propTypes = {
  htmlFor: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
  className: PropTypes.string,
};

export default FormLabel;