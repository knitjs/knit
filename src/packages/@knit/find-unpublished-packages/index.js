/* @flow */

import type { TPackages } from "@knit/find-packages";

import readPkg from "@knit/read-pkg";
import execa from "execa";

type TFindUnpublishedPackages = (m: TPackages) => Promise<string[]>;
const findUnpublishedPackages: TFindUnpublishedPackages = modules =>
  Promise.all(
    Object.keys(modules).map((m: string) =>
      execa("npm", ["info", m, "versions", "--json"], {})
        .then((vs): {
          name: string,
          versions: string[]
        } => ({
          name: m,
          versions: JSON.parse(vs.stdout)
        }))
        .catch(() => ({ name: m, versions: [] }))
    )
  ).then(infos =>
    infos.reduce((acc: string[], info) => {
      const pkg = readPkg(modules[info.name]);
      return !info.versions.includes(pkg.version) ? acc.concat(info.name) : acc;
    }, [])
  );

export default findUnpublishedPackages;
