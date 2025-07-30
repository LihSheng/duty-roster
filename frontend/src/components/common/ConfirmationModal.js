import React from 'react';
import PropTypes from 'prop-types';
import BaseModal from './modal/BaseModal';
import ModalHeader from './modal/ModalHeader';
import ModalBody from './modal/ModalBody';
import ModalFooter from './modal/ModalFooter';
import Button from './ui/Button';

/**
 * ConfirmationModal component for displaying confirmation dialogs
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {string} props.title - Modal title
 * @param {string} props.message - Confirmation message
 * @param {Function} props.onConfirm - Function to call when confirm button is clicked
 * @param {Function} props.onCancel - Function to call when cancel button is clicked
 * @param {string} props.confirmText - Text for the confirm button (default: "Confirm")
 * @param {string} props.cancelText - Text for the cancel button (default: "Cancel")
 * @param {string} props.confirmVariant - Variant for the confirm button (default: "primary")
 * @param {string} props.size - Modal size (default: "medium")
 * @returns {JSX.Element|null} - Rendered component or null if not open
 */
const ConfirmationModal = ({
  isOpen = true,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'primary',
  size = 'medium',
}) => {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      size={size}
    >
      <ModalHeader onClose={onCancel}>
        {title}
      </ModalHeader>
      <ModalBody>
        <p className="text-dark-700 dark:text-light-300">
          {message}
        </p>
      </ModalBody>
      <ModalFooter>
        <Button
          variant="secondary"
          onClick={onCancel}
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
        >
          {confirmText}
        </Button>
      </ModalFooter>
    </BaseModal>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  confirmVariant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
};

export default ConfirmationModal;