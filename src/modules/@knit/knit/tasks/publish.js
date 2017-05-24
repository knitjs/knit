/* @flow */

import type { TModules } from "@knit/knit-core";
import type { TPkgJson } from "@knit/needle";

import yarn from "@knit/yarn-utils";

const Listr = require("listr");

import { pathJoin } from "@knit/path-join";
const needle = require("@knit/needle");

type TCtx = {
  workingDir: string,
  pkgs: { [k: string]: TPkgJson },
  unpublished: TModules
};

const createPublishTask = (m: string) => ({
  title: m,
  task: ctx =>
    yarn
      .publish({ cwd: pathJoin(ctx.workingDir || needle.paths.dist, m) })
      .catch(err => {
        if (err.stderr.indexOf("npm ERR! publish Failed PUT 404") === 0) {
          throw Object.assign({}, err, {
            message: `could not publish ${m}`,
            stderr: "NPM returned a 404 error when trying to publish which typically means you do not have access to the module. To make sure you are logged in to the correct account type `npm whoami`"
          });
        } else {
          throw err;
        }
      })
});

const tasks = [
  {
    title: "publishing updated modules",
    task: (ctx: TCtx) => new Listr(ctx.unpublished.map(createPublishTask))
  }
];

module.exports = tasks;
