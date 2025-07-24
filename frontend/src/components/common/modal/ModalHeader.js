import React from 'react';
import PropTypes from 'prop-types';

/**
 * ModalHeader component for modal dialogs
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Header content (usually the title)
 * @param {Function} props.onClose - Function to call when the close button is clicked
 * @param {boolean} props.showCloseButton - Whether to show the close button
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const ModalHeader = ({ children, onClose, showCloseButton = true, className = '' }) => (
  <div
    className={`px-6 py-4 border-b border-light-300 dark:border-dark-600 flex items-center justify-between ${className}`}
  >
    <div className="text-lg font-medium text-dark-900 dark:text-light-100">{children}</div>
    {showCloseButton && onClose && (
      <button
        type="button"
        onClick={onClose}
        className="text-light-500 hover:text-dark-900 dark:text-light-400 dark:hover:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
        aria-label="Close"
        data-testid="modal-close-button"
      >
        <svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </div>
);

ModalHeader.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func,
  showCloseButton: PropTypes.bool,
  className: PropTypes.string,
};

export default ModalHeader;
