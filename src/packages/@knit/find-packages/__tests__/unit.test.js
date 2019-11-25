/* @flow */

const pathJoin = require("@knit/path-join");

import { findPackages, findPublicPackages } from "..";

describe("findPackages", () => {
  it("returns list of modules from workspace", () => {
    require("fs-extra").__setMockFiles({
      ws: ["moduleA", "moduleB"]
    });
    require("read-pkg").__setMockPackages({
      [pathJoin("ws/moduleA")]: { name: "moduleA" },
      [pathJoin("ws/moduleB")]: { name: "moduleB" }
    });
    expect(findPackages("ws")).toEqual({
      moduleA: {
        dir: "moduleA",
        workspace: "ws",
        path: pathJoin("ws/moduleA"),
        private: false
      },
      moduleB: {
        dir: "moduleB",
        workspace: "ws",
        path: pathJoin("ws/moduleB"),
        private: false
      }
    });
  });
  it("steps into @scoped directories", () => {
    require("fs-extra").__setMockFiles({
      ws: ["moduleA", "@moduleB"],
      "ws/@moduleB": ["moduleC"]
    });
    require("read-pkg").__setMockPackages({
      [pathJoin("ws/moduleA")]: { name: "moduleA", private: false },
      [pathJoin("ws/@moduleB/moduleC")]: {
        name: "@moduleB/moduleC",
        private: true
      }
    });
    expect(findPackages("ws")).toEqual({
      moduleA: {
        dir: "moduleA",
        workspace: "ws",
        path: pathJoin("ws/moduleA"),
        private: false
      },
      [pathJoin("@moduleB/moduleC")]: {
        dir: "@moduleB/moduleC",
        workspace: "ws",
        path: pathJoin("ws/@moduleB/moduleC"),
        private: true
      }
    });
  });
  it("handles packages in where the path do not match pkg name", () => {
    require("fs-extra").__setMockFiles({
      ws: ["moduleA", "@moduleB"],
      "ws/@moduleB": ["moduleC"]
    });
    require("read-pkg").__setMockPackages({
      [pathJoin("ws/moduleA")]: { name: "@scoped/moduleA" },
      [pathJoin("ws/@moduleB/moduleC")]: {
        name: "@moduleB/moduleC",
        private: true
      }
    });
    expect(findPackages("ws")).toEqual({
      "@scoped/moduleA": {
        dir: "moduleA",
        workspace: "ws",
        path: pathJoin("ws/moduleA"),
        private: false
      },
      "@moduleB/moduleC": {
        dir: "@moduleB/moduleC",
        workspace: "ws",
        path: pathJoin("ws/@moduleB/moduleC"),
        private: true
      }
    });
  });
});

describe("findPublicPackages", () => {
  it("returns list of modules that have a package.json and have not set `private: true`", () => {
    require("fs-extra").__setMockFiles({
      ws: ["moduleA", "moduleB", "moduleAA", "moduleBB"]
    });
    require("read-pkg").__setMockPackages({
      [pathJoin("ws/moduleA")]: { name: "moduleA" },
      [pathJoin("ws/moduleB")]: { name: "moduleB", private: true },
      [pathJoin("ws/moduleAA")]: { name: "moduleAA" },
      [pathJoin("ws/moduleBB")]: { name: "moduleBB" }
    });
    expect(findPublicPackages("ws")).toEqual({
      moduleA: {
        dir: "moduleA",
        workspace: "ws",
        path: pathJoin("ws/moduleA"),
        private: false
      },
      moduleAA: {
        dir: "moduleAA",
        workspace: "ws",
        path: pathJoin("ws/moduleAA"),
        private: false
      },
      moduleBB: {
        dir: "moduleBB",
        workspace: "ws",
        path: pathJoin("ws/moduleBB"),
        private: false
      }
    });
  });
});
