# Import/Export Standards

This document outlines the standards for importing and exporting modules in the Duty Roster application. Following these standards ensures consistent code organization, prevents circular dependencies, and improves code readability.

## Import Standards

### Import Order

Imports should be organized in the following order, with a blank line between each group:

1. **External/3rd party imports** (e.g., `react`, `express`, Node.js built-ins)
2. **Internal modules** (project-specific modules)
3. **Sibling or relative imports** (imports from the same directory or relative paths)

Example:

```javascript
// External/3rd party imports
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import path from 'path';

// Internal modules
import { formatDate } from '../../utils/dateUtils';
import { Button } from '../common/Button';

// Sibling or relative imports
import { UserAvatar } from './UserAvatar';
import './UserProfile.css';
```

### Import Statements

- Use ES6 import syntax for all imports
- Use named imports when importing specific exports
- Use default imports when importing the main export of a module
- Avoid using `import *` except in special cases
- Avoid using relative paths with multiple levels (e.g., `../../../utils`)

### Path Aliasing

To avoid deep relative paths, use path aliases for common directories:

```javascript
// Instead of this:
import { Button } from '../../../components/common/Button';

// Use this:
import { Button } from '@components/common/Button';
```

The following path aliases are defined:

- `@components` - `src/components`
- `@utils` - `src/utils`
- `@hooks` - `src/hooks`
- `@services` - `src/services`
- `@styles` - `src/styles`
- `@assets` - `src/assets`

## Export Standards

### Named vs. Default Exports

- **Use named exports** for utility functions, constants, and multiple exports from a single file
- **Use default exports** for React components and main module exports
- **Avoid mixing** named and default exports in the same file when possible

### Named Exports

Use named exports for utility functions, constants, and multiple exports:

```javascript
// Good - Named exports for utilities
export const formatDate = (date) => { /* ... */ };
export const parseDate = (dateString) => { /* ... */ };
export const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
```

### Default Exports

Use default exports for React components and main module exports:

```javascript
// Good - Default export for a React component
const Button = ({ children, onClick }) => {
  return <button onClick={onClick}>{children}</button>;
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
};

export default Button;
```

### Re-exporting

Use index files to re-export components and simplify imports:

```javascript
// components/common/index.js
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Modal } from './Modal';
```

This allows for cleaner imports:

```javascript
// Instead of this:
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Modal from '../components/common/Modal';

// Use this:
import { Button, Card, Modal } from '../components/common';
```

### Barrel Files

Use barrel files (index.js) to export multiple components from a directory:

```javascript
// components/common/Button/index.js
export { default } from './Button';
export * from './ButtonGroup';
```

## Preventing Circular Dependencies

To prevent circular dependencies:

1. **Organize code hierarchically**: Higher-level modules should import from lower-level modules, not vice versa
2. **Use interface segregation**: Split large modules into smaller, focused modules
3. **Use dependency injection**: Pass dependencies as parameters rather than importing them directly
4. **Create intermediate modules**: Extract shared functionality into separate modules

### Detecting Circular Dependencies

Use the `madge` tool to detect circular dependencies:

```bash
npx madge --circular --extensions js,jsx src/
```

## Best Practices

1. **Import only what you need**: Avoid importing entire modules when you only need specific parts
2. **Keep imports at the top**: Place all imports at the top of the file
3. **Sort imports alphabetically** within each group
4. **Use consistent naming**: Use consistent names for imports and exports
5. **Document public APIs**: Add JSDoc comments to exported functions and components
6. **Avoid side effects** in module imports
7. **Use absolute imports** for deep directory structures
8. **Console logging**: Console logging is allowed in the codebase for debugging purposes. While it's good practice to remove console logs before production deployment, they are not restricted by ESLint rules in this project.