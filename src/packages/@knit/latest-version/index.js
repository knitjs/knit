/* @flow */
import lv from "latest-version";

type TLatestVersion = (
  pkg: string,
  fallback: string,
  options: any
) => Promise<string>;
export const latestVersion: TLatestVersion = (pkg, fallback, options) =>
  lv(pkg, options)
    // .catch(() => fallback)
    .then(v => v);
