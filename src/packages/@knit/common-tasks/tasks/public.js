/* @flow */

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

import { findPublicPackages } from "@knit/find-packages";

const needle = require("@knit/needle");

type TCtx = {
  public: TPackageNames,
  modulesMap: TPackages,
  modules: TPackageNames,
  workingDir: string
};

const tasks = [
  {
    title: "finding public modules",
    task: (ctx: TCtx) => {
      const modulesMap = findPublicPackages(
        ctx.workingDir || needle.paths.workingDirPath
      );
      // More than 11 modules would cause node to throw:
      // (node) warning: possible EventEmitter memory leak detected. 11 exit listeners added. Use emitter.setMaxListeners() to increase limit.
      const modules = Object.keys(modulesMap);
      const len = modules.length;
      if (len > 11) {
        // $FlowIgnore
        require('events').EventEmitter.defaultMaxListeners = len; // eslint-disable-line
      }

      ctx.public = modules;
      ctx.modules = modules;
      ctx.modulesMap = modulesMap;
    }
  }
];

module.exports = tasks;
