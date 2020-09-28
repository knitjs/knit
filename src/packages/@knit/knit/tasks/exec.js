/* @flow */

import type { TPackages } from "@knit/find-packages";
import type { TPackageNames } from "@knit/knit-core";

import Listr from "listr";
import execa from "execa";

import needle from "@knit/needle";
import pathJoin from "@knit/path-join";
import { latestVersion } from "@knit/latest-version";
import { normalizeBranch, currentBranch } from "@knit/git-branch-semver";
import { shortSha } from "@knit/git-commit-sha";

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
                task: async () => {
                  // using $KNIT_MODULE_NAME as an env gets auto-expanded before we can get ahold of it
                  // zsh eats it so you need to escape \$KNIT_MODULE_NAME
                  // but before we get access it gets eaten again so
                  // need to escape like \\\$KNIT_MODULE_NAME - which is too many \ to bother with
                  const args = Promise.all(
                    ctx.args.map(async x => {
                      if (typeof x !== "string") return x;
                      x = x.replace("KNIT_MODULE_NAME", m);
                      x = x.replace("KNIT_MODULE_DIR", ctx.modulesMap[m].dir);
                      x = x.replace("ROOT_DIR", needle.paths.rootDir);

                      if (x.includes("KNIT_MODULE_VERSION")) {
                        x = x.replace(
                          "KNIT_MODULE_VERSION",
                          await latestVersion(m, "0.0.0")
                        );
                      }

                      if (x.includes("GIT_BRANCH")) {
                        x = x.replace(
                          "GIT_BRANCH",
                          normalizeBranch(await currentBranch())
                        );
                      }

                      if (x.includes("GIT_SHA")) {
                        x = x.replace("GIT_SHA", await shortSha());
                      }

                      return x;
                    })
                  );

                  return execa(ctx.cmd, await args, {
                    cwd: pathJoin(ctx.modulesMap[m].path)
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
