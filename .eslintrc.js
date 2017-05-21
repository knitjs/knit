/* @flow */

module.exports = {
  extends: [
    'google',
    'plugin:flowtype/recommended',
    'prettier',
    'prettier/flowtype',
  ],
  'plugins':


  [
    'prettier',
    'flowtype',
  ],
  parserOptions:      {
    'ecmaVersion': 2016, 'sourceType': 'module',
    'ecmaFeatures': {
      jsx: true,
    },
  },
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  rules: {
    'no-throw-literal': 0,
    "prettier/prettier": "error"
  }
};
