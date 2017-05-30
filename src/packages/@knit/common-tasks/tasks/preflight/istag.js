/* @flow weak */

const execa = require("execa");

const tasks = [
  {
    title: "check commit is tagged",
    skip: ctx => ctx.skipPreflight,
    task: ctx =>
      execa
        .stdout("git", ["describe", "--abbrev=0", "--exact-match", "HEAD"])
        .then(() =>
          execa
            .stdout("git", ["describe", "--abbrev=0", "HEAD^"])
            .then(previous => (ctx.tag = previous))
            .catch(() =>
              execa
                .stdout("git", ["rev-list", "--max-parents=0", "HEAD^"])
                .then(commit => {
                  ctx.tag = commit;
                })
            )
        )
        .catch(() => {
          throw {
            message: "commit is not tagged",
            stdout: "release this commit or checkout a tag before publishing"
          };
        })
  }
];

module.exports = tasks;
