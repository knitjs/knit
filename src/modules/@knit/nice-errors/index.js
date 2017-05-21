/* @flow weak */

const chalk = require("chalk");
const log = require("@knit/logger");
const serializeError = require("serialize-error");

exports.niceStackTrace = stack => {
  const stackLines = stack.split("\n");
  stackLines.shift();
  const stackLineRx = /^.*?at ((.*) )?\(?(.*?)(:(.*?):(.*?))?\)?$/;

  stackLines.forEach(line => {
    const match = stackLineRx.exec(line);

    if (match && match.length >= 5) {
      console.log(
        " ",
        chalk.yellow(
          [match[3].split("/").pop(), match[5]].filter(Boolean).join(":")
        ),
        chalk.white(match[2])
      );
    }
    if (match && match.length >= 6) {
      console.log(
        " ",
        chalk.grey([match[3], match[5], match[6]].filter(Boolean).join(":"))
      );
    }
  });
};

exports.catchErrors = e => {
  const err = serializeError(e);
  console.log();
  err.cmd && log.command(chalk.white(err.cmd));
  const msg = [err.name, err.message].filter(Boolean).join(" ");
  msg.length && log.error(chalk.white(msg));
  err.stderr && log.subtree((err.stderr || "").split("\n    at")[0]);
  err.stdout && log.subtree((err.stdout || "").split("\n    at")[0]);
  err.stack && exports.niceStackTrace(err.stack);
};
