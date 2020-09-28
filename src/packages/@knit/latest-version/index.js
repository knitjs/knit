/* @flow */
import execa from "execa";

type TLatestVersion = (pkg: string, fallback: string) => Promise<string>;
export const latestVersion: TLatestVersion = (pkg, fallback) =>
  execa("npm", ["info", pkg, "version"])
    .catch(err => {
      if (err.stderr.includes("404")) {
        return "0.0.0";
      }
      throw err;
    })
    .then(v => v.stdout);
