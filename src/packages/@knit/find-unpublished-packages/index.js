/* @flow */

import type { TPackages } from "@knit/find-packages";

import readPkg from "@knit/read-pkg";
import execa from "execa";

type TFindUnpublishedPackages = (
  d: string,
  m: TPackages
) => Promise<Array<string>>;
const findUnpublishedPackages: TFindUnpublishedPackages = (dir, modules) =>
  Promise.all(
    Object.keys(modules).map(m =>
      execa
        .stdout("npm", ["info", m, "versions", "--json"])
        .then(vs => ({ name: m, versions: vs }))
        .catch(() => ({ name: m, versions: [] }))
    )
  ).then(infos =>
    infos.reduce((acc, info) => {
      const pkg = readPkg(dir, modules[info.name]);
      return !info.versions.includes(pkg.version) ? acc.concat(info.name) : acc;
    }, [])
  );

export default findUnpublishedPackages;
