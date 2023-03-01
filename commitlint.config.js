const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'footer-max-line-length': [0, 'always'],
    'body-max-line-length': [0, 'always'],
  },
}

// eslint-disable-next-line unicorn/prefer-module
module.exports = config
