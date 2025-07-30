import React from 'react';
import PropTypes from 'prop-types';

/**
 * ModalBody component for modal dialogs
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Body content
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const ModalBody = ({
  children,
  className = '',
  id,
}) => {
  return (
    <div 
      id={id}
      className={`px-4 sm:px-6 py-4 sm:py-6 overflow-y-auto text-sm sm:text-base text-dark-700 dark:text-light-200 ${className}`}
    >
      {children}
    </div>
  );
};

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default ModalBody;