module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: [
    "shorthand-pl",
    "eslint-plugin-test",
    "@ns",
    "@ns/shorthand-pl",
    "@ns/eslint-plugin-test",

    "@typescript-eslint"
  ],
  extends: [
    "shorthand-ex",
    "eslint-config-test",
    "@ns",
    "@ns/shorthand-ex",
    "@ns/eslint-config-test",
    "module/extend",
    "module/ignore-this",
    "@ns/module/extend",
    "@ns/module/ignore-this",

    "plugin:module/extends",
    "plugin:@ns/module/extends",

    "plugin:@foo/foo/recommended",
    "plugin:@bar/recommended",
    "plugin:prettier/recommended",
    "prettier/flowtype",
    "prettier/react",
    "prettier/standard",
    "prettier/@typescript-eslint",

    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking"
  ]
};
