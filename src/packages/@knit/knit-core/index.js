/* @flow */

import type { TPkgJson } from "@knit/needle";
import type { TPackages } from "@knit/find-packages";

import readPkg from "@knit/read-pkg";
import semver from "semver";

export type TPackageNames = Array<string>;

export type TParams = {|
  version: string,
  packagesDir: string,
  pkg: TPkgJson,
  rootPkg: TPkgJson
|};
export type TModulesBreakdown = {|
  internal: TPackageNames,
  updated: TPackageNames,
  used: TPackageNames
|};

type TGetDependencyVersion = (
  ms: TPackages,
  m: TModulesBreakdown,
  p: TParams,
  d: string
) => string;
export const getDependencyVersion: TGetDependencyVersion = (
  modules,
  modulesBreakdown,
  params,
  dep
) => {
  if (params.rootPkg.dependencies && params.rootPkg.dependencies[dep]) {
    return params.rootPkg.dependencies[dep];
  } else if (modulesBreakdown.updated.includes(dep)) {
    return params.version;
  } else if (modulesBreakdown.internal.includes(dep)) {
    const pkg = readPkg(params.packagesDir, modules[dep]);
    if (pkg && pkg.version) {
      return pkg.version;
    }
  }

  throw {
    message: `Missing dependency: ${dep}`,
    stderr: `Could not find ${dep} in the project package.json. Try \`yarn add ${dep}\`.`
  };
};

type TGetPeerDependencyVersion = (
  ms: TPackages,
  m: TModulesBreakdown,
  p: TParams,
  d: string
) => string;
export const getPeerDependencyVersion: TGetPeerDependencyVersion = (
  modules,
  modulesBreakdown,
  params,
  dep
) => {
  const version = params.pkg.peerDependencies[dep];

  if (version === "*") {
    let v;
    if (params.rootPkg.devDependencies[dep]) {
      v = params.rootPkg.devDependencies[dep];
    } else if (params.rootPkg.dependencies[dep]) {
      v = getDependencyVersion(modules, modulesBreakdown, params, dep);
    }

    if (v) {
      if (semver.valid(v)) {
        return semver.major(v).toString();
      } else {
        const r = semver.validRange(v);
        if (r) {
          return r;
        }
      }
    }
  }

  return version;
};

type TGetOptionalDependencyVersion = (
  ms: TPackages,
  m: TModulesBreakdown,
  p: TParams,
  d: string
) => string;
export const getOptionalDependencyVersion: TGetOptionalDependencyVersion = (
  modules,
  modulesBreakdown,
  params,
  dep
) => {
  const version =
    params.pkg.optionalDependencies && params.pkg.optionalDependencies[dep]
      ? params.pkg.optionalDependencies[dep]
      : params.rootPkg.optionalDependencies[dep];

  if (version === "*") {
    if (params.rootPkg.dependencies[dep]) {
      return getDependencyVersion(modules, modulesBreakdown, params, dep);
    }
  }

  return version;
};

type TUpdateModulePkg = (
  m: TPackages,
  mb: TModulesBreakdown,
  p: TParams
) => TPkgJson;
export const updateModulePkg: TUpdateModulePkg = (
  modules,
  modulesBreakdown,
  params
) => {
  const deps = modulesBreakdown.used;
  const peers = Object.keys(params.pkg.peerDependencies || {});
  const opts = Object.keys(params.pkg.optionalDependencies || {});
  params.version = params.version || params.rootPkg.version;

  return {
    homepage: params.rootPkg.homepage,
    license: params.rootPkg.license,
    author: params.rootPkg.author,
    contributors: params.rootPkg.contributors,
    bugs: params.rootPkg.bugs,
    tags: params.rootPkg.tags,
    keywords: params.rootPkg.keywords,
    files: params.rootPkg.files,
    repository: params.rootPkg.repository,
    engines: params.rootPkg.engines,
    os: params.rootPkg.os,
    cpu: params.rootPkg.cpu,
    preferGlobal: params.rootPkg.preferGlobal,
    bundledDependencies: params.rootPkg.bundledDependencies,
    private: false,
    ...params.pkg,
    ...{
      // fall back to project package if no version given in workflow
      version: params.version,
      dependencies: deps.filter(d => !opts.includes(d)).reduce(
        (acc, d) => ({
          ...acc,
          [d]: getDependencyVersion(modules, modulesBreakdown, params, d)
        }),
        {}
      ),
      peerDependencies: peers.reduce(
        (acc, d) => ({
          ...acc,
          [d]: getPeerDependencyVersion(modules, modulesBreakdown, params, d)
        }),
        {}
      ),
      optionalDependencies: opts.reduce(
        (acc, d) => ({
          ...acc,
          [d]: getOptionalDependencyVersion(
            modules,
            modulesBreakdown,
            params,
            d
          )
        }),
        {}
      )
    }
  };
};
