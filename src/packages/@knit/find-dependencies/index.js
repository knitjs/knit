/* @flow */

import type { TPkgJson, TPkgJsonDeps } from "@knit/needle";
import type { TPackageNames } from "@knit/knit-core";
import type { TPackages } from "@knit/find-packages";

import depcheck from "@knit/depcheck";
import pathJoin from "@knit/path-join";
import readPkg from "@knit/read-pkg";

type TFindDependencies = (d: string, m: string) => Promise<TPackageNames>;
export const findDependencies: TFindDependencies = (dir, modDir) =>
  depcheck(pathJoin(dir, modDir))
    .then(res => Object.keys(res.using))
    .then(using => {
      const pkg = readPkg(dir, modDir);
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

type TFindAllDependencies = (d: string, m: TPackages) => Promise<TPackageNames>;
export const findAllDependencies: TFindAllDependencies = async (dir, modules) =>
  (await Promise.all(
    Object.keys(modules).reduce((acc, mod) => {
      const deps = findDependencies(dir, modules[mod]);
      return acc.concat(deps);
    }, [])
  )).reduce((a, m) => (a.includes(m) ? a : a.concat(m)), []);

type TFindAllMissingDependencies = (
  d: string,
  m: TPackages,
  rootPkg: TPkgJson
) => Promise<TPackageNames>;
export const findAllMissingDependencies: TFindAllMissingDependencies = (
  dir,
  modules,
  rootPkg
) =>
  findAllDependencies(dir, modules).then(using =>
    findMissingDependencies(using, Object.keys(modules), rootPkg.dependencies)
  );

type TFindAllUnusedDependencies = (
  d: string,
  m: TPackages,
  rootPkg: TPkgJson
) => Promise<TPackageNames>;
export const findAllUnusedDependencies: TFindAllUnusedDependencies = (
  dir,
  modules,
  rootPkg
) =>
  findAllDependencies(dir, modules).then(using =>
    findUnusedDependencies(using, Object.keys(modules), rootPkg.dependencies)
  );

type TMakeDependencyMap = (
  d: string,
  m: TPackages
) => Promise<{ [k: string]: TPackageNames }>;
export const makeDependencyMap: TMakeDependencyMap = async (dir, modules) =>
  Object.keys(modules).reduce(
    async (acc, mod) => ({
      ...(await acc),
      [mod]: await findDependencies(dir, modules[mod])
    }),
    {}
  );
