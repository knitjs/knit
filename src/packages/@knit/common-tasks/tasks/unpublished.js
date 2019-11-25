/* @flow */

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

import findUnpublishedPackages from "@knit/find-unpublished-packages";

type TCtx = {
  modulesMap: TPackages,
  modules: TPackageNames,
  unpublished: TPackageNames
};

const tasks = [
  {
    title: "checking for unpublished modules",
    task: (ctx: TCtx) =>
      findUnpublishedPackages(ctx.modulesMap).then(unpublished => {
        ctx.unpublished = unpublished;
        ctx.modules = unpublished;
      })
  }
];

module.exports = tasks;
