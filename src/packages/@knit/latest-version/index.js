/* @flow */
import execa from "execa";

type TLatestVersion = (pkg: string, fallback: string) => Promise<string>;
export const latestVersion: TLatestVersion = (pkg, fallback) =>
  execa("npm", ["info", pkg, "version"])
    .then(v => (v.stdout.length === 0 ? fallback : v.stdout))
    .catch(err => {
      if (err.stderr.includes("404") || err.stdout.length === 0) {
        return "0.0.0";
      }
      throw err;
    });
