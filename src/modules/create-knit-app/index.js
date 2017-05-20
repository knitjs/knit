#!/usr/bin/env node

const updateNotifier = require('update-notifier');
const yargs = require('yargs');
const readPkgUp = require('read-pkg-up');

const init = require('./bin/cli-init');

const pkg = readPkgUp.sync({ cwd: __dirname }).pkg;

const argv = yargs
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
  .usage('Usage: create-knit-app <project-directory>')
  .demand(1)
  .help()
  .argv;

init(argv);

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7, // 1 week
});
notifier.notify();
