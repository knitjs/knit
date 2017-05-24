/* @flow */

import type { TPkgJson, TPkgJsonDeps } from "@knit/needle";

import depcheck from "@knit/depcheck";
import { pathJoin } from "@knit/path-join";
import readPkg from "@knit/read-pkg";

export type TModules = Array<string>;

type TFindDependencies = (d: string, m: string) => Promise<TModules>;
export const findDependencies: TFindDependencies = (dir, mod) =>
  depcheck(pathJoin(dir, mod))
    .then(res => Object.keys(res.using))
    .then(using => {
      const pkg = readPkg(dir, mod);
      const deps = Object.keys((pkg || {}).dependencies || {});

      return using.concat(deps);
    })
    .then(using =>
      using.reduce((acc, d) => (acc.includes(d) ? acc : acc.concat(d)), [])
    )
    .then(using => using.sort())
    .catch(e => {
      throw e;
    });

type TFindMissingDependencies = (
  u: TModules,
  m: TModules,
  d: TPkgJsonDeps
) => TModules;
export const findMissingDependencies: TFindMissingDependencies = (
  using,
  modules,
  deps
) => {
  const installed = Object.keys(deps);

  return using
    .filter(m => !installed.includes(m) && !modules.includes(m))
    .reduce((acc, d) => (acc.includes(d) ? acc : acc.concat(d)), []);
};

type TFindUnusedDependencies = (
  u: TModules,
  m: TModules,
  d: TPkgJsonDeps
) => TModules;
export const findUnusedDependencies: TFindUnusedDependencies = (
  using,
  modules,
  deps
) => {
  const installed = Object.keys(deps);

  return installed
    .filter(m => !using.includes(m) && !modules.includes(m))
    .reduce((acc, d) => (acc.includes(d) ? acc : acc.concat(d)), []);
};

type TFindInternalDependencies = (u: TModules, m: TModules) => TModules;
export const findInternalDependencies: TFindInternalDependencies = (
  using,
  modules
) =>
  using
    .filter(m => modules.includes(m))
    .reduce((acc, d) => (acc.includes(d) ? acc : acc.concat(d)), []);

type TFindAllDependencies = (d: string, m: TModules) => Promise<TModules>;
export const findAllDependencies: TFindAllDependencies = async (dir, modules) =>
  (await Promise.all(
    modules.reduce((acc, mod) => {
      const deps = findDependencies(dir, mod);
      return acc.concat(deps);
    }, [])
  )).reduce((a, m) => (a.includes(m) ? a : a.concat(m)), []);

type TFindAllMissingDependencies = (
  d: string,
  m: TModules,
  rootPkg: TPkgJson
) => Promise<TModules>;
export const findAllMissingDependencies: TFindAllMissingDependencies = (
  dir,
  modules,
  rootPkg
) =>
  findAllDependencies(dir, modules).then(using =>
    findMissingDependencies(using, modules, rootPkg.dependencies)
  );

type TFindAllUnusedDependencies = (
  d: string,
  m: TModules,
  rootPkg: TPkgJson
) => Promise<TModules>;
export const findAllUnusedDependencies: TFindAllUnusedDependencies = (
  dir,
  modules,
  rootPkg
) =>
  findAllDependencies(dir, modules).then(using =>
    findUnusedDependencies(using, modules, rootPkg.dependencies)
  );

type TMakeDependencyMap = (
  d: string,
  m: TModules
) => Promise<{ [k: string]: TModules }>;
export const makeDependencyMap: TMakeDependencyMap = async (dir, modules) =>
  modules.reduce(
    async (acc, mod) => ({
      ...(await acc),
      [mod]: await findDependencies(dir, mod)
    }),
    {}
  );
