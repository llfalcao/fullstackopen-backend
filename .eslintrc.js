module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    indent: ['error', 2, { ignoredNodes: ['TemplateLiteral > *'] }],
    'linebreak-style': ['error', 'unix'],
    semi: ['error', 'always'],
    eqeqeq: 'error',
    'no-console': 0,
  },
};
