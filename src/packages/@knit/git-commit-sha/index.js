/* @flow */
import execa from "execa";

type TShortSha = () => Promise<string>;
export const shortSha: TShortSha = () =>
  execa("git", ["rev-parse", "--short", "HEAD"]).then(v => v.stdout);
