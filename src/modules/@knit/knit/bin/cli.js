#!/usr/bin/env node

/* @flow */

const updateNotifier = require('update-notifier');
const readPkgUp = require('read-pkg-up');

const pkg = readPkgUp.sync({ cwd: __dirname }).pkg;

const options = {
  scope: {
    describe: 'Limit scope of command',
    choices: ['public', 'modified', 'unpublished'],
    default: 'public',
  },
  include: {
    describe: 'Include only packages matching regex',
    type: 'array',
  },
  exclude: {
    describe: 'Exclude any packages matching regex',
    type: 'array',
  },
  'working-dir': {
    describe: 'Path to a directory containing packages',
    type: 'string',
  },
};

require('yargs') // eslint-disable-line no-unused-expressions
  .version(pkg.version)
  .options({
    verbose: {
      describe: 'Use verbose renderer output',
      type: 'boolean',
      global: true,
    },
    silent: {
      describe: 'Use silent renderer output',
      type: 'boolean',
      global: true,
    },
  })
  .command('list', 'List modules and their dependencies',
  (y) => y.options({
    ...options,
    'show-dependencies': {
      describe: 'Show dependencies for each module',
      type: 'boolean',
    },
  }), require('./cli-list'))
  .command('run <script> [args...]', 'Run npm scripts on packages',
  (y) => y.demand(1).options(options), require('./cli-run'))
  .command('exec', 'Execute arbitrary commands packages',
  (y) => y.options(options), require('./cli-exec'))
  .command('validate', 'Validate modules for release', y => y, require('./cli-validate'))
  .command('copy', 'Copy a directory recursively',
  (y) => y.options({
    'output-dir': {
      describe: 'Path to output directory',
      type: 'string',
    },
    'ignore-path': {
      describe: 'Ignore folders/files matching regex',
      type: 'array',
    },
  }), require('./cli-copy'))
  .command('stitch [modules...]', 'Update the package.json of all modules with knitted dependencies and project meta data',
  (y) => y.options({
    'output-dir': {
      describe: 'Path to output directory',
      type: 'string',
    },
    ...options,
  }), require('./cli-stitch'))
  .command('publish [modules...]', 'Publish all unpublished modules',
  (y) => y.options(options), require('./cli-publish'))
  .demand(1)
  .help()
  .argv;

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7, // 1 week
});
notifier.notify();
