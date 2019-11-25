/* @flow */

import fs from "fs-extra";

import isScoped from "@knit/is-scoped";
import pathJoin from "@knit/path-join";
import readPkg from "@knit/read-pkg";

export type TPackagePaths = {
  dir: string,
  workspace: string,
  path: string,
  private?: boolean
};

export type TPackages = {
  [string]: TPackagePaths
};

type TFindPackages = (ws: string) => TPackages;
export const findPackages: TFindPackages = workspace => {
  try {
    return fs
      .readdirSync(workspace)
      .reduce(
        (acc, d) =>
          isScoped(d)
            ? acc.concat(
                fs
                  .readdirSync(pathJoin(workspace, d))
                  .map(dir => pathJoin(d, dir))
              )
            : acc.concat(d),
        []
      )
      .filter(d => fs.statSync(pathJoin(workspace, d)).isDirectory())
      .reduce((acc, d) => {
        const dirs = {
          dir: pathJoin(d),
          workspace: pathJoin(workspace),
          path: pathJoin(workspace, d)
        };

        const pkg = readPkg(dirs);
        return {
          ...acc,
          [pkg.name]: {
            ...dirs,
            private: !!pkg.private
          }
        };
      }, {});
  } catch (err) {
    throw err;
  }
};

type TFindPublicPackages = (ws: string) => TPackages;
export const findPublicPackages: TFindPublicPackages = workspace => {
  const pkgs = findPackages(workspace);
  return Object.keys(pkgs)
    .filter(k => !pkgs[k].private)
    .reduce(
      (acc, pkg) => ({
        ...acc,
        [pkg]: pkgs[pkg]
      }),
      {}
    );
};
