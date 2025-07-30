import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from './LoadingIndicator';

/**
 * Button component with support for variants, sizes, disabled and loading states
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.variant - Button variant (primary, secondary, danger, success)
 * @param {string} props.size - Button size (small, medium, large)
 * @param {string} props.type - Button type (button, submit, reset)
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  type = 'button',
  disabled = false,
  isLoading = false,
  className = '',
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...rest
}) => {
  // Size classes - responsive design with mobile-first approach
  const sizeClasses = {
    small: 'px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm',
    medium: 'px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base',
    large: 'px-4 py-2.5 text-base sm:px-6 sm:py-3 sm:text-lg',
  };

  // Variant classes with improved contrast ratios for accessibility
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
    secondary: 'bg-light-200 text-dark-800 hover:bg-light-300 focus:ring-light-400 active:bg-light-400 dark:bg-dark-600 dark:text-light-100 dark:hover:bg-dark-700 dark:focus:ring-dark-500 dark:active:bg-dark-800',
    danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 active:bg-danger-800',
    success: 'bg-success-600 text-white hover:bg-success-700 focus:ring-success-500 active:bg-success-800',
  };

  // Base classes that apply to all buttons with enhanced accessibility
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-900';
  
  // State classes with better visual feedback
  const stateClasses = (disabled || isLoading) 
    ? 'opacity-50 cursor-not-allowed' 
    : 'cursor-pointer hover:shadow-sm active:scale-95';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${stateClasses} ${className}`;

  // Loading indicator size based on button size
  const loaderSize = size === 'small' ? 'small' : size === 'large' ? 'medium' : 'small';

  // Memoized click handler to prevent unnecessary re-renders
  const handleClick = useCallback((e) => {
    if (onClick && typeof onClick === 'function') {
      onClick(e);
    }
  }, [onClick]);

  // Memoized keyboard navigation handler
  const handleKeyDown = useCallback((e) => {
    // Activate button on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!disabled && !isLoading) {
        handleClick(e);
      }
    }
  }, [handleClick, disabled, isLoading]);

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      aria-disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {isLoading ? (
        <>
          <LoadingIndicator size={loaderSize} className="mr-2" aria-hidden="true" />
          <span className="sr-only">Loading...</span>
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success']),
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  disabled: PropTypes.bool,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default memo(Button);