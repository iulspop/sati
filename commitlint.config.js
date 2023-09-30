const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'footer-max-line-length': [0, 'always'],
    'body-max-line-length': [0, 'always'],
    'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'devx']],
  },
}

module.exports = config
