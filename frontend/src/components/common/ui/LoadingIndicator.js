import React from 'react';
import PropTypes from 'prop-types';

/**
 * LoadingIndicator component for displaying loading states
 * 
 * @param {Object} props - Component props
 * @param {string} props.size - Size of the loading indicator (small, medium, large)
 * @param {string} props.text - Optional text to display alongside the indicator
 * @param {boolean} props.centered - Whether to center the indicator in its container
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} - Rendered component
 */
const LoadingIndicator = ({
  size = 'medium',
  text = '',
  centered = false,
  className = '',
  'aria-label': ariaLabel = 'Loading',
}) => {
  // Size classes for the spinner with responsive design
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-5 h-5 sm:w-6 sm:h-6 border-2',
    large: 'w-6 h-6 sm:w-8 sm:h-8 border-2 sm:border-3',
  };

  // Text size classes with responsive design
  const textSizeClasses = {
    small: 'text-xs sm:text-sm',
    medium: 'text-sm sm:text-base',
    large: 'text-base sm:text-lg',
  };

  // Container classes with better responsive centering
  const containerClasses = `inline-flex items-center gap-2 sm:gap-3 ${
    centered ? 'justify-center w-full' : ''
  } ${className}`;

  // Spinner classes with improved accessibility
  const spinnerClasses = `animate-spin rounded-full border-t-transparent border-primary-600 dark:border-primary-400 ${sizeClasses[size]}`;

  return (
    <div 
      className={containerClasses}
      role="status"
      aria-live="polite"
      aria-label={ariaLabel}
    >
      <div 
        className={spinnerClasses}
        aria-hidden="true"
      />
      {text && (
        <span className={`${textSizeClasses[size]} text-dark-700 dark:text-light-300`}>
          {text}
        </span>
      )}
      {/* Screen reader only text */}
      <span className="sr-only">
        {text || ariaLabel}
      </span>
    </div>
  );
};

LoadingIndicator.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string,
  centered: PropTypes.bool,
  className: PropTypes.string,
  'aria-label': PropTypes.string,
};

export default LoadingIndicator;