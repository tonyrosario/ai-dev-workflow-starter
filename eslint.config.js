export default [
  {
    ignores: ['node_modules/**'],
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': 'error',
      'no-undef': 'error',
    },
  },
];
