const globals = require('globals');
const js = require('@eslint/js');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');
const importPlugin = require('eslint-plugin-import');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');

// Define custom rules
const customRules = {
  'prefer-direct-return': {
    meta: {
      type: 'suggestion',
      docs: {
        description: 'Enforce direct return syntax for simple components',
        category: 'Stylistic Issues',
        recommended: false,
      },
      fixable: 'code',
      schema: [],
    },
    create: function (context) {
      return {
        ArrowFunctionExpression(node) {
          // Only check arrow functions with block bodies
          if (node.body.type !== 'BlockStatement') {
            return;
          }

          const body = node.body.body;
          
          // Check if the function body consists of a single return statement
          if (body.length === 1 && body[0].type === 'ReturnStatement') {
            const returnStatement = body[0];
            
            // Check if the return statement has a JSX expression
            if (returnStatement.argument && 
                (returnStatement.argument.type === 'JSXElement' || 
                 returnStatement.argument.type === 'JSXFragment')) {
              
              context.report({
                node,
                message: 'Use direct return syntax for simple components',
                fix: function (fixer) {
                  const sourceCode = context.getSourceCode();
                  const arrowToken = sourceCode.getTokenBefore(node.body);
                  const blockStart = sourceCode.getTokenAfter(arrowToken);
                  const blockEnd = sourceCode.getLastToken(node.body);
                  const returnToken = sourceCode.getFirstToken(returnStatement);
                  
                  // Replace "=> { return jsx; }" with "=> (jsx)"
                  return [
                    fixer.replaceTextRange([arrowToken.range[1], returnToken.range[1]], ' ('),
                    fixer.replaceTextRange([returnStatement.argument.range[1], blockEnd.range[1]], ')')
                  ];
                }
              });
            }
          }
        }
      };
    }
  }
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
      custom: { rules: { 'prefer-direct-return': customRules['prefer-direct-return'] } }
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
      'no-console': ['warn', { allow: ['warn', 'error'] }],
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

      // React specific rules
      'react/prop-types': 'error',
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      // Import rules
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],

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