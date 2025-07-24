const globals = require('globals');
const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');

// Import custom rules
const preferDirectReturn = require('./scripts/eslint-rules/prefer-direct-return');
const consistentExports = require('./scripts/eslint-rules/consistent-exports');

// Define custom rules
const customRules = {
  'prefer-direct-return': preferDirectReturn,
  'consistent-exports': consistentExports
};

module.exports = [
  js.configs.recommended,
  {
    ignores: [
      // Dependencies
      '**/node_modules/**',
      
      // Build outputs
      '**/frontend/build/**',
      '**/frontend/dist/**',
      '**/build/**',
      '**/dist/**',
      
      // Configuration files
      '**/webpack.config.js',
      '**/babel.config.js',
      '**/postcss.config.js',
      '**/tailwind.config.js',
      
      // Database files
      '**/*.db',
      
      // Other
      '**/.git/**',
      '**/coverage/**'
    ],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2021,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      import: importPlugin,
      'jsx-a11y': jsxA11yPlugin,
      // Add custom rules
      custom: { 
        rules: { 
          'prefer-direct-return': customRules['prefer-direct-return'],
          'consistent-exports': customRules['consistent-exports']
        } 
      }
    },
    settings: {
      react: {
        version: 'detect',
      },
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
    },
    rules: {
      // Essential rules
      // 'no-console' rule removed to allow console logging
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-duplicate-imports': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'func-style': ['error', 'expression', { allowArrowFunctions: true }],
      'padding-line-between-statements': [
        'error',
        { blankLine: 'always', prev: '*', next: 'return' },
      ],
      // Custom rules
      'custom/prefer-direct-return': 'error', // Use direct return syntax for simple components
      'custom/consistent-exports': 'error', // Enforce consistent export patterns

      // React specific rules
      'react/prop-types': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import/Export rules
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index', 'object', 'type']
          ],
          pathGroups: [
            {
              pattern: '*.{css,scss,less,png,jpg,svg}',
              group: 'sibling',
              position: 'after',
            }
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
      'import/no-cycle': 'error', // Prevent circular dependencies
      'import/no-unresolved': 'error', // Ensure imports point to a file/module that can be resolved
      'import/named': 'error', // Ensure named imports correspond to named exports
      'import/default': 'error', // Ensure default import corresponds to a default export
      'import/namespace': 'error', // Ensure imported namespaces contain the referenced properties
      'import/no-duplicates': 'error', // Prevent importing the same module multiple times
      'import/no-useless-path-segments': 'error', // Prevent unnecessary path segments in import statements
      'import/exports-last': 'error', // Ensure all exports are at the end of the file
      'import/first': 'error', // Ensure all imports are at the top of the file
      'import/no-anonymous-default-export': 'error', // Prevent anonymous default exports
      'import/no-mutable-exports': 'error', // Prevent exporting mutable variables

      // Accessibility rules
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/anchor-has-content': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-role': 'error',
    },
  },
  {
    // Backend Node.js files
    files: [
      'server.js',
      'routes/**/*.js',
      'services/**/*.js',
      'database/**/*.js',
      'scripts/**/*.js',
    ],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Disable React-specific rules for backend files
      'react/prop-types': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'off',
      'react-hooks/rules-of-hooks': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'jsx-a11y/alt-text': 'off',
    },
  },
];