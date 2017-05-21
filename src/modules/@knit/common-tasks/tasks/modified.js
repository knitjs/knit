/* @flow */

import execa from "execa";

import {
  findModifiedSince,
  findModifiedPackages
} from "@knit/find-modified-packages";
import needle from "@knit/needle";

import type { TModules } from "@knit/knit-core";

type TCtx = {
  tag: ?string,
  public: TModules,
  modules: TModules,
  modified: TModules,
  workingDir: string
};

const tasks = [
  {
    title: "getting last tag",
    skip: (ctx: TCtx) => ctx.tag || ctx.modified,
    task: (ctx: TCtx) =>
      execa
        .stdout("git", ["describe", "--abbrev=0", "--tags"])
        .then(tag => {
          ctx.tag = tag;
        })
        .catch(() =>
          execa
            .stdout("git", ["rev-list", "--max-parents=0", "HEAD"])
            .then(commit => {
              ctx.tag = commit;
            })
        )
        .catch(() => {
          // no commit history
          ctx.tag = null;
        })
  },
  {
    title: "determining modified packages since last release",
    skip: (ctx: TCtx) =>
      ctx.modified && `${ctx.modified.length} modules already found.`,
    task: (ctx: TCtx) => {
      if (ctx.tag) {
        const modifiedSince = findModifiedSince(
          ctx.workingDir || needle.paths.modulesStub,
          ctx.public,
          ctx.tag
        );
        return findModifiedPackages(
          ctx.workingDir || needle.paths.modulesStub,
          ctx.public,
          modifiedSince
        ).then(modified => {
          ctx.modified = modified;
          ctx.modules = modified;
        });
      }

      ctx.modified = ctx.public;

      return ctx;
    }
  }
];

module.exports = tasks;
