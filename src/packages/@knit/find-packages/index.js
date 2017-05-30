/* @flow */

import fs from "fs-extra";

import isScoped from "@knit/is-scoped";
import pathJoin from "@knit/path-join";
import getPackageFromDir from "@knit/get-package-from-dir";
import readPkg from "@knit/read-pkg";

type TModules = Array<string>;

type TFindPackages = (p: string) => TModules;
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
      .map(getPackageFromDir);
  } catch (err) {
    throw {
      message: "Modules directory could not be read.",
      stderr: `Make sure your modules are in \`${packagePath}\``
    };
  }
};

type TFindPublicPackages = (p: string) => TModules;
export const findPublicPackages: TFindPublicPackages = packagePath =>
  findPackages(packagePath).filter(m => {
    const pkg = readPkg(packagePath, m);
    return pkg && !pkg.private;
  });
