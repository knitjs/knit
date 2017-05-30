/* @flow weak */

import {
  findAllMissingDependencies,
  findAllUnusedDependencies
} from "@knit/find-dependencies";

const needle = require("@knit/needle");

const tasks = [
  {
    title: "validating package.json",
    skip: ctx => ctx.skipPreflight,
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
    skip: ctx => ctx.skipPreflight,
    task: ctx =>
      findAllMissingDependencies(
        ctx.workingDir || needle.paths.workingDirPath,
        ctx.public,
        needle.pkg
      ).then(m => {
        if (m.length > 0) {
          throw {
            message: `found ${m.length} missing package${m.length > 1 ? "s" : ""}`,
            stderr: m.join(" ")
          };
        }
        return true;
      })
  },
  {
    title: "check for unused dependencies",
    skip: ctx => ctx.skipPreflight,
    task: ctx =>
      findAllUnusedDependencies(
        ctx.workingDir || needle.paths.workingDirPath,
        ctx.public,
        needle.pkg
      ).then(m => {
        if (m.length > 0) {
          throw {
            message: `found ${m.length} unused package${m.length > 1 ? "s" : ""}`,
            stderr: m.join(" ")
          };
        }
        return true;
      })
  }
];

module.exports = tasks;
