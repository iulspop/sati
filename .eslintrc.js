/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: [
    '@remix-run/eslint-config',
    '@remix-run/eslint-config/node',
    'plugin:unicorn/recommended',
    'prettier',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
    'unicorn/prefer-module': 'off',
    'unicorn/filename-case': 'off',
    'unicorn/no-nested-ternary': 'off',
    'unicorn/no-array-callback-reference': 'off',
    'unicorn/no-array-for-each': 'off',
    'unicorn/no-array-reduce': 'off',
    'unicorn/prefer-node-protocol': 'off',
    'unicorn/no-null': 'off',
    'unicorn/no-useless-promise-resolve-reject': 'off',
    'unicorn/prevent-abbreviations': [
      'error',
      {
        allowList: {
          e2e: true,
          db: true,
          'remix.env.d': true,
        },
        replacements: {
          props: false,
          ref: false,
        },
      },
    ],
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      extends: ['plugin:playwright/playwright-test'],
      rules: {
        'playwright/require-top-level-describe': 'error',
      },
    },
    {
      files: ['*.test.ts', '*.test.tsx'],
      extends: ['@remix-run/eslint-config/jest-testing-library'],
      settings: {
        jest: {
          version: 27,
        },
      },
    },
  ],
}
