/* @flow */

module.exports = {
  extends: ['airbnb', '@knit/socks'],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      generators: true,
      experimentalObjectRestSpread: true,
    },
  },
  env: {
    browser: true,
    jest: true,
  },
  rules: {
    // ###  react
    // we just use js for everything
    'react/jsx-filename-extension': 0,
    // this seems to ignore flow type
    'react/no-unused-prop-types': 0,

    // ###  jsx-a11y
    // doesn't check props for children
    'jsx-a11y/anchor-has-content': 0,

    // ### flowtyped
    'flowtype/require-valid-file-annotation': [2, 'always'],
    'flowtype/require-parameter-type': [2, {
      excludeArrowFunctions: true,
    }],
    'flowtype/require-return-type': [2, 'always', {
      annotateUndefined: 'always',
      excludeArrowFunctions: true,
    }],
  },
  plugins: [
    'react',
    'jsx',
    'jsx-a11y',
  ],
};
