/* @flow */

import execa from "execa";

import {
  findModifiedSince,
  findModifiedPackages
} from "@knit/find-modified-packages";
import needle from "@knit/needle";

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

type TCtx = {
  range: ?string,
  public: TPackageNames,
  modulesMap: TPackages,
  modules: TPackageNames,
  modified: TPackageNames,
  workspace: string
};

const tasks = [
  {
    title: "getting last tag",
    skip: (ctx: TCtx) => ctx.range || ctx.modified,
    task: (ctx: TCtx) =>
      execa("git", ["describe", "--abbrev=0", "--tags"])
        .then(tag => {
          ctx.range = tag.stdout;
        })
        .catch(() =>
          execa("git", ["rev-list", "--max-parents=0", "HEAD"]).then(commit => {
            ctx.range = commit.stdout;
          })
        )
        .catch(() => {
          // no commit history
          ctx.range = null;
        })
  },
  {
    title: "determining modified packages",
    skip: (ctx: TCtx) =>
      ctx.modified && `${ctx.modified.length} modules already found.`,
    task: (ctx: TCtx) => {
      if (ctx.range) {
        const modifiedSince = findModifiedSince(
          ctx.workspace || needle.paths.workspace,
          ctx.modulesMap,
          ctx.range
        );
        return findModifiedPackages(ctx.modulesMap, modifiedSince).then(
          modified => {
            ctx.modified = modified;
            ctx.modules = modified;
          }
        );
      }

      ctx.modified = ctx.public;

      return ctx;
    }
  }
];

module.exports = tasks;
