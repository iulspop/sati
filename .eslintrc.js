/**
 * @type {import('@types/eslint').Linter.BaseConfig}
 */
module.exports = {
  extends: ['@remix-run/eslint-config', '@remix-run/eslint-config/node', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': 'error',
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
