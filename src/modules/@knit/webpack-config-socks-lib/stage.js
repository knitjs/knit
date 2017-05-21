/* @flow */

import merge from "webpack-merge";
import webpackConfig from "@knit/webpack-config-socks";
import needle from "@knit/needle";

import type { TConfig } from "@knit/webpack-config-socks";

const newConfig: TConfig = {
  output: {
    libraryTarget: "umd"
  },
  externals: Object.keys(needle.pkg.peerDependencies || {})
};

const stageWebpackConfig: TConfig = merge(webpackConfig, newConfig);

export default stageWebpackConfig;
