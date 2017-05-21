/* @flow */

import type { TConfig } from "@knit/webpack-config-socks";

const webpackConfig: TConfig = process.env.NODE_ENV === "production"
  ? require("./production")
  : require("./stage");

export default webpackConfig;
