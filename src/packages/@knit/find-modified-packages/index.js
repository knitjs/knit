/* @flow */

import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

import execa from "execa";
import { findKey } from "lodash";

import { makeDependencyMap } from "@knit/find-dependencies";
import isScoped from "@knit/is-scoped";

type TResolveCascadingUpdates = (
  modules: TPackageNames,
  mapping: { [k: string]: TPackageNames },
  modified: TPackageNames
) => TPackageNames;
export const resolveCascadingUpdates: TResolveCascadingUpdates = (
  modules,
  mapping,
  modified
) => {
  const next = modules.reduce((acc, module) => {
    if (acc.includes(module)) return acc;
    const deps = mapping[module] || [];

    if (deps.some(d => acc.includes(d))) {
      return acc.concat(module);
    }

    return acc;
  }, modified);

  if (next.length !== modified.length) {
    return resolveCascadingUpdates(modules, mapping, next);
  }

  return modified;
};

type TFindModifiedPackages = (
  modu: TPackages,
  modi: TPackageNames
) => Promise<TPackageNames>;
export const findModifiedPackages: TFindModifiedPackages = (
  modules,
  modified
) =>
  // map of {module: [module dependencies]}
  makeDependencyMap(modules).then(dependencyMap =>
    resolveCascadingUpdates(Object.keys(modules), dependencyMap, modified)
  );

type TFindModifiedSince = (
  workspace: string,
  m: TPackages,
  range: string
) => TPackageNames;
export const findModifiedSince: TFindModifiedSince = (
  workspace,
  modulesMap,
  range
) => {
  const output = execa.sync("git", [
    "diff",
    "--name-only",
    range,
    "--",
    workspace
  ]);

  const lines = (output.stdout || "").split("\n").filter(x => x.length);

  const modified = lines
    .map(l => {
      const [scope, name] = l.split(`${workspace}/`)[1].split("/");
      return isScoped(scope) ? [scope, name].join("/") : scope;
    })
    .filter(Boolean)
    .reduce((acc, m) => (acc.includes(m) ? acc : acc.concat(m)), [])
    .map(md => findKey(modulesMap, k => k.dir === md) || "")
    .filter(m => Object.keys(modulesMap).includes(m));

  return modified;
};
