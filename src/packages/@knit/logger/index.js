/* @flow */

const chalk = require("chalk");
const updateRdrr = require("listr-update-renderer");
const silentRdrr = require("listr-silent-renderer");
const verboseRdrr = require("listr-verbose-renderer");

type TLog = (...e: Array<mixed>) => void;

const info: TLog = (...msg) => console.log(chalk.blue("info"), ...msg);
const command: TLog = (...msg) => console.log(chalk.blue("command"), ...msg);
const warning: TLog = (...msg) => console.log(chalk.yellow("warning"), ...msg);
const error: TLog = (...msg) => console.log(chalk.red("error"), ...msg);
const success: TLog = (...msg) => console.log(chalk.green("success"), ...msg);
const missing: TLog = (...msg) => console.log(chalk.red("missing"), ...msg);
const subtree: TLog = (...msg) => console.log(chalk.white("└─"), ...msg);

export type TGetRenderer = {
  silent: boolean,
  verbose: boolean
};

const getRenderer = (opts: TGetRenderer) => {
  const { silent, verbose } = opts || {};
  if (silent) {
    return silentRdrr;
  } else if (verbose) {
    return verboseRdrr;
  }

  return updateRdrr;
};

module.exports = {
  info,
  command,
  warning,
  error,
  success,
  missing,
  subtree,
  getRenderer
};
