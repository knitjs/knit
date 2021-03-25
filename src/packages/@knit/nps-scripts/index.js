/* flow */

export const commit = "HEAD~..";
export const pr = "master...";
export const prereleaseVersion = "0.0.0-pre-GIT_SHA";
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

export const version = {
  script: bumpVersion("KNIT_MODULE_VERSION"),
  description: "Set the packages to their latest published versions"
};
export const release = {
  script: bumpVersion(defaultBump, modifiedRange(commit)),
  description:
    "Bump the version of all modified packages to prepare for publish"
};
export const prerelease = {
  script: bumpVersion(prereleaseVersion, modifiedRange(pr)),
  description:
    "Set a pre-release version for all modified packages based on the git sha"
};
export const publish = {
  script: `yarn knit -- exec --scope unpublished --workspace dist -- npm publish`,
  description: "Publish all unpublished packages to the registry"
};

export const scripts = {
  version,
  release,
  prerelease,
  publish
};
