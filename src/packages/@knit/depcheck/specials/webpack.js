/* @flow */

import path from "path";

import type { TParser } from "..";

export type TLoader = {|
  loader?: string,
  loaders?: Array<string>
|};

export type TRule = {|
  loader?: string,
  use?: Array<string>
|};

export type TConfig = {|
  module?: {
    rules?: Array<TRule>,
    preLoaders?: Array<TLoader>,
    loaders?: Array<TLoader>,
    postLoaders?: Array<TLoader>,
    noParse?: Array<RegExp>
  }
|};

type TExtractLoaders = (i: TLoader | TRule) => Array<string>;
const extractLoaders: TExtractLoaders = item => {
  let loaders = [];
  if (item.loader) {
    loaders = loaders.concat(item.loader.split("!"));
  } else if (item.loaders) {
    loaders = loaders.concat(item.loaders);
  } else if (item.use) {
    loaders = loaders.concat(item.use);
  }

  return loaders;
};

type TStripQueryParameter = (l: string) => string;
const stripQueryParameter: TStripQueryParameter = loader =>
  loader.split("?")[0];

// webpack v1 auto-loads loaders with the `-loader` suffix
type TNormalizeLoader = (l: string) => string;
const normalizeLoader: TNormalizeLoader = loader =>
  `${loader.split("-")[0]}-loader`;

type TGetLoaders = (d: Array<string>, l: ?Array<TLoader>) => Array<string>;
const getLoaders: TGetLoaders = (deps, loaders) =>
  (loaders || [])
    .map(extractLoaders)
    .reduce((acc, x) => acc.concat(x), [])
    .map(stripQueryParameter)
    .map(normalizeLoader)
    .filter(Boolean)
    .reduce((acc, x) => (acc.includes(x) ? acc : acc.concat(x)), []);

// webpack v2 does not auto-loads loaders with the `-loader` suffix
// but allows the user to set an array of suffixes
type TNormalizeRule = (r: string, e: ?Array<string>) => Array<string>;
const normalizeRule: TNormalizeRule = (rule, exts) => {
  const loaders = [rule];

  (exts || []).forEach(e => {
    loaders.push([rule, e].join("-"));
  });

  return loaders;
};

type TGetRules = (
  ds: Array<string>,
  rs: ?Array<TRule>,
  es: ?Array<string>
) => Array<string>;
const getRules: TGetRules = (deps, rules, exts) =>
  (rules || [])
    .map(extractLoaders)
    .reduce((acc, x) => acc.concat(x), [])
    .map(stripQueryParameter)
    .map(rule => normalizeRule(rule, exts))
    .reduce((acc, x) => acc.concat(x), [])
    .filter(Boolean)
    .reduce((acc, x) => (acc.includes(x) ? acc : acc.concat(x)), []);

const parser: TParser = (content, filename, deps, rootDir) => {
  if (
    path.basename(rootDir).includes("webpack-config") &&
    path.extname(filename) === ".js"
  ) {
    // $FlowIgnore
    const webpackConfig: TConfig = require(filename);
    const module = webpackConfig.module || {};

    // v1
    const loaders = getLoaders(deps, module.loaders);
    const preLoaders = getLoaders(deps, module.preLoaders);
    const postLoaders = getLoaders(deps, module.postLoaders);

    // v2
    const rules = getRules(
      deps,
      module.rules,
      (webpackConfig.resolveLoader || {}).moduleExtensions
    );

    return rules
      .concat(loaders)
      .concat(preLoaders)
      .concat(postLoaders);
  }

  return [];
};

export default parser;
