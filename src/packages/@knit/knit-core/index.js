/* @flow */

import type { TPkgJson } from "@knit/needle";

import readPkg from "@knit/read-pkg";
import semver from "semver";

export type TModules = Array<string>;

export type TParams = {|
  version: string,
  packagesDir: string,
  pkg: TPkgJson,
  rootPkg: TPkgJson
|};
export type TModulesMap = {|
  internal: TModules,
  updated: TModules,
  used: TModules
|};

type TGetDependencyVersion = (d: string, m: TModulesMap, p: TParams) => string;
export const getDependencyVersion: TGetDependencyVersion = (
  dep,
  modules,
  params
) => {
  if (params.rootPkg.dependencies && params.rootPkg.dependencies[dep]) {
    return params.rootPkg.dependencies[dep];
  } else if (modules.updated.includes(dep)) {
    return params.version;
  } else if (modules.internal.includes(dep)) {
    const pkg = readPkg(params.packagesDir, dep);
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
  d: string,
  m: TModulesMap,
  p: TParams
) => string;
export const getPeerDependencyVersion: TGetPeerDependencyVersion = (
  dep,
  modules,
  params
) => {
  const version = params.pkg.peerDependencies[dep];

  if (version === "*") {
    let v;
    if (params.rootPkg.devDependencies[dep]) {
      v = params.rootPkg.devDependencies[dep];
    } else if (params.rootPkg.dependencies[dep]) {
      v = getDependencyVersion(dep, modules, params);
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
  d: string,
  m: TModulesMap,
  p: TParams
) => string;
export const getOptionalDependencyVersion: TGetOptionalDependencyVersion = (
  dep,
  modules,
  params
) => {
  const version = params.pkg.optionalDependencies &&
    params.pkg.optionalDependencies[dep]
    ? params.pkg.optionalDependencies[dep]
    : params.rootPkg.optionalDependencies[dep];

  if (version === "*") {
    if (params.rootPkg.dependencies[dep]) {
      return getDependencyVersion(dep, modules, params);
    }
  }

  return version;
};

type TUpdateModulePkg = (m: TModulesMap, p: TParams) => TPkgJson;
export const updateModulePkg: TUpdateModulePkg = (modules, params) => {
  const deps = modules.used;
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
          [d]: getDependencyVersion(d, modules, params)
        }),
        {}
      ),
      peerDependencies: peers.reduce(
        (acc, d) => ({
          ...acc,
          [d]: getPeerDependencyVersion(d, modules, params)
        }),
        {}
      ),
      optionalDependencies: opts.reduce(
        (acc, d) => ({
          ...acc,
          [d]: getOptionalDependencyVersion(d, modules, params)
        }),
        {}
      )
    }
  };
};
