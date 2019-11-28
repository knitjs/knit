/* @flow weak */

const execa = require("execa");
// beep
const tasks = [
  {
    title: "get current branch",
    skip: ctx => ctx.skipPreflight,
    task: ctx =>
      execa("git", ["symbolic-ref", "--short", "HEAD"]).then(branch => {
        ctx.branch = branch.stdout;
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
      execa("git", ["status", "--porcelain"]).then(status => {
        if (status.stdout !== "") {
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
      execa("git", ["rev-list", "--count", "--left-only", "@{u}...HEAD"]).then(
        result => {
          if (result.stdout !== "0") {
            throw {
              message: "remote history differs",
              stderr: "please pull changes"
            };
          }
        }
      )
  }
];

module.exports = tasks;
