/* @flow */

const path = require('path');
const readPkgUp = require('read-pkg-up');

const pkg = (readPkgUp.sync() || {}).pkg || {};
const pkgNeedle = (pkg.knit || {}).needle || {};

const pkgPaths = (pkgNeedle || {}).paths || {};
const ROOT_DIR = process.env.PWD || '';
const MOD_STUB = pkgPaths.modulesStub || path.join('src', 'modules');
const DIST_STUB = pkgPaths.distStub || 'dist';
const LIB_STUB = pkgPaths.libStub || 'lib';
const ES6_STUB = pkgPaths.es6Stub || 'es6';
const UMD_STUB = pkgPaths.umdStub || 'umd';
const TESTS_STUB = pkgPaths.testsStub || '__tests__';
const DATA_STUB = pkgPaths.dataStub || 'data';
const ENTRY_DIR = pkgPaths.entryStub || 'webpack_entry';

const pkgServer = (pkgNeedle || {}).server || {};
const SERVER_HOST = process.env.HOST || pkgServer.host || 'localhost';
const SERVER_PORT = parseInt(process.env.PORT || pkgServer.port, 10) || 8080;

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
    lib: path.join(ROOT_DIR, DIST_STUB, LIB_STUB),
    libStub: LIB_STUB,
    jsnext: path.join(ROOT_DIR, DIST_STUB, ES6_STUB),
    jsnextStub: ES6_STUB,
    umd: path.join(ROOT_DIR, DIST_STUB, UMD_STUB),
    umdStub: UMD_STUB,
    testsStub: TESTS_STUB,
    entryStub: ENTRY_DIR,
    entry: path.join(ROOT_DIR, MOD_STUB, ENTRY_DIR),
  },
  server: {
    host: SERVER_HOST,
    port: SERVER_PORT,
    public: `http://${SERVER_HOST}:${SERVER_PORT}/`,
  },
  proxy: process.env.PROXY || (pkgNeedle || {}).proxy || 'http://localhost:5000',
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
