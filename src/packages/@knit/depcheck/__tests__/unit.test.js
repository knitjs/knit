/* flow */

import pathJoin from "@knit/path-join";

import depcheck from "..";

jest.mock("@knit/needle", () => {
  const path = require("path");

  return {
    paths: {
      rootDir: path.resolve(path.join(process.cwd(), "__fixtures__", "configs"))
    }
  };
});

describe("Special Eslint", () => {
  it("returns presets and plugins", async () => {
    const m = await depcheck(pathJoin("eslint-config"));

    expect(Object.keys(m.using)).toEqual([
      "@typescript-eslint/parser",

      "eslint-plugin-shorthand-pl",
      "eslint-plugin-test",
      "@ns/eslint-plugin",
      "@ns/eslint-plugin-shorthand-pl",
      "@ns/eslint-plugin-test",
      "@typescript-eslint/eslint-plugin",

      "eslint-config-shorthand-ex",
      "eslint-config-test",
      "@ns/eslint-config",
      "@ns/eslint-config-shorthand-ex",
      "@ns/eslint-config-test",
      "eslint-config-module",
      "@ns/eslint-config-module",

      "eslint-plugin-module",
      "@ns/eslint-plugin-module",

      "@foo/eslint-plugin-foo",
      "@bar/eslint-plugin",
      "eslint-plugin-prettier",
      "eslint-config-prettier"
    ]);
  });
});
