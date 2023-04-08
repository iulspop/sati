module.exports = {
  printWidth: 120,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  trailingComma: 'es5',
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: false,
  embeddedLanguageFormatting: 'off',
  proseWrap: 'preserve',
  htmlWhitespaceSensitivity: 'css',
  requirePragma: false,
  insertPragma: false,
  jsxSingleQuote: false,
  plugins: [require('prettier-plugin-tailwindcss')],
  quoteProps: 'as-needed',
}
