const stylistic = require('@stylistic/eslint-plugin');

const customize = stylistic.configs.customize({
  semi: true,
  quotes: 'single',
  quoteProps: 'as-needed',
});

/** @type {import('eslint').Linter.BaseConfig} */
module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
    '@stylistic',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    ...customize.rules,
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@stylistic/jsx-quotes': ['error', 'prefer-single'],
    '@stylistic/lines-between-class-members': 'off',
  },
  globals: {
    globalThis: true,
  }
};
