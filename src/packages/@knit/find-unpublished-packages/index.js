/* @flow */

import type { TModules } from "@knit/knit-core";

import readPkg from "@knit/read-pkg";

const yarn = require("@knit/yarn-utils");

type TFindUnpublishedPackages = (
  d: string,
  m: TModules
) => Promise<Array<string>>;
const findUnpublishedPackages: TFindUnpublishedPackages = (dir, modules) =>
  Promise.all(
    modules.map(m =>
      yarn
        .publishedVersions(m)
        .then(vs => ({ name: m, versions: vs }))
        .catch(() => ({ name: m, versions: [] }))
    )
  ).then(infos =>
    infos.reduce((acc, info) => {
      const pkg = readPkg(dir, info.name);
      return !info.versions.includes(pkg.version) ? acc.concat(info.name) : acc;
    }, [])
  );

export default findUnpublishedPackages;
