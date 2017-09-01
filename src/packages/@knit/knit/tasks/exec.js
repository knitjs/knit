/* @flow */

import type { TPackages } from "@knit/find-packages";
import type { TPackageNames } from "@knit/knit-core";

const Listr = require("listr");

const needle = require("@knit/needle");
const pathJoin = require("@knit/path-join");
const execa = require("execa");

type TCtx = {
  modulesMap: TPackages,
  modules: TPackageNames,
  workingDir: ?string,
  cmd: string,
  label: string,
  args: Array<string>,
  parallel: boolean
};

const tasks = [
  {
    title: "exec",
    task: (ctx: TCtx) =>
      new Listr([
        {
          title: `${ctx.label || ctx.cmd}`,
          task: (ctx: TCtx) =>
            new Listr(
              ctx.modules.map(m => ({
                title: m,
                task: () => {
                  // using $KNIT_MODULE_NAME as an env gets auto-expanded before we can get ahold of it
                  // zsh eats it so you need to escape \$KNIT_MODULE_NAME
                  // but before we get access it gets eaten again so
                  // need to escape like \\\$KNIT_MODULE_NAME - which is too many \ to bother with
                  const args = ctx.args.map(x => {
                    x = x.replace("KNIT_MODULE_NAME", m);
                    x = x.replace("KNIT_MODULE_DIR", ctx.modulesMap[m]);
                    x = x.replace("ROOT_DIR", needle.paths.rootDir);
                    return x;
                  });

                  return execa(ctx.cmd, args, {
                    cwd: pathJoin(
                      ctx.workingDir || needle.paths.workingDirPath,
                      ctx.modulesMap[m]
                    )
                  });
                }
              })),
              { concurrent: ctx.parallel }
            )
        }
      ])
  }
];

module.exports = tasks;
