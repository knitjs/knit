/* @flow */
import { findPublicPackages } from "@knit/find-packages";
import {
  findModifiedSince,
  findModifiedPackages
} from "@knit/find-modified-packages";
import needle from "@knit/needle";
import { normalizeBranch, currentBranch } from "@knit/git-branch-semver";

const modulesMap = findPublicPackages(needle.paths.workspace);

const modifiedSince = findModifiedSince(
  needle.paths.workspace,
  modulesMap,
  "master.."
);

export const prerelease = async () => {
  const modifiedPackages = await findModifiedPackages(
    modulesMap,
    modifiedSince
  );

  if (modifiedPackages.length) {
    const branch = normalizeBranch(await currentBranch());
    // $FlowIgnore
    markdown(
      `
<details>
<summary>We found that ${
        modifiedPackages.length
      } packages have been modified by this PR.</summary>
<br/>

\`\`\`    
${modifiedPackages.join("\n")}
\`\`\`
</details>

You can install the pre-release version of these packages by running:

\`\`\`
yarn add ${modifiedPackages.map(m => `${m}@${branch}`).join(" ")}
\`\`\`
`
    );
  }
};
