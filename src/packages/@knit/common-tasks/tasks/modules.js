/* @flow */

import Listr from "listr";

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

import publicPackages from "./public";
import filterPackages from "./filter";
import modified from "./modified";
import unpublished from "./unpublished";

type TCtx = {
  public: TPackageNames,
  modulesMap: TPackages,
  modules: TPackageNames
};

const tasks = [
  {
    title: "finding modules",
    task: (ctx: TCtx) =>
      new Listr([
        ...publicPackages,
        ...(ctx.scope === "modified" ? modified : []),
        ...(ctx.scope === "unpublished" ? unpublished : []),
        ...(ctx.exclude || ctx.include ? filterPackages : [])
      ])
  }
];

module.exports = tasks;
