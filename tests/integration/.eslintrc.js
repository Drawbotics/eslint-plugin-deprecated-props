module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@drawbotics/eslint-plugin-deprecated-props'],
  parserOptions: {
    sourceType: 'module',
    project: 'tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['off'],
    // Deprecation
    '@drawbotics/deprecated-props/deprecated-props': ['warn'],
  },
};
