/* @flow weak */

const path = require("path");

// export type TNormalizePkgName = (pkg: string, prefix: string) => string;
const normalizePkgName = (pkg, prefix) => {
  const parts = pkg.split("/");

  return parts.length > 1
    ? `${parts[0]}/${[prefix, parts[1]].join("-")}`
    : [prefix, parts[0]].join("-");
};

module.exports = (content, filename, deps, rootDir) => {
  if (
    path.basename(rootDir).includes("eslint-config") &&
    path.extname(filename) === ".js"
  ) {
    const config = require(filename) || {}; // eslint-disable-line import/no-dynamic-require

    const parser = config.parser ? [config.parser] : [];
    const configs = (config.extends || [])
      .map(pkg => normalizePkgName(pkg, "eslint-config"));
    const plugins = (config.plugins || [])
      .map(pkg => normalizePkgName(pkg, "eslint-plugin"));

    return configs.concat(plugins).concat(parser).filter(Boolean);
  }

  return [];
};
