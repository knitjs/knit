/* @flow */
import lv from "latest-version";

type TLatestVersion = (
  pkg: string,
  fallback: string,
  options: any
) => Promise<string>;
export const latestVersion: TLatestVersion = (pkg, fallback, options) =>
  lv(pkg, options)
    .catch(err => {
      console.log({pkg, options})
      console.log(process.env)
      throw err
    })
    .then(v => v);
