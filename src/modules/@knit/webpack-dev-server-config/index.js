/* @flow */

const merge = require("webpack-merge");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const needle = require("@knit/needle");
const webpackConfig = require("@knit/webpack-config-socks-app");

const webpackDevServerConfig = {
  contentBase: needle.paths.rootDir,
  historyApiFallback: true,
  stats: {
    colors: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    modules: false
  },
  compress: true
};

const config = merge(webpackConfig, {
  devServer: webpackDevServerConfig,
  performance: {
    hints: false
  },
  output: {
    pathinfo: true,
    publicPath: "/"
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(needle.paths.src, "index.html")
    })
  ]
});

module.exports = config;
