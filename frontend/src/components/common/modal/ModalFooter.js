import React from 'react';
import PropTypes from 'prop-types';

/**
 * ModalFooter component for modal dialogs
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content (usually buttons)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const ModalFooter = ({ children, className = '' }) => {

  return (
    <div
      className={`px-6 py-4 border-t border-light-300 dark:border-dark-600 flex items-center justify-end space-x-2 ${className}`}
    >
      {children}
    </div>
  );
};

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ModalFooter;
