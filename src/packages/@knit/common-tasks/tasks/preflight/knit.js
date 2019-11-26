/* @flow weak */

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

import {
  findAllMissingDependencies,
  findAllUnusedDependencies
} from "@knit/find-dependencies";

const needle = require("@knit/needle");

type TCtx = {
  public: TPackageNames,
  modulesMap: TPackages,
  modules: TPackageNames,
  skipPreflight: boolean
};

const tasks = [
  {
    title: "validating package.json",
    skip: (ctx: TCtx) => ctx.skipPreflight,
    task: () => {
      ["version"].forEach(field => {
        if (!needle.pkg[field]) {
          throw {
            message: "incomplete package.json",
            stderr: `need to set \`${field}\` field in package.json`
          };
        }
      });
    }
  },
  {
    title: "check for missing dependencies",
    skip: (ctx: TCtx) => ctx.skipPreflight,
    task: (ctx: TCtx) => {
      return findAllMissingDependencies(ctx.modulesMap, needle.pkg).then(m => {
        if (m.length > 0) {
          throw {
            message: `found ${m.length} missing package${
              m.length > 1 ? "s" : ""
            }`,
            stderr: m.join(" ")
          };
        }
        return true;
      });
    }
  },
  {
    title: "check for unused dependencies",
    skip: (ctx: TCtx) => ctx.skipPreflight,
    task: (ctx: TCtx) => {
      return findAllUnusedDependencies(ctx.modulesMap, needle.pkg).then(m => {
        if (m.length > 0) {
          throw {
            message: `found ${m.length} unused package${
              m.length > 1 ? "s" : ""
            }`,
            stderr: m.join(" ")
          };
        }
        return true;
      });
    }
  }
];

module.exports = tasks;
