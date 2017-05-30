/* @flow */

import type { TModules } from "@knit/knit-core";

import readPkg from "@knit/read-pkg";

const Listr = require("listr");

const pathJoin = require("@knit/path-join");
const needle = require("@knit/needle");
const yarn = require("@knit/yarn-utils");

type TCtx = {
  modules: TModules,
  script: string,
  workingDir: ?string,
  args: Array<string>,
  parallel: boolean
};

const tasks = [
  {
    title: "npm run",
    task: (ctx: TCtx) =>
      new Listr(
        ctx.modules.map(m => ({
          title: m,
          skip: () =>
            !(readPkg(ctx.workingDir || needle.paths.workingDirPath, m)
              .scripts || {})[ctx.script],
          task: () =>
            yarn.run(ctx.script, ctx.args, {
              cwd: pathJoin(ctx.workingDir || needle.paths.workingDirPath, m)
            })
        })),
        { concurrent: ctx.parallel }
      )
  }
];

module.exports = tasks;
