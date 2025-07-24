# Component Structure Standards

This document outlines the standards for structuring React components in the Duty Roster application. Following these standards ensures consistency, maintainability, and readability across the codebase.

## Component File Organization

### Directory Structure

Components should be organized according to the following patterns:

#### Single File Component

For simple components with minimal logic:

```
components/
└── ComponentName.js
```

#### Component with Tests

For components with associated tests:

```
components/
├── ComponentName.js
└── __tests__/
    └── ComponentName.test.js
```

#### Complex Component with Multiple Files

For complex components with multiple associated files:

```
components/ComponentName/
├── index.js                 # Exports the main component
├── ComponentName.js         # Main component implementation
├── ComponentName.css        # Component-specific styles (if not using Tailwind)
├── SubComponent.js          # Related sub-components
├── useComponentLogic.js     # Custom hooks specific to this component
└── __tests__/
    ├── ComponentName.test.js
    └── SubComponent.test.js
```

### Index Files

Use `index.js` files to:
1. Export components from directories
2. Simplify imports
3. Create barrel exports for related components

Example:

```javascript
// components/common/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
```

This allows for cleaner imports:

```javascript
import { Button, Card, Modal } from 'components/common';
```

## Component File Templates

### Functional Component Template

```jsx
import React from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description of the component's purpose
 *
 * @param {Object} props - Component props
 * @param {string} props.propName - Description of the prop
 * @returns {JSX.Element} - Rendered component
 */
const ComponentName = ({ propName, children }) => {
  // Component logic here
  
  return (
    <div className="component-class">
      {/* Component JSX here */}
      <h1>{propName}</h1>
      {children}
    </div>
  );
};

ComponentName.propTypes = {
  propName: PropTypes.string.isRequired,
  children: PropTypes.node,
};

ComponentName.defaultProps = {
  children: null,
};

export default ComponentName;
```

### Container Component Template

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Import related components
import ComponentView from './ComponentView';

/**
 * ComponentContainer - Container component that manages state and logic
 *
 * @param {Object} props - Component props
 * @param {string} props.initialData - Initial data for the component
 * @returns {JSX.Element} - Rendered component
 */
const ComponentContainer = ({ initialData }) => {
  // State management
  const [data, setData] = useState(initialData);
  
  // Side effects
  useEffect(() => {
    // Effect logic here
    const fetchData = async () => {
      // Fetch data logic
    };
    
    fetchData();
  }, []);
  
  // Event handlers
  const handleAction = () => {
    // Handle action logic
  };
  
  // Render the presentational component with props
  return (
    <ComponentView 
      data={data}
      onAction={handleAction}
    />
  );
};

ComponentContainer.propTypes = {
  initialData: PropTypes.string.isRequired,
};

export default ComponentContainer;
```

### Custom Hook Template

```jsx
import { useState, useEffect } from 'react';

/**
 * useComponentLogic - Custom hook for component logic
 *
 * @param {string} initialValue - Initial value for the hook
 * @returns {Object} - Hook state and methods
 */
const useComponentLogic = (initialValue) => {
  // State management
  const [value, setValue] = useState(initialValue);
  
  // Side effects
  useEffect(() => {
    // Effect logic here
  }, [initialValue]);
  
  // Methods
  const updateValue = (newValue) => {
    setValue(newValue);
  };
  
  // Return state and methods
  return {
    value,
    updateValue,
  };
};

export default useComponentLogic;
```

## Component Props Standards

### Props Documentation

All component props should be documented using JSDoc comments:

```jsx
/**
 * ComponentName - Component description
 *
 * @param {Object} props - Component props
 * @param {string} props.name - User's name
 * @param {number} props.age - User's age
 * @param {Function} props.onClick - Click handler function
 * @param {React.ReactNode} props.children - Child elements
 * @returns {JSX.Element} - Rendered component
 */
```

### PropTypes Definition

Always define PropTypes for all props:

```jsx
ComponentName.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  onClick: PropTypes.func.isRequired,
  children: PropTypes.node,
};
```

### Default Props

Define default values for optional props:

```jsx
ComponentName.defaultProps = {
  age: 30,
  children: null,
};
```

### Props Naming Conventions

- Use descriptive names that clearly indicate the prop's purpose
- Use camelCase for prop names
- Use consistent naming patterns:
  - Boolean props should start with `is`, `has`, or `should`: `isDisabled`, `hasError`
  - Event handler props should start with `on`: `onClick`, `onSubmit`
  - Render props should start with `render`: `renderItem`, `renderHeader`

## Component Lifecycle and Hooks

### Hooks Order

When using multiple hooks, follow this order:

1. `useState`
2. `useReducer`
3. `useContext`
4. `useRef`
5. `useCallback`
6. `useMemo`
7. `useEffect` (with empty dependency array)
8. `useEffect` (with dependencies)
9. Custom hooks

Example:

```jsx
const ComponentName = ({ prop }) => {
  // 1. State hooks
  const [count, setCount] = useState(0);
  
  // 2. Reducer hooks
  const [state, dispatch] = useReducer(reducer, initialState);
  
  // 3. Context hooks
  const theme = useContext(ThemeContext);
  
  // 4. Ref hooks
  const inputRef = useRef(null);
  
  // 5. Callback hooks
  const handleClick = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  
  // 6. Memo hooks
  const expensiveValue = useMemo(() => {
    return computeExpensiveValue(prop);
  }, [prop]);
  
  // 7. Effect hooks with empty dependency array
  useEffect(() => {
    // Run once on mount
    document.title = 'Component Mounted';
    
    // Cleanup on unmount
    return () => {
      document.title = 'Component Unmounted';
    };
  }, []);
  
  // 8. Effect hooks with dependencies
  useEffect(() => {
    // Run when count changes
    console.log(`Count changed to ${count}`);
  }, [count]);
  
  // Component render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### Effect Cleanup

Always include cleanup functions in useEffect when necessary:

```jsx
useEffect(() => {
  const subscription = subscribeToData(id);
  
  // Cleanup function
  return () => {
    subscription.unsubscribe();
  };
}, [id]);
```

### Component Organization

Organize component code in the following order:

1. Imports
2. Component definition
   - State hooks
   - Effect hooks
   - Event handlers
   - Helper functions
   - Render methods/JSX
3. PropTypes and defaultProps
4. Export statement

## Component Creation

### Using the Component Generator Script

The project includes a component generator script that creates new components based on the templates defined in this document.

Usage:
```bash
node scripts/create-component.js [component-name] [component-type] [directory]
```

Parameters:
- `component-name`: Name of the component (will be converted to PascalCase)
- `component-type`: Type of component to create (functional, container, or hook)
- `directory`: Directory where the component should be created (relative to frontend/src)

Examples:
```bash
# Create a functional component
node scripts/create-component.js Button functional components/common/ui

# Create a container component
node scripts/create-component.js UserProfile container components/users

# Create a custom hook
node scripts/create-component.js useAuth hook hooks
```

The script will:
1. Create the component file based on the appropriate template
2. Create a test file for the component
3. Create necessary directories if they don't exist

## Best Practices

### Component Composition

- Prefer composition over inheritance
- Break large components into smaller, focused components
- Use children props to create flexible, reusable components

### Performance Optimization

- Memoize expensive calculations with `useMemo`
- Memoize callback functions with `useCallback`
- Use `React.memo` for components that render often but with the same props
- Avoid unnecessary re-renders by keeping component state minimal

### Accessibility

- Use semantic HTML elements
- Include proper ARIA attributes
- Ensure keyboard navigation works
- Test with screen readers

### Testing

- Write tests for all components
- Test component rendering
- Test user interactions
- Test edge cases and error states

## Examples

### Good Component Example

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * UserProfile - Displays user profile information
 *
 * @param {Object} props - Component props
 * @param {Object} props.user - User data object
 * @param {string} props.user.name - User's name
 * @param {string} props.user.email - User's email
 * @param {Function} props.onUpdate - Handler for profile updates
 * @returns {JSX.Element} - Rendered component
 */
const UserProfile = ({ user, onUpdate }) => {
  // State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  
  // Effects
  useEffect(() => {
    // Reset form data when user changes
    setFormData({ ...user });
  }, [user]);
  
  // Event handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(formData);
    setIsEditing(false);
  };
  
  // Render helpers
  const renderForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 border rounded-md text-gray-700"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Save
        </button>
      </div>
    </form>
  );
  
  const renderProfile = () => (
    <div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">Name</h3>
        <p className="mt-1 text-sm text-gray-900">{user.name}</p>
      </div>
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700">Email</h3>
        <p className="mt-1 text-sm text-gray-900">{user.email}</p>
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="px-4 py-2 bg-gray-200 rounded-md text-gray-700"
        >
          Edit
        </button>
      </div>
    </div>
  );
  
  // Main render
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">User Profile</h2>
      {isEditing ? renderForm() : renderProfile()}
    </div>
  );
};

UserProfile.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
};

export default UserProfile;
```