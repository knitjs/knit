/* @flow */

import type { TModules } from '@knit/knit-core';
import type { TPkgJson } from '@knit/needle';

import readPkg from '@knit/read-pkg';

const needle = require('@knit/needle');

type TCtx = {
  modules: TModules,
  workingDir: string,
  pkgs: {[k: string]: TPkgJson},
};

const tasks = [
  {
    title: 'reading package.json of packages',
    task: (ctx: TCtx) => {
      ctx.pkgs = {};
      ctx.modules.forEach(m => {
        ctx.pkgs[m] = readPkg(ctx.workingDir || needle.paths.modules, m);
      });
    },
  },
];

module.exports = tasks;
