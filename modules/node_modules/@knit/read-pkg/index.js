import rp from 'read-pkg';

import pathJoin from '@knit/path-join';

type TReadPkg = (d: string, m: string) => TPkgJson;
export default (dir, mod): TReadPkg => {
  try {
    return rp.sync(pathJoin(dir, mod), {
      normalize: false,
    });
  } catch (err) {
    throw {
      message: `could not find a \`package.json\` in ${pathJoin(dir, mod)}.`,
      stderr: `All directories under ${dir} are expected to be node modules. To ignore a directory add a 'private: true' to the package.json.`,
    };
  }
};
