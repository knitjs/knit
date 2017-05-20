/* @flow */

import type { TModules } from '@knit/knit-core';

import { findPublicPackages } from '@knit/find-packages';

const needle = require('@knit/needle');

type TCtx = {
  public: TModules,
  modules: TModules,
  workingDir: string,
};

const tasks = [
  {
    title: 'finding public modules',
    task: (ctx: TCtx) => {
      const modules = findPublicPackages(ctx.workingDir || needle.paths.modules);
      // More than 11 modules would cause node to throw:
      // (node) warning: possible EventEmitter memory leak detected. 11 exit listeners added. Use emitter.setMaxListeners() to increase limit.
      if (modules.length > 11) {
        // $FlowIgnore
        require('events').EventEmitter.defaultMaxListeners = modules.length; // eslint-disable-line
      }

      ctx.public = modules;
      ctx.modules = modules;
    },
  },
];

module.exports = tasks;
