/* @flow */

import type { TPkgJson } from '@knit/needle';

import readPkg from '@knit/read-pkg';

export type TModules = Array<string>;

export type TParams = {| version: string, packagesDir: string, pkg: TPkgJson, rootPkg: TPkgJson |};
export type TModulesMap = {| internal: TModules, updated: TModules, used: TModules |};

type TGetDependencyVersion = (d: string, m: TModulesMap, p: TParams) => string;
export const getDependencyVersion: TGetDependencyVersion = (dep, modules, params) => {
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
    stderr: `Could not find ${dep} in the project package.json. Try \`yarn add ${dep}\`.`,
  };
};

type TGetPeerDependencyVersion = (d: string, m: TModulesMap, p: TParams) => string;
export const getPeerDependencyVersion: TGetPeerDependencyVersion = (dep, modules, params) => {
  const version = (params.pkg.peerDependencies && params.pkg.peerDependencies[dep])
    ? params.pkg.peerDependencies[dep]
    : params.rootPkg.peerDependencies[dep];

  if (version === '*') {
    const v = (params.rootPkg.devDependencies && params.rootPkg.devDependencies[dep])
      ? params.rootPkg.devDependencies[dep]
      : getDependencyVersion(dep, modules, params);

    return parseInt(v.replace(/^[^\d]/, ''), 10).toString();
  }

  return version;
};

type TGetOptionalDependencyVersion = (d: string, m: TModulesMap, p: TParams) => string;
export const getOptionalDependencyVersion: TGetOptionalDependencyVersion = (dep, modules, params) => {
  const version = (params.pkg.optionalDependencies && params.pkg.optionalDependencies[dep])
    ? params.pkg.optionalDependencies[dep]
    : params.rootPkg.optionalDependencies[dep];

  if (version === '*') {
    return getDependencyVersion(dep, modules, params);
  }

  return version;
};

type TUpdateModulePkg = (m: TModulesMap, p: TParams) => TPkgJson;
export const updateModulePkg: TUpdateModulePkg = (modules, params) => {
  const deps = modules.used.concat(Object.keys(params.pkg.dependencies || {}));
  const peers = Object.keys(params.pkg.peerDependencies || {}).concat(
    Object.keys(params.rootPkg.peerDependencies || {})
  );
  const opts = Object.keys(params.pkg.optionalDependencies || {}).concat(
    Object.keys(params.rootPkg.optionalDependencies || {})
  );
  params.version = params.version || params.rootPkg.version;

  return ({
    homepage: params.rootPkg.homepage,
    license: params.rootPkg.license,
    bugs: params.rootPkg.bugs,
    tags: params.rootPkg.tags,
    keywords: params.rootPkg.keywords,
    files: params.rootPkg.files,
    repository: params.rootPkg.repository,
    engines: params.rootPkg.engines,
    author: params.rootPkg.author,
    private: false,
    ...params.pkg,
    ...{
        // fall back to project package if no version given in workflow
      version: params.version,
      dependencies: deps.filter(d => !peers.includes(d) && !opts.includes(d)).reduce((acc, d) => ({
        ...acc,
        [d]: getDependencyVersion(d, modules, params),
      }), {}),
      peerDependencies: peers.reduce((acc, d) => ({
        ...acc,
        [d]: getPeerDependencyVersion(d, modules, params),
      }), {}),
      optionalDependencies: opts.reduce((acc, d) => ({
        ...acc,
        [d]: getOptionalDependencyVersion(d, modules, params),
      }), {}),
    },
  });
};
