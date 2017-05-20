import rp from 'read-pkg';

import pathJoin from '@knit/path-join';

type TReadPkg = (d: string, m: string) => TPkgJson;
export default (dir, mod): TReadPkg => {
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
