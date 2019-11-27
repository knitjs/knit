#!/usr/bin/env node

/* @flow */

const updateNotifier = require("update-notifier");
const readPkgUp = require("read-pkg-up");

const pkg = readPkgUp.sync({ cwd: __dirname }).packageJson;

const options = {
  scope: {
    describe: "Limit scope of command",
    choices: ["public", "modified", "unpublished"],
    default: "public"
  },
  range: {
    describe:
      "Used with `--scope modified` to pass commit range ex. HEAD~..HEAD",
    type: "string"
  },
  include: {
    describe: "Include only packages matching regex",
    type: "array"
  },
  exclude: {
    describe: "Exclude any packages matching regex",
    type: "array"
  },
  "working-dir": {
    describe: "Path to a directory containing packages",
    type: "string"
  }
};

const parallel = {
  describe: "Run command on each package in parallel",
  type: "boolean",
  default: false
};

require("yargs") // eslint-disable-line no-unused-expressions
  .version(pkg.version)
  .options({
    verbose: {
      describe: "Use verbose renderer output",
      type: "boolean",
      global: true
    },
    silent: {
      describe: "Use silent renderer output",
      type: "boolean",
      global: true
    }
  })
  .command(
    "list",
    "List modules and their dependencies",
    y =>
      y.options({
        ...options,
        "show-dependencies": {
          describe: "Show dependencies for each module",
          type: "boolean"
        }
      }),
    require("./cli-list")
  )
  .command(
    "run <script> [args...]",
    "Run npm scripts on packages",
    y =>
      y.demand(1).options({
        ...options,
        parallel
      }),
    require("./cli-run")
  )
  .command(
    "exec",
    "Execute arbitrary commands packages",
    y =>
      y.options({
        ...options,
        parallel,
        label: {
          describe: "Add a friendly label to exec output",
          type: "string"
        }
      }),
    require("./cli-exec")
  )
  .command(
    "validate",
    "Validate modules for release",
    y => y,
    require("./cli-validate")
  )
  .command(
    "stitch",
    "Update the package.json of all packages with knitted dependencies and project meta data",
    y =>
      y.options({
        ...options,
        parallel,
        "output-dir": {
          describe: "Path to output directory",
          type: "string"
        }
      }),
    require("./cli-stitch")
  )
  .demand(1)
  .help().argv;

const notifier = updateNotifier({
  pkg,
  updateCheckInterval: 1000 * 60 * 60 * 24 * 7 // 1 week
});
notifier.notify();
