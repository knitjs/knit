/* @flow */

import rp from 'read-pkg';

import pathJoin from '@knit/path-join';

import type { TPkgJson } from '@knit/needle';

type TReadPkg = (d: string, m: string) => TPkgJson;
 const readPkg: TReadPkg = (dir, mod) => {
  const ret = rp.sync(pathJoin(dir, mod), {
    normalize: false,
  });
  if (!ret) {
    throw {
      message: `could not find a \`package.json\` in ${pathJoin(dir, mod)}.`,
      stderr: `All directories under ${dir} are expected to be node modules. To ignore a directory add a 'private: true' to the package.json.`,
    };
  }
  return ret;
};

export default readPkg;