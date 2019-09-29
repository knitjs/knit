module.exports = {
  presets: [
    "@babel/preset-flow",
    ["@babel/preset-env", { targets: { node: 12 } }]
  ],
  plugins: ["add-module-exports", ["array-includes", { useBuiltIns: true }]],
  babelrcRoots: [".", "src/packages/*"]
};
