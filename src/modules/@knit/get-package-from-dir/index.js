/* @flow */

import path from 'path';

type TGetPackageFromDir = (d: string) => string;
const getPackageFromDir: TGetPackageFromDir = (dir) => dir.replace(path.sep, '/');

module.exports = getPackageFromDir;
