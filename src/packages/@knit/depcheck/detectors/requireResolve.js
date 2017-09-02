/* @flow weak */
/* eslint-disable fp/no-arguments */

const lodash = require("lodash");

module.exports = function detectRequireResolve(node) {
  return node.type === "CallExpression" &&
  node.callee &&
  node.callee.type === "MemberExpression" &&
  node.callee.object.name === "require" &&
  node.callee.property.name === "resolve" &&
  node.arguments[0] &&
  lodash.isString(node.arguments[0].value)
    ? [node.arguments[0].value]
    : [];
};
