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
const ModalBody = ({ children, className = '' }) => <div className={`px-6 py-4 overflow-y-auto ${className}`}>{children}</div>;

ModalBody.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default ModalBody;
