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
}) => {
  // Size classes for the spinner
  const sizeClasses = {
    small: 'w-4 h-4 border-2',
    medium: 'w-6 h-6 border-2',
    large: 'w-8 h-8 border-3',
  };

  // Text size classes
  const textSizeClasses = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  // Container classes
  const containerClasses = `inline-flex items-center ${centered ? 'justify-center' : ''} ${className}`;

  return (
    <div className={containerClasses}>
      <div className={`animate-spin rounded-full border-t-transparent border-primary-600 ${sizeClasses[size]}`} />
      {text && (
        <span className={`ml-2 ${textSizeClasses[size]}`}>
          {text}
        </span>
      )}
    </div>
  );
};

LoadingIndicator.propTypes = {
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  text: PropTypes.string,
  centered: PropTypes.bool,
  className: PropTypes.string,
};

export default LoadingIndicator;