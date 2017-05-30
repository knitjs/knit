/* @flow */
require("dotenv").config();

const readPkgUp = require("read-pkg-up");

const pathJoin = require("@knit/path-join");

const pkg = (readPkgUp.sync() || {}).pkg || {};

const ROOT_DIR = process.env.PWD || "";
const WORKING_DIR = pathJoin(process.env.KNIT_WORKING_DIR || "src/packages");
const OUTPUT_DIR = pathJoin(process.env.KNIT_OUTPUT_DIR || "dist");

module.exports = {
  paths: {
    rootDir: ROOT_DIR,
    workingDir: WORKING_DIR,
    workingDirPath: pathJoin(ROOT_DIR, WORKING_DIR),
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
