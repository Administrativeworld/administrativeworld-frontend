import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginJsxA11y from 'eslint-plugin-jsx-a11y';
import eslintPluginImport from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import prettierConfig from './.prettierrc.json';

export default [
  {
    ignores: ['dist', 'build', 'node_modules'],
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: { // Add known globals if needed
        React: 'readonly',
        JSX: 'readonly',
      },
    },
    plugins: {
      react: eslintPluginReact,
      'jsx-a11y': eslintPluginJsxA11y,
      import: eslintPluginImport,
      prettier: eslintPluginPrettier,
    },
    rules: {
      // 👉 Core ESLint Recommended Rules
      ...require('eslint/use-at-your-own-risk').recommended.rules,

      // React Recommended Rules
      ...eslintPluginReact.configs.recommended.rules,

      // Additional Rules
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      'import/order': ['warn', { 'newlines-between': 'always' }],
      'import/no-unresolved': 'error',

      // Accessibility Rules
      ...eslintPluginJsxA11y.configs.recommended.rules,

      // Prettier Integration
      'prettier/prettier': ['error', prettierConfig],
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
