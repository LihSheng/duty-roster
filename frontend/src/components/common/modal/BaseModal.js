import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * BaseModal component that serves as the foundation for all modal dialogs
 *
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to call when the modal is closed
 * @param {React.ReactNode} props.children - Modal content
 * @param {string} props.size - Modal size (small, medium, large)
 * @param {boolean} props.closeOnEsc - Whether to close the modal when the escape key is pressed
 * @param {boolean} props.closeOnOutsideClick - Whether to close the modal when clicking outside
 * @param {string} props.className - Additional CSS classes for the modal
 * @param {string} props.overlayClassName - Additional CSS classes for the overlay
 * @returns {JSX.Element|null} - Rendered component or null if not open
 */
const BaseModal = ({
  isOpen,
  onClose,
  children,
  size = 'medium',
  closeOnEsc = true,
  closeOnOutsideClick = true,
  className = '',
  overlayClassName = '',
}) => {
  const modalRef = useRef(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscKey = (event) => {
      if (closeOnEsc && event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = ''; // Restore scrolling when modal is closed
    };
  }, [isOpen, onClose, closeOnEsc]);

  // Handle click outside
  const handleOverlayClick = (event) => {
    // Make sure the click is on the overlay itself, not a child element
    if (
      closeOnOutsideClick &&
      modalRef.current &&
      !modalRef.current.contains(event.target) &&
      event.target.classList.contains('modal-overlay')
    ) {
      onClose();
    }
  };

  // Size classes
  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-lg',
    large: 'max-w-2xl',
  };

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  // Create a portal to render the modal at the end of the document body

  return createPortal(
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity modal-overlay ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      data-testid="modal-overlay"
    >
      <div
        ref={modalRef}
        className={`bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all ${className}`}
        data-testid="modal-container"
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

BaseModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  closeOnEsc: PropTypes.bool,
  closeOnOutsideClick: PropTypes.bool,
  className: PropTypes.string,
  overlayClassName: PropTypes.string,
};

export default BaseModal;
