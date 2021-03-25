/* @flow */
import { difference } from "lodash";

import { findPublicPackages } from "@knit/find-packages";
import {
  findModifiedSince,
  findModifiedPackages
} from "@knit/find-modified-packages";
import needle from "@knit/needle";
import { shortSha } from "@knit/git-commit-sha";

export const prerelease = async () => {
  const modulesMap = findPublicPackages(needle.paths.workspace);

  const modifiedSince = findModifiedSince(
    needle.paths.workspace,
    modulesMap,
    // just being lazy
    // $FlowIgnore
    `${process.env.GITHUB_BASE_REF}...`
  );

  if (modifiedSince.length === 0) {
    // $FlowIgnore
    markdown(`
    No packages have been modified. 
      `);
    return;
  }

  const modifiedPackages = await findModifiedPackages(
    modulesMap,
    modifiedSince
  );

  const dependantPackage = difference(modifiedPackages, modifiedSince);

  if (modifiedPackages.length) {
    const previewCommit = await shortSha();

    // $FlowIgnore
    markdown(
      `
<details>
<summary>${
        modifiedSince.length !== 1
          ? `We have found ${modifiedSince.length} packages that have been modified by this PR.`
          : `We have found one package that has been modified by this PR.`
      }</summary>
<br/>

\`\`\`    
${modifiedSince.join("\n")}
\`\`\`
</details>

${
  dependantPackage.length
    ? `
<details>
<summary>We also found ${
        dependantPackage.length
      } additional packages that depended on those modified packages</summary>
<br/>

\`\`\`    
${dependantPackage.join("\n")}
\`\`\`
</details>
`
    : ""
}

You can install the pre-release version of ${
        modifiedPackages.length > 1 ? "these packages" : "this package"
      } by running:

\`\`\`
yarn add ${modifiedPackages
        .map(m => `${m}@0.0.0-pre-${previewCommit}`)
        .join(" ")}
\`\`\`
`
    );
  }
};
