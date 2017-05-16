/* @flow */

import type { TModules } from '@knit/knit-core';

type TCtx = {
  public: TModules,
  modules: TModules,
  include: Array<string>,
  exclude: Array<string>,
};

const tasks = [
  {
    title: 'finding relevant packages',
    task: (ctx: TCtx) => {
      if (ctx.include) {
        ctx.modules = ctx.modules.filter(module => ctx.include.some(pattern => module.match(new RegExp(pattern))));
      }
      if (ctx.exclude) {
        ctx.modules = ctx.modules.filter(module => !ctx.exclude.some(pattern => module.match(new RegExp(pattern))));
      }
    },
  },
];

module.exports = tasks;
