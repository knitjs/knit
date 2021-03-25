/* @flow */
import execa from "execa";

type TShortSha = (sha: ?string) => Promise<string>;
export const shortSha: TShortSha = sha =>
  execa("git", ["rev-parse", "--short", sha || "HEAD"]).then(v => v.stdout);
