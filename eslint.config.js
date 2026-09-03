'use strict';

const js = require('@eslint/js');
const globals = require('globals');
const stylistic = require('@stylistic/eslint-plugin');

module.exports = [
  {
    ignores: ['encoding.js', 'encoding.min.js']
  },
  js.configs.recommended,
  {
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    plugins: {
      '@stylistic': stylistic
    },
    languageOptions: {
      // Use "ecmaVersion: 5" because the source is hand-written in ES5
      // without any transpilation and released as-is.
      ecmaVersion: 5,
      sourceType: 'script',
      parserOptions: {
        ecmaFeatures: {
          globalReturn: true,
          // Keep the source compatible with strict mode for ESM bundling
          impliedStrict: true
        }
      },
      globals: {
        ...globals.es2015,
        ...globals.browser,
        ...globals.node
      }
    },
    rules: {
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/indent': [
        'error',
        2,
        {
          ArrayExpression: 1,
          ignoreComments: true,
          ignoredNodes: ['ConditionalExpression'],
          MemberExpression: 1,
          ObjectExpression: 1,
          outerIIFEBody: 'off',
          SwitchCase: 1,
          VariableDeclarator: 'first'
        }
      ],
      '@stylistic/key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true
        }
      ],
      '@stylistic/keyword-spacing': 'error',
      '@stylistic/max-len': [
        'error',
        {
          code: 120,
          tabWidth: 2,
          ignoreUrls: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreRegExpLiterals: true
        }
      ],
      '@stylistic/no-mixed-spaces-and-tabs': 'error',
      '@stylistic/no-multiple-empty-lines': ['error', { max: 2 }],
      '@stylistic/no-tabs': 'error',
      '@stylistic/object-curly-spacing': ['error', 'always', { objectsInObjects: false }],
      '@stylistic/quotes': ['error', 'single', { allowTemplateLiterals: 'always', avoidEscape: true }],
      '@stylistic/quote-props': ['error', 'consistent-as-needed', { keywords: true }],
      '@stylistic/semi': 'error',
      '@stylistic/space-infix-ops': 'error',
      '@stylistic/space-unary-ops': 'error',
      'no-console': 'warn',
      'no-empty': 'off',
      'no-undef': 'error',
      'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
      'no-useless-escape': 'warn'
    }
  },
  {
    files: ['tests/**/*.js', 'eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.mocha
      }
    }
  }
];
