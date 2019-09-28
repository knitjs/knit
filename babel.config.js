module.exports = {
  presets: [
    "@babel/preset-flow",
    ["@babel/preset-env", { targets: { node: 6 } }]
  ],
  plugins: [
    // ["transform-object-rest-spread", { useBuiltIns: true }],
    // "transform-flow-strip-types",
    // "transform-runtime",
    "add-module-exports",
    ["array-includes", { useBuiltIns: true }]
  ]
};
