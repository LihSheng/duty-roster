# Frontend Directory Structure Standards

This document outlines the standards for organizing code within the frontend directory of the Duty Roster application.

## Overview

The frontend follows a feature-based organization with shared components and utilities. This structure promotes code reusability, maintainability, and scalability.

## Directory Structure

```
frontend/
├── public/                # Static assets and HTML templates
│   ├── index.html         # Main HTML template
│   └── ...                # Other static assets
├── src/                   # Source code
│   ├── components/        # React components
│   │   ├── admin/         # Admin-related components
│   │   ├── assignments/   # Assignment-related components
│   │   ├── common/        # Shared/reusable components
│   │   ├── duties/        # Duty-related components
│   │   ├── layout/        # Layout components (navbar, sidebar, etc.)
│   │   ├── people/        # People-related components
│   │   └── theme/         # Theming components
│   ├── utils/             # Utility functions
│   ├── App.js             # Main application component
│   └── index.js           # Application entry point
├── .babelrc               # Babel configuration
├── .eslintrc.js           # Frontend-specific ESLint configuration
├── package.json           # Frontend dependencies and scripts
├── postcss.config.js      # PostCSS configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── webpack.config.js      # Webpack configuration
```

## Component Organization

### Feature-based Organization

Components are organized by feature or domain:

- `admin/` - Administrative components
- `assignments/` - Assignment management components
- `duties/` - Duty management components
- `people/` - People management components

### Common Components

Reusable components are placed in the `common/` directory:

```
components/common/
├── modal/                 # Modal components
├── ui/                    # UI components (buttons, inputs, etc.)
├── ConfirmationModal.js   # Confirmation dialog component
├── LazyDragDrop.js        # Drag and drop component
└── index.js               # Exports for common components
```

### Component Structure

Each component directory may contain:

1. Component files (`.js`)
2. Test files in a `__tests__/` subdirectory
3. Component-specific styles (if not using Tailwind)
4. Documentation (`.md` files)

Example:

```
components/duties/
├── __tests__/             # Test files
│   └── DutyList.test.js   # Tests for DutyList component
├── AddDutyModal.js        # Add duty modal component
├── DutyForm.js            # Duty form component
├── DutyList.js            # Duty list component
└── FrequencySelector.js   # Frequency selector component
```

## Testing Structure

Tests are co-located with the components they test in a `__tests__/` directory:

```
components/component-name/
├── __tests__/
│   └── ComponentName.test.js
└── ComponentName.js
```

## Styling Approach

The project uses Tailwind CSS for styling:

- Utility classes are defined in `tailwind.css`
- Component-specific styles are applied using Tailwind classes
- Custom utilities are defined in `tailwind-utilities.css`
- Custom components are defined in `tailwind-components.css`

## Best Practices

1. **Component Organization**:
   - Keep related components together
   - Use index.js files to export components from directories
   - Co-locate tests with components

2. **Code Splitting**:
   - Split large components into smaller, focused components
   - Use lazy loading for route-based code splitting

3. **State Management**:
   - Use React hooks for local state
   - Use React context for theme and global UI state
   - Consider Redux for complex application state

4. **Performance**:
   - Memoize expensive calculations with useMemo
   - Optimize re-renders with React.memo and useCallback
   - Use virtualization for long lists

5. **Accessibility**:
   - Ensure all components are accessible
   - Use semantic HTML elements
   - Include proper ARIA attributes

## Adding New Features

When adding a new feature:

1. Create a new directory in the appropriate location
2. Follow the established patterns for component structure
3. Add tests for new components
4. Update documentation if necessary
