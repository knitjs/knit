/* @flow weak */

const babel = require("babylon");

const babelParser = content =>
  babel.parse(content, {
    sourceType: "module",
    plugins: [
      "jsx",
      "flow",
      "doExpressions",
      "objectRestSpread",
      "decorators",
      "classProperties",
      "exportExtensions",
      "asyncGenerators",
      "functionBind",
      "functionSent",
      "dynamicImport"
    ]
  });

module.exports = babelParser;
