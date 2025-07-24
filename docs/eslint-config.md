# ESLint Configuration Guide

This document explains the ESLint configuration used in the Duty Roster project.

## Overview

Our ESLint configuration enforces consistent coding standards across both frontend and backend code. It includes:

- Base JavaScript best practices
- React-specific rules
- Import/export ordering
- Accessibility standards

## Configuration Files

- `.eslintrc.js` - Root configuration for the entire project
- `frontend/.eslintrc.js` - Frontend-specific configuration
- `.eslintignore` - Files and directories to exclude from linting

## Key Rules

### JavaScript Rules

- No console logs (except warnings and errors)
- No unused variables
- No duplicate imports
- Use const/let instead of var
- Prefer const over let when possible

### React Rules

- Enforce prop types
- Enforce React Hooks rules
- Proper JSX formatting and indentation
- Self-closing components when appropriate

### Import Rules

- Organized imports by type (built-in, external, internal)
- Alphabetical ordering
- Newlines between import groups

### Accessibility Rules

- Require alt text for images
- Proper ARIA attributes
- Valid anchor content

## Usage

Run the following npm scripts to lint your code:

```bash
# Lint entire project
npm run lint

# Automatically fix linting issues
npm run lint:fix

# Lint only backend code
npm run lint:backend

# Lint only frontend code
npm run lint:frontend
```

## Customization

To customize the ESLint configuration:

1. Edit the `.eslintrc.js` file for project-wide changes
2. Edit the `frontend/.eslintrc.js` file for frontend-specific changes

## Adding New Rules

When adding new rules, consider:

- Is it essential for code quality?
- Will it cause excessive noise?
- Is it aligned with the team's coding style?

Document any significant rule changes in this file.
