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
const ModalHeader = ({
	children,
	onClose,
	showCloseButton = true,
	className = '',
	id,
}) => {
	return (
		<div
			className={`px-4 sm:px-6 py-3 sm:py-4 border-b border-light-300 dark:border-dark-600 flex items-center justify-between ${className}`}
		>
			<div
				id={id}
				className='text-base sm:text-lg font-medium text-dark-900 dark:text-light-100 pr-2'
			>
				{children}
			</div>
			{showCloseButton && onClose && (
				<button
					type='button'
					onClick={onClose}
					className='text-light-500 hover:text-dark-900 dark:text-light-400 dark:hover:text-light-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-dark-800 rounded-full p-1 transition-colors duration-200 flex-shrink-0'
					aria-label='Close modal'
					data-testid='modal-close-button'
				>
					<svg
						className='h-4 w-4 sm:h-5 sm:w-5'
						xmlns='http://www.w3.org/2000/svg'
						fill='none'
						viewBox='0 0 24 24'
						stroke='currentColor'
						aria-hidden='true'
					>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M6 18L18 6M6 6l12 12'
						/>
					</svg>
				</button>
			)}
		</div>
	);
};

ModalHeader.propTypes = {
	children: PropTypes.node.isRequired,
	onClose: PropTypes.func,
	showCloseButton: PropTypes.bool,
	className: PropTypes.string,
	id: PropTypes.string,
};

export default ModalHeader;
