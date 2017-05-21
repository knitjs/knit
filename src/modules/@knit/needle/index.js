/* @flow */

const path = require('path');
const readPkgUp = require('read-pkg-up');

const pkg = (readPkgUp.sync() || {}).pkg || {};
const pkgNeedle = (pkg.knit || {}).needle || {};

const pkgPaths = (pkgNeedle || {}).paths || {};
const ROOT_DIR = process.env.PWD || '';
const SRC_STUB = pkgPaths.src || 'src';
const MOD_STUB = pkgPaths.modulesStub || path.join(SRC_STUB, 'modules');
const DIST_STUB = pkgPaths.distStub || 'dist';
const TESTS_STUB = pkgPaths.testsStub || '__tests__';
const DATA_STUB = pkgPaths.dataStub || 'data';

const PKG_ENV = (pkgNeedle || {}).env || {};

module.exports = {
  paths: {
    rootDir: ROOT_DIR,
    data: path.join(ROOT_DIR, DATA_STUB),
    dataStub: DATA_STUB,
    modulesStub: MOD_STUB,
    modules: path.join(ROOT_DIR, MOD_STUB),
    dist: path.join(ROOT_DIR, DIST_STUB),
    distStub: DIST_STUB,
    testsStub: TESTS_STUB,
    srcStub: SRC_STUB,
    src: path.join(ROOT_DIR, SRC_STUB),
  },
  env: Object.assign({},
    {
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV),
        BABEL_ENV: JSON.stringify(process.env.BABEL_ENV),
        TEST_ENV: JSON.stringify(process.env.TEST_ENV),
      },
      DEBUG: parseInt(process.env.DEBUG, 10) === 1,
      BASE: JSON.stringify(process.env.BASE) || '',
    },
    Object.keys(PKG_ENV).reduce((acc, k) => (
      Object.assign({}, acc, {
        [k]: JSON.stringify(process.env[k] || PKG_ENV[k]),
      })
    ), {})
  ),
  pkg: {
    dependencies: {},
    devDependencies: {},
    peerDependencies: {},
    optionalDependencies: {},
    ...pkg,
  },
};
