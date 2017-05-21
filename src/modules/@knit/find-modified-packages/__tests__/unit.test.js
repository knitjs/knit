/* flow */

import { findModifiedPackages, resolveCascadingUpdates } from "..";

jest.mock("@knit/find-dependencies", () => ({
  makeDependencyMap: jest.fn(
    () =>
      new Promise(resolve =>
        resolve({
          "@scope/package": ["modA", "modB"],
          packageB: ["modC", "modD"]
        })
      )
  )
}));

describe("findModifiedPackages", () => {
  it("returns a map of modules and their dependencies", async () => {
    const m = await findModifiedPackages(
      "",
      ["@scope/package", "packageB", "modD"],
      ["modD"]
    );
    expect(m).toEqual(["modD", "packageB"]);
  });
});

describe("resolveDependencies", () => {
  const rd = resolveCascadingUpdates;
  const modules = ["mod1", "mod2", "mod3", "mod4"];

  it("returns an empty array when there are no modified modules", () => {
    expect(rd(modules, {}, [])).toEqual([]);
  });
  it("returns modified modules with no mapping", () => {
    const modified = ["mod1", "mod2"];
    expect(rd(modules, {}, modified)).toEqual(modified);
  });
  it("handles one level of dependencies", () => {
    const modified = ["mod1"];
    const mapping = {
      mod1: [],
      mod2: ["mod1"],
      mod3: ["mod1"]
    };
    const resolved = ["mod1", "mod2", "mod3"];
    expect(rd(modules, mapping, modified)).toEqual(resolved);
  });
  it("handles one level of multiple dependencies", () => {
    const modified = ["mod0"];
    const mapping = {
      mod0: [],
      mod1: ["mod0"],
      mod2: ["mod0", "mod1"],
      mod3: ["mod0", "mod1"],
      mod4: ["mod0", "mod2", "mod3"]
    };
    const resolved = ["mod0", "mod1", "mod2", "mod3", "mod4"];
    expect(rd(modules, mapping, modified)).toEqual(resolved);
  });
  it("handles multiple modified modules", () => {
    const modified = ["mod1", "mod2"];
    const mapping = {
      mod0: [],
      mod1: ["mod0"],
      mod2: ["mod0", "mod1"],
      mod3: ["mod0"],
      mod4: ["mod2", "mod3"]
    };
    const resolved = ["mod1", "mod2", "mod4"];
    expect(rd(modules, mapping, modified)).toEqual(resolved);
  });
  it("handles multiple level dependencies", () => {
    const modified = ["mod0"];
    const mapping = {
      mod0: [],
      mod1: ["mod0"],
      mod2: ["mod1"],
      mod3: ["mod2"],
      mod4: ["mod3"],
      mod5: []
    };
    const resolved = ["mod0", "mod1", "mod2", "mod3", "mod4"];
    expect(rd(modules, mapping, modified)).toEqual(resolved);
  });
  it("handles cyclic dependencies", () => {
    const modified = ["mod0"];
    const mapping = {
      mod0: ["mod1"],
      mod1: ["mod0"]
    };
    const resolved = ["mod0", "mod1"];
    expect(rd(modules, mapping, modified)).toEqual(resolved);
  });
});
