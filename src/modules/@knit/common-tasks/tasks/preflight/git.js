/* @flow weak */

const execa = require("execa");

const tasks = [
  {
    title: "get current branch",
    skip: ctx => ctx.skipPreflight,
    task: ctx =>
      execa.stdout("git", ["symbolic-ref", "--short", "HEAD"]).then(branch => {
        ctx.branch = branch;
      })
  },
  {
    title: "check current branch",
    skip: ctx => ctx.skipPreflight || process.env.ANY_BRANCH === "1",
    task: ctx => {
      if (!ctx.branch === "master") {
        throw {
          message: "not on a `master` branch",
          stderr: "use ANY_BRANCH=1 to publish anyway"
        };
      }
    }
  },
  {
    title: "check local working tree",
    skip: ctx => ctx.skipPreflight,
    task: () =>
      execa.stdout("git", ["status", "--porcelain"]).then(status => {
        if (status !== "") {
          throw {
            message: "unclean working tree",
            stderr: "commit or stash changes first"
          };
        }
      })
  },
  {
    title: "check remote history",
    skip: ctx => ctx.skipPreflight,
    task: () =>
      execa
        .stdout("git", ["rev-list", "--count", "--left-only", "@{u}...HEAD"])
        .then(result => {
          if (result !== "0") {
            throw {
              message: "remote history differs",
              stderr: "please pull changes"
            };
          }
        })
  }
];

module.exports = tasks;
