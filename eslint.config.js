// @ts-check
const eslint = require('@eslint/js');
const { defineConfig } = require('eslint/config');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');
const prettier = require('eslint-config-prettier/flat');

module.exports = defineConfig([
  {
    ignores: [
      'dist/',
      'coverage/',
      '.angular/',
      'node_modules/',
    ],
  },
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
      prettier,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],

      // Angular best practices
      '@angular-eslint/prefer-signals': 'warn',
      '@angular-eslint/prefer-output-readonly':
        'error',
      '@angular-eslint/no-async-lifecycle-method':
        'error',
      '@angular-eslint/use-lifecycle-interface':
        'error',

      // TypeScript
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/consistent-type-imports':
        [
          'error',
          { fixStyle: 'inline-type-imports' },
        ],
      '@typescript-eslint/explicit-member-accessibility':
        ['error', { accessibility: 'no-public' }],
      '@typescript-eslint/no-explicit-any':
        'warn',

      // General
      eqeqeq: [
        'error',
        'always',
        { null: 'ignore' },
      ],
      'no-console': [
        'warn',
        { allow: ['warn', 'error'] },
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
    },
  },
  {
    files: ['**/*.spec.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {
      '@angular-eslint/template/prefer-control-flow':
        'error',
      '@angular-eslint/template/prefer-self-closing-tags':
        'error',
      '@angular-eslint/template/no-any': 'warn',
      '@angular-eslint/template/eqeqeq': 'error',
      '@angular-eslint/template/button-has-type':
        'error',
    },
  },
]);
