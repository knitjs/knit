/* @flow */

import rp from "read-pkg";

import type { TPkgJson } from "@knit/needle";

type TReadPkg = (pkg: {
  path: string,
  workspace: string,
  dir: string
}) => TPkgJson;
const readPkg: TReadPkg = pkg => {
  const ret = rp.sync({
    cwd: pkg.path,
    normalize: false
  });
  if (!ret) {
    throw {
      message: `could not find a \`package.json\` in ${pkg.path}`,
      stderr: `All directories under \`${pkg.workspace}\` are expected to be node modules. To ignore a directory add a 'private: true' to the package.json.`
    };
  }
  return ret;
};

export default readPkg;
