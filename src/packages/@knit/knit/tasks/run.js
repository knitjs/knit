/* @flow */

import type { TPackages } from "@knit/find-packages";
import type { TPackageNames } from "@knit/knit-core";

import readPkg from "@knit/read-pkg";

const Listr = require("listr");
const execa = require("execa");

const pathJoin = require("@knit/path-join");

type TCtx = {
  modulesMap: TPackages,
  modules: TPackageNames,
  script: string,
  args: Array<string>,
  parallel: boolean
};

const tasks = [
  {
    title: "npm run",
    task: (ctx: TCtx) =>
      new Listr(
        Object.keys(ctx.modulesMap).map(m => ({
          title: m,
          skip: () => !(readPkg(ctx.modulesMap[m]).scripts || {})[ctx.script],
          task: () =>
            execa("npm", ["run", ctx.script, ...ctx.args], {
              cwd: pathJoin(ctx.modulesMap[m].path)
            })
        })),
        { concurrent: ctx.parallel }
      )
  }
];

module.exports = tasks;
