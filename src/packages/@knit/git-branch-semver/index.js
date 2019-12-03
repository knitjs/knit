/* @flow */
import execa from "execa";

type TNormailzeBranch = (b: string) => Promise<string>;
export const normalizeBranch: TNormailzeBranch = (branch: string) =>
  branch.replace(/(_|\[|\]|\\|\/)/g, "-").replace(/-+/g, "-");

type TCurrentBranch = () => Promise<string>;
export const currentBranch: TCurrentBranch = () =>
  execa("git", ["rev-parse", "--abbrev-ref", "HEAD"]).then(v => v.stdout);
