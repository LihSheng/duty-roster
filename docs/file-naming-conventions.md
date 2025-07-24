# File Naming Conventions

This document outlines the file naming conventions used throughout the Duty Roster project. Consistent file naming improves code organization, searchability, and maintainability.

## General Principles

1. **Be descriptive**: Names should clearly indicate the purpose or content of the file
2. **Be consistent**: Follow established patterns within the project
3. **Use appropriate case**: Follow case conventions for different file types
4. **Keep names concise**: Avoid unnecessarily long file names

## Case Conventions

Different parts of the codebase use different case conventions:

| File Type            | Case Convention          | Example               |
| -------------------- | ------------------------ | --------------------- |
| React Components     | PascalCase               | `UserProfile.js`      |
| JavaScript Utilities | camelCase                | `dateUtils.js`        |
| Configuration Files  | kebab-case               | `webpack-config.js`   |
| CSS/SCSS Files       | kebab-case               | `button-styles.css`   |
| Test Files           | Same as source + `.test` | `UserProfile.test.js` |
| Documentation        | kebab-case               | `coding-standards.md` |
| Database Files       | snake_case               | `duty_roster.db`      |

## Directory Naming

Directories should use kebab-case for multi-word names:

```
frontend/src/components/common/
```

Exception: React component directories that contain a single component may use PascalCase to match the component name:

```
components/UserProfile/
├── UserProfile.js
├── UserProfile.test.js
└── styles.css
```

## Frontend File Naming

### React Components

- Use PascalCase for component files: `Button.js`, `UserProfile.js`
- Name files after the component they export
- For container components, use the suffix `Container`: `UserProfileContainer.js`

### Test Files

- Name test files after the file they test with a `.test.js` suffix
- Place tests in a `__tests__` directory adjacent to the files they test

```
components/common/Button/
├── __tests__/
│   └── Button.test.js
└── Button.js
```

### Utility Files

- Use camelCase for utility files: `dateUtils.js`, `formatters.js`
- Use descriptive names that indicate the purpose of the utilities

### Style Files

- Use kebab-case for style files: `button-styles.css`
- When styles are specific to a component, name them after the component: `UserProfile.css`

### Index Files

- Use `index.js` for files that export multiple components or utilities from a directory
- This enables cleaner imports: `import { Button, Card } from './components/common'`

## Backend File Naming

### Route Files

- Use camelCase for route files: `userRoutes.js`, `authRoutes.js`
- Name files after the resource they handle

### Service Files

- Use camelCase for service files: `notificationService.js`, `schedulerService.js`
- Name files after the service they provide

### Database Files

- Use camelCase for database access files: `userModel.js`, `dutyModel.js`
- Use snake_case for actual database files: `duty_roster.db`

### Middleware Files

- Use camelCase for middleware files: `authMiddleware.js`, `validationMiddleware.js`
- Name files after the middleware's purpose

## Configuration Files

- Use kebab-case for configuration files: `webpack.config.js`, `.eslintrc.js`
- Follow standard naming conventions for common configuration files

## Documentation Files

- Use kebab-case for documentation files: `coding-standards.md`, `project-setup.md`
- Use descriptive names that clearly indicate the content

## Examples

### Good Examples

```
frontend/src/components/UserProfile.js
frontend/src/components/common/Button.js
frontend/src/utils/dateUtils.js
routes/userRoutes.js
services/notificationService.js
docs/coding-standards.md
```

### Bad Examples

```
frontend/src/components/user-profile.js      // Wrong case for React component
frontend/src/components/common/button.js     // Wrong case for React component
frontend/src/utils/DateUtils.js              // Wrong case for utility file
routes/user_routes.js                        // Inconsistent with project conventions
services/NotificationService.js              // Wrong case for service file
docs/CodingStandards.md                      // Wrong case for documentation
```

## Special Cases

### Higher-Order Components (HOCs)

- Prefix with `with`: `withAuth.js`, `withTheme.js`

### Custom Hooks

- Prefix with `use`: `useForm.js`, `useAuth.js`

### Context Providers

- Suffix with `Provider` or `Context`: `AuthProvider.js`, `ThemeContext.js`
