/* @flow weak */

const Listr = require('listr');

const errors = require('@knit/nice-errors');
const log = require('@knit/logger');
const tasks = require('@knit/common-tasks');

module.exports = (argv) => {
  new Listr([
    ...tasks.modules,
    ...require('../tasks/exec'),
  ], {
    renderer: log.getRenderer(argv),
    collapse: false,
  }).run({
    ...argv,
    cmd: argv._.slice(1)[0],
    args: argv._.slice(1).slice(1),
  }).catch(errors.catchErrors);
};
