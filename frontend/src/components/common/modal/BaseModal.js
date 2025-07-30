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
  'aria-labelledby': ariaLabelledBy,
  'aria-describedby': ariaDescribedBy,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  // Handle focus management and escape key press
  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousActiveElement.current = document.activeElement;
      
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
      
      // Focus the modal container after a brief delay to ensure it's rendered
      setTimeout(() => {
        if (modalRef.current) {
          modalRef.current.focus();
        }
      }, 100);

      const handleEscKey = (event) => {
        if (closeOnEsc && event.key === 'Escape') {
          onClose();
        }
      };

      // Trap focus within the modal
      const handleTabKey = (event) => {
        if (event.key === 'Tab' && modalRef.current) {
          const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              event.preventDefault();
              lastElement?.focus();
            }
          } else {
            if (document.activeElement === lastElement) {
              event.preventDefault();
              firstElement?.focus();
            }
          }
        }
      };

      document.addEventListener('keydown', handleEscKey);
      document.addEventListener('keydown', handleTabKey);

      return () => {
        document.removeEventListener('keydown', handleEscKey);
        document.removeEventListener('keydown', handleTabKey);
        document.body.style.overflow = '';
        
        // Restore focus to the previously focused element
        if (previousActiveElement.current) {
          previousActiveElement.current.focus();
        }
      };
    }
  }, [isOpen, onClose, closeOnEsc]);

  // Handle click outside
  const handleOverlayClick = (event) => {
    // Make sure the click is on the overlay itself, not a child element
    if (closeOnOutsideClick && modalRef.current && !modalRef.current.contains(event.target) && event.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  // Size classes with responsive design
  const sizeClasses = {
    small: 'max-w-sm sm:max-w-md',
    medium: 'max-w-md sm:max-w-lg',
    large: 'max-w-lg sm:max-w-2xl lg:max-w-4xl',
  };

  // Don't render anything if the modal is not open
  if (!isOpen) return null;

  // Create a portal to render the modal at the end of the document body
  return createPortal(
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black bg-opacity-50 transition-opacity modal-overlay ${overlayClassName}`}
      onClick={handleOverlayClick}
      aria-modal="true"
      role="dialog"
      data-testid="modal-overlay"
    >
      <div 
        ref={modalRef}
        className={`bg-white dark:bg-dark-800 rounded-lg shadow-xl w-full ${sizeClasses[size]} transform transition-all max-h-[90vh] overflow-y-auto ${className}`}
        data-testid="modal-container"
        tabIndex={-1}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
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
  'aria-labelledby': PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default BaseModal;
