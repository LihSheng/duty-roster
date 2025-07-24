module.exports = {
  root: false, // Use parent config as base
  env: {
    browser: true,
    node: false,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx'],
        paths: ['src'],
      },
      webpack: {
        config: './webpack.config.js',
      },
      alias: {
        map: [
          ['@components', './src/components'],
          ['@utils', './src/utils'],
          ['@hooks', './src/hooks'],
          ['@services', './src/services'],
          ['@styles', './src/styles'],
          ['@assets', './src/assets'],
        ],
        extensions: ['.js', '.jsx'],
      },
    },
  },
  rules: {
    // Frontend specific rules
    'react/jsx-filename-extension': ['error', { extensions: ['.jsx'] }],
    'react/jsx-pascal-case': 'error',
    'react/jsx-closing-bracket-location': ['error', 'line-aligned'],
    'react/jsx-closing-tag-location': 'error',
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-key': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
    'react/no-array-index-key': 'warn',
    'react/no-direct-mutation-state': 'error',
    'react/no-unescaped-entities': 'error',
    'react/self-closing-comp': 'error',
    
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
  },
};
