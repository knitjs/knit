/* @flow */
require("dotenv").config();

const readPkgUp = require("read-pkg-up");

const pathJoin = require("@knit/path-join");

const pkg = (readPkgUp.sync() || {}).packageJson || {};

const ROOT_DIR = process.env.PWD || process.cwd() || "";
const WORKSPACE = pathJoin(process.env.KNIT_WORKING_DIR || "src/packages");
const OUTPUT_DIR = pathJoin(process.env.KNIT_OUTPUT_DIR || "dist");

module.exports = {
  paths: {
    rootDir: ROOT_DIR,
    workspace: WORKSPACE,
    outputDir: OUTPUT_DIR,
    outputDirPath: pathJoin(ROOT_DIR, OUTPUT_DIR)
  },
  pkg: {
    dependencies: {},
    devDependencies: {},
    peerDependencies: {},
    optionalDependencies: {},
    ...pkg
  }
};
