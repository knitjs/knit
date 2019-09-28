/* @flow weak */

const execa = require("execa");
const semver = require("semver");

const needle = require("@knit/needle");

const tasks = [
  {
    title: "validate version",
    skip: ctx => ctx.skipPreflight,
    task: ctx => {
      if (!semver.valid(ctx.version)) {
        throw {
          message: "version failed validation",
          stderr: `\`${ctx.version}\` must be a valid semver version.`
        };
      }

      if (semver.gte(needle.pkg.version, ctx.version)) {
        throw {
          message: "version failed validation",
          stderr: `\`${ctx.version}\` should be higher than current version \`${needle.pkg.version}\``
        };
      }
    }
  },
  {
    title: "check git tag existence",
    skip: ctx => ctx.skipPreflight,
    task: ctx =>
      execa("git", ["fetch"])
        .then(() =>
          execa("git", [
            "rev-parse",
            "--quiet",
            "--verify",
            `refs/tags/v${ctx.version}`
          ])
        )
        .then(
          output => {
            if (output.stdout) {
              throw {
                message: `git tag \`v${ctx.version}\` already exists.`,
                stderr: "delete tag or try again with a new version"
              };
            }
          },
          err => {
            // Command fails with code 1 and no output if the tag does not exist,
            // even though `--quiet` is provided
            // https://github.com/sindresorhus/np/pull/73#discussion_r72385685
            if (err.stdout !== "" || err.stderr !== "") {
              throw err;
            }
          }
        )
  }
];

module.exports = tasks;
