/* @flow */

const pathJoin = require("@knit/path-join");

import { findPackages, findPublicPackages } from "..";

describe("findPackages", () => {
  it("returns list of modules from directories", () => {
    require("fs-extra").__setMockFiles({
      "": ["moduleA", "moduleB"]
    });
    require("read-pkg").__setMockPackages({
      moduleA: { name: "moduleA" },
      moduleB: { name: "moduleB", private: true }
    });
    expect(findPackages("")).toEqual({
      moduleA: "moduleA",
      moduleB: "moduleB"
    });
  });
  it("steps into @scoped directories", () => {
    require("fs-extra").__setMockFiles({
      "": ["moduleA", "@moduleB"],
      "@moduleB": ["moduleC"]
    });
    require("read-pkg").__setMockPackages({
      moduleA: { name: "moduleA" },
      [pathJoin("@moduleB/moduleC")]: {
        name: "@moduleB/moduleC",
        private: true
      }
    });
    expect(findPackages("")).toEqual({
      moduleA: "moduleA",
      "@moduleB/moduleC": pathJoin("@moduleB/moduleC")
    });
  });
  it("handles packages in where the path do not match pkg name", () => {
    require("fs-extra").__setMockFiles({
      "": ["moduleA", "@moduleB"],
      "@moduleB": ["moduleC"]
    });
    require("read-pkg").__setMockPackages({
      moduleA: { name: "@scoped/moduleA" },
      [pathJoin("@moduleB/moduleC")]: {
        name: "@moduleB/moduleC",
        private: true
      }
    });
    expect(findPackages("")).toEqual({
      "@scoped/moduleA": "moduleA",
      "@moduleB/moduleC": pathJoin("@moduleB/moduleC")
    });
  });
});

describe("findPublicPackages", () => {
  it("returns list of modules that have a package.json and have not set `private: true`", () => {
    require("fs-extra").__setMockFiles({
      "": ["moduleA", "moduleB"]
    });
    require("read-pkg").__setMockPackages({
      moduleA: { name: "moduleA" },
      moduleB: { name: "moduleB", private: true }
    });
    expect(findPublicPackages("")).toEqual({
      moduleA: "moduleA"
    });
  });
});
