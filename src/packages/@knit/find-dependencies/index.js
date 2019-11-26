/* @flow */

import type { TPkgJson, TPkgJsonDeps } from "@knit/needle";
import type { TPackageNames } from "@knit/knit-core";
import type { TPackages, TPackagePaths } from "@knit/find-packages";

import depcheck from "@knit/depcheck";
import readPkg from "@knit/read-pkg";

type TFindDependencies = (paths: TPackagePaths) => Promise<TPackageNames>;
export const findDependencies: TFindDependencies = paths =>
  depcheck(paths.path)
    .then(res => Object.keys(res.using))
    .then(using => {
      const pkg = readPkg(paths);
      const deps = Object.keys((pkg || {}).dependencies || {});
      const peers = Object.keys((pkg || {}).peerDependencies || {});

      return using.concat(deps).filter(d => !peers.includes(d));
    })
    .then(using =>
      using.reduce((acc, d) => (acc.includes(d) ? acc : acc.concat(d)), [])
    )
    .then(using => using.sort())
    .catch(e => {
      throw e;
    });

type TFindMissingDependencies = (
  u: TPackageNames,
  m: TPackageNames,
  d: TPkgJsonDeps
) => TPackageNames;
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
  u: TPackageNames,
  m: TPackageNames,
  d: TPkgJsonDeps
) => TPackageNames;
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

type TFindInternalDependencies = (
  u: TPackageNames,
  m: TPackageNames
) => TPackageNames;
export const findInternalDependencies: TFindInternalDependencies = (
  using,
  modules
) =>
  using
    .filter(m => modules.includes(m))
    .reduce((acc, d) => (acc.includes(d) ? acc : acc.concat(d)), []);

type TFindAllDependencies = (m: TPackages) => Promise<TPackageNames>;
export const findAllDependencies: TFindAllDependencies = async modules =>
  (await Promise.all(
    Object.keys(modules).reduce((acc, mod) => {
      const deps = findDependencies(modules[mod]);
      return acc.concat(deps);
    }, [])
  )).reduce((a, m) => (a.includes(m) ? a : a.concat(m)), []);

type TFindAllMissingDependencies = (
  m: TPackages,
  rootPkg: TPkgJson
) => Promise<TPackageNames>;
export const findAllMissingDependencies: TFindAllMissingDependencies = (
  modules,
  rootPkg
) =>
  findAllDependencies(modules).then(using =>
    findMissingDependencies(using, Object.keys(modules), rootPkg.dependencies)
  );

type TFindAllUnusedDependencies = (
  m: TPackages,
  rootPkg: TPkgJson
) => Promise<TPackageNames>;
export const findAllUnusedDependencies: TFindAllUnusedDependencies = (
  modules,
  rootPkg
) =>
  findAllDependencies(modules).then(using =>
    findUnusedDependencies(using, Object.keys(modules), rootPkg.dependencies)
  );

type TMakeDependencyMap = (
  m: TPackages
) => Promise<{ [k: string]: TPackageNames }>;
export const makeDependencyMap: TMakeDependencyMap = async modules =>
  Object.keys(modules).reduce(
    async (acc, mod) => ({
      ...(await acc),
      [mod]: await findDependencies(modules[mod])
    }),
    {}
  );
