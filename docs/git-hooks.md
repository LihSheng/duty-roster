# Git Hooks Configuration

This project uses Git hooks to enforce code quality standards before commits are made. This ensures that all code in the repository follows the established formatting and linting rules.

## Pre-commit Hook

The pre-commit hook runs automatically when you attempt to make a commit. It performs the following checks:

1. **Lint-staged**: Checks and fixes formatting and linting issues in the staged files
2. **ESLint**: Ensures there are no ESLint errors in the entire project
3. **Prettier**: Verifies that all files follow the Prettier formatting rules

If any of these checks fail, the commit will be blocked, and you'll need to fix the issues before you can commit your changes.

## How to Use

You don't need to do anything special to use these hooks. They will run automatically when you commit changes.

If a commit is blocked due to formatting or linting issues:

1. Read the error messages to understand what needs to be fixed
2. Run `npm run format` to automatically fix most formatting issues
3. Run `npm run lint:fix` to automatically fix most linting issues
4. Fix any remaining issues manually
5. Try committing again

## Bypassing Hooks (Not Recommended)

In rare cases, you might need to bypass the pre-commit hooks. You can do this by using the `--no-verify` flag:

```bash
git commit -m "Your commit message" --no-verify
```

**Warning**: This is not recommended as it defeats the purpose of having these checks in place.

## Setup on a New Machine

When you clone this repository on a new machine, you need to:

1. Run `npm install` to install all dependencies
2. The hooks should be automatically set up by the `prepare` script in package.json

If the hooks are not working, you can manually set them up:

```bash
npx husky init
```

## Troubleshooting

If you encounter issues with the Git hooks:

1. Make sure Husky is installed: `npm install husky --save-dev`
2. Make sure the hooks are executable: `attrib +x .husky/pre-commit` (Windows) or `chmod +x .husky/pre-commit` (Unix)
3. Check that the hooks are properly configured in the `.husky` directory
4. Verify that the `prepare` script is in your package.json