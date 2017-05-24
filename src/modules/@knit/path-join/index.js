/* @flow */

import path from "path";

type TPathJoin = (p: string) => string;
const pathJoin: TPathJoin = (...paths) =>
  path.join(...paths).replace("/", path.sep);

export { pathJoin };
