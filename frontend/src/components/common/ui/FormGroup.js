import React from 'react';
import PropTypes from 'prop-types';

/**
 * FormGroup component for grouping form elements
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Form elements to group
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const FormGroup = ({ children, className = '', ...rest }) => {
  // Base classes for the form group
  const baseClasses = 'mb-4';

  // Combine all classes
  const formGroupClasses = `${baseClasses} ${className}`;

  return (
    <div className={formGroupClasses} {...rest}>
      {children}
    </div>
  );
};

FormGroup.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default FormGroup;
