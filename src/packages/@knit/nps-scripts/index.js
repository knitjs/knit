/* flow */

export const commit = "HEAD~..";
export const pr = "master..";
export const prereleaseVersion = "0.0.0-GIT_SHA";
export const defaultBump = "patch";
export const versionFlags = "";

export const modifiedRange = range => `--scope modified --range ${range}`;

export const bumpVersion = (v, flags) =>
  [
    `yarn knit -- exec --parallel`,
    flags,
    `npm version ${v} --no-git-tag-version`
  ]
    .filter(Boolean)
    .join(" ");

export const version = bumpVersion("KNIT_MODULE_VERSION");
export const release = bumpVersion(defaultBump, modifiedRange(commit));
export const prerelease = bumpVersion(prereleaseVersion, modifiedRange(pr));
export const publish = `yarn knit -- exec --scope unpublished --workspace dist -- npm publish`;

export const scripts = {
  version,
  release,
  prerelease,
  publish
};
