/* @flow */

import type { TModules } from "@knit/knit-core";

import findUnpublishedPackages from "@knit/find-unpublished-packages";
import needle from "@knit/needle";

type TCtx = {
  modules: TModules,
  unpublished: TModules,
  workingDir: string
};

const tasks = [
  {
    title: "checking for unpublished modules",
    task: (ctx: TCtx) =>
      findUnpublishedPackages(
        ctx.workingDir || needle.paths.workingDirPath,
        ctx.modules
      ).then(modules => {
        ctx.unpublished = modules;
        ctx.modules = modules;
      })
  }
];

module.exports = tasks;
