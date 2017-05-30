/* @flow weak */

const Listr = require("listr");

const errors = require("@knit/nice-errors");
const log = require("@knit/logger");
const tasks = require("@knit/common-tasks");

module.exports = argv => {
  new Listr(
    [...tasks.preflight.ignore, ...tasks.modules, ...tasks.preflight.knit],
    {
      renderer: log.getRenderer(argv)
    }
  )
    .run(argv)
    .catch(errors.catchErrors);
};
