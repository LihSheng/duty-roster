import React, { memo } from 'react';
import PropTypes from 'prop-types';

/**
 * ModalFooter component for modal dialogs
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Footer content (usually buttons)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const ModalFooter = ({
  children,
  className = '',
}) => {
  return (
    <div className={`px-4 sm:px-6 py-3 sm:py-4 border-t border-light-300 dark:border-dark-600 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 ${className}`}>
      {children}
    </div>
  );
};

ModalFooter.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default memo(ModalFooter);