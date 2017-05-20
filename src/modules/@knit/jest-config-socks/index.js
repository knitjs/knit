/* @flow */

const path = require('path');
const needle = require('@knit/needle');

const jestConfig = {
  cacheDirectory: '.jest',
  collectCoverageFrom: [
    path.join('<rootDir>', '**', needle.paths.testsStub, '**', '*.js'),
  ],
  moduleNameMapper: {
    '^[./a-zA-Z0-9$_-]+\\.(jpg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm)$': path.resolve(__dirname, 'fileMock.js'),
    '^[./a-zA-Z0-9$_-]+\\.css$': path.resolve(__dirname, 'styleMock.js'),
  },
  testEnvironment: 'jsdom',
  testPathDirs: [needle.paths.modules],
  coveragePathIgnorePatterns: [path.join('<rootDir>', 'node_modules', 'dist')],
  transformIgnorePatterns: [path.join('<rootDir>', 'node_modules', 'dist')],
  testPathIgnorePatterns: [path.join('<rootDir>', 'node_modules', 'dist')],
  haste: {
    providesModuleNodeModules: ['.*'],
  },
};

module.exports = Object.assign({}, jestConfig, needle.pkg.jest || {});
