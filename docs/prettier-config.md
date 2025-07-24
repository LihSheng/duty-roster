# Prettier Configuration

This document describes the Prettier configuration used in this project for consistent code formatting.

## Overview

Prettier is an opinionated code formatter that enforces a consistent style by parsing your code and reprinting it with its own rules. We use Prettier in conjunction with ESLint to ensure both code quality and consistent formatting.

## Configuration

The Prettier configuration is defined in `.prettierrc.js` at the root of the project. The frontend directory uses the same configuration through a reference to the root config.

### Key Settings

- **printWidth**: 100 - Line length that Prettier will wrap on
- **tabWidth**: 2 - Number of spaces per indentation level
- **useTabs**: false - Use spaces instead of tabs
- **semi**: true - Add semicolons at the end of statements
- **singleQuote**: true - Use single quotes instead of double quotes
- **trailingComma**: "es5" - Add trailing commas where valid in ES5
- **bracketSpacing**: true - Print spaces between brackets in object literals
- **bracketSameLine**: false - Put the `>` of a multi-line JSX element at the end of the last line
- **arrowParens**: "always" - Always include parentheses around a sole arrow function parameter

## Coding Style Rules

In addition to Prettier's formatting, we enforce the following coding style rules through ESLint:

1. **Arrow Functions**: Use arrow functions instead of function expressions
2. **Function Parameters**: Always keep parentheses around arrow function parameters, even when there's only one
3. **Return Statements**: Always leave one blank line before return statements
4. **Direct Return Syntax**: Use direct return syntax (parentheses instead of curly braces and return keyword) for components or functions that only return JSX without additional logic

Examples:

### Arrow Functions and Return Statements

```javascript
// ✅ Good
const calculateTotal = (items) => {
  const sum = items.reduce((total, item) => total + item.price, 0);

  return sum * 1.1; // With tax
};

// ❌ Bad
const calculateTotal = (items) => {
  const sum = items.reduce((total, item) => total + item.price, 0);
  return sum * 1.1; // With tax
};

// ❌ Bad
function calculateTotal(items) {
  const sum = items.reduce(function (total, item) {
    return total + item.price;
  }, 0);
  return sum * 1.1;
}
```

### Direct Return Syntax

```javascript
// ✅ Good - Direct return syntax for simple components
const Button = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="btn">
    {children}
  </button>
);

// ❌ Bad - Unnecessary block and return statement
const Button = ({ onClick, children }) => {
  return (
    <button type="button" onClick={onClick} className="btn">
      {children}
    </button>
  );
};

// ✅ Good - Block syntax when additional logic is needed
const SubmitButton = ({ isSubmitting, onClick, children }) => {
  const handleClick = (e) => {
    if (!isSubmitting) {
      onClick(e);
    }
  };

  return (
    <button type="submit" onClick={handleClick} disabled={isSubmitting}>
      {isSubmitting ? 'Submitting...' : children}
    </button>
  );
};
```

## Integration with ESLint

Prettier is integrated with ESLint using:

1. `eslint-config-prettier` - Turns off all ESLint rules that might conflict with Prettier
2. `eslint-plugin-prettier` - Runs Prettier as an ESLint rule

This integration is configured in `.eslintrc.js` with:

```javascript
{
  "extends": [
    // other extends...
    "plugin:prettier/recommended"
  ],
  "plugins": [
    // other plugins...
    "prettier"
  ],
  "rules": {
    "prettier/prettier": "error",
    "prefer-arrow-callback": "error",
    "func-style": ["error", "expression", { "allowArrowFunctions": true }],
    "padding-line-between-statements": ["error", { "blankLine": "always", "prev": "*", "next": "return" }],
    // other rules...
  }
}
```

## Editor Integration

### VS Code

For VS Code users, we recommend installing the Prettier extension. The workspace settings in `.vscode/settings.json` are configured to:

- Format on save
- Use Prettier as the default formatter for JavaScript, JSX, JSON, CSS, and HTML files
- Run ESLint fixes on save

## Usage

### Format All Files

To format all files in the project:

```bash
npm run format
```

### Check Formatting

To check if files are formatted correctly without changing them:

```bash
npm run format:check
```

### Format on Save

With the recommended editor configuration, files will be automatically formatted when you save them.

## Ignoring Files

Some files are excluded from formatting. These are defined in `.prettierignore` files at the root and in the frontend directory.

## Troubleshooting

If you encounter formatting issues:

1. Make sure you have the Prettier extension installed in your editor
2. Check that the file isn't listed in `.prettierignore`
3. Try running `npm run format` manually
4. If conflicts persist between ESLint and Prettier, run `npm run lint:fix` followed by `npm run format`
