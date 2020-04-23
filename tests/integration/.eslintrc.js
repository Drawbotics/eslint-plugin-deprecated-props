module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['eslint-plugin-deprecated-props'],
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['off'],
    // Deprecation
    'deprecated-props/deprecated-props': ['warn'],
  },
};
