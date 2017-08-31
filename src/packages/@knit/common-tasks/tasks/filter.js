/* @flow */

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

type TCtx = {
  public: TPackageNames,
  modulesMap: TPackages,
  modules: TPackageNames,
  include: TPackageNames,
  exclude: TPackageNames
};

const tasks = [
  {
    title: "finding relevant packages",
    task: (ctx: TCtx) => {
      if (ctx.include) {
        ctx.modules = ctx.modules.filter(module =>
          ctx.include.some(pattern => module.match(new RegExp(pattern)))
        );
      }
      if (ctx.exclude) {
        ctx.modules = ctx.modules.filter(
          module =>
            !ctx.exclude.some(pattern => module.match(new RegExp(pattern)))
        );
      }
    }
  }
];

module.exports = tasks;
