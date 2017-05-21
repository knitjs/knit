/* @flow */

import merge from "webpack-merge";

import type { TConfig } from "@knit/webpack-config-socks";

import webpackConfig from "./stage";

const newConfig: TConfig = {
  output: {
    filename: "[name].[hash].min.js"
  }
};

const prodWebpackConfig: TConfig = merge(webpackConfig, newConfig);

export default prodWebpackConfig;
