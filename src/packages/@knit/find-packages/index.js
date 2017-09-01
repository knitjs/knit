/* @flow */

import fs from "fs-extra";

import isScoped from "@knit/is-scoped";
import pathJoin from "@knit/path-join";
import readPkg from "@knit/read-pkg";

export type TPackages = { [string]: string };

type TFindPackages = (p: string) => TPackages;
export const findPackages: TFindPackages = packagePath => {
  try {
    return fs
      .readdirSync(packagePath)
      .reduce(
        (acc, d) =>
          isScoped(d)
            ? acc.concat(
                fs
                  .readdirSync(pathJoin(packagePath, d))
                  .map(dir => pathJoin(d, dir))
              )
            : acc.concat(d),
        []
      )
      .filter(d => fs.statSync(pathJoin(packagePath, d)).isDirectory())
      .reduce(
        (acc, d) => ({
          ...acc,
          [readPkg(packagePath, pathJoin(d)).name]: pathJoin(d)
        }),
        {}
      );
  } catch (err) {
    throw {
      message: "Modules directory could not be read.",
      stderr: `Make sure your modules are in \`${packagePath}\``
    };
  }
};

type TFindPublicPackages = (p: string) => TPackages;
export const findPublicPackages: TFindPublicPackages = packagePath => {
  const pkgs = findPackages(packagePath);
  return Object.keys(pkgs)
    .filter(m => {
      const pkg = readPkg(packagePath, pkgs[m]);
      return pkg && !pkg.private;
    })
    .reduce(
      (acc, m) => ({
        ...acc,
        [m]: pkgs[m]
      }),
      {}
    );
};
