/* @flow */

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";
import type { TPkgJson } from "@knit/needle";

import readPkg from "@knit/read-pkg";

const needle = require("@knit/needle");

type TCtx = {
  modulesMap: TPackages,
  modules: TPackageNames,
  workingDir: string,
  pkgs: { [k: string]: TPkgJson }
};

const tasks = [
  {
    title: "reading package.json of packages",
    task: (ctx: TCtx) => {
      ctx.pkgs = {};
      ctx.modules.forEach(m => {
        ctx.pkgs[m] = readPkg(
          ctx.workingDir || needle.paths.workingDirPath,
          ctx.modulesMap[m]
        );
      });
    }
  }
];

module.exports = tasks;
