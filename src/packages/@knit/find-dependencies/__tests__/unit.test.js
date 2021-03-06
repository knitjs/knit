/* flow */

import path from "path";

import pathJoin from "@knit/path-join";

import * as knit from "..";

const mockPath = path;

require("read-pkg").__setMockPackages({
  [mockPath.join("ws", "@scope", "package")]: {},
  [mockPath.join("ws", "packageB")]: {
    peerDependencies: {
      modD: 1
    }
  },
  [mockPath.join("ws", "@yarn", "workspaces")]: {
    dependencies: {
      extDep: 1
    }
  }
});

jest.mock("@knit/depcheck", () =>
  jest.fn(
    module =>
      new Promise(resolve =>
        resolve({
          using: {
            [mockPath.join("ws", "@scope", "package")]: { modA: [], modB: [] },
            [mockPath.join("ws", "packageB")]: { modC: [], modD: [] },
            [mockPath.join("ws", "modD")]: {}
          }[module]
        })
      )
  )
);

describe("findDependencies", () => {
  const fd = knit.findDependencies;

  it("returns list of modules", async () => {
    const ms = await fd({
      workspace: "ws",
      dir: pathJoin("@scope/package"),
      path: pathJoin("ws/@scope/package")
    });
    expect(ms).toEqual(["modA", "modB"]);
  });
  it("should not count peerDependencies", async () => {
    const ms = await fd({
      workspace: "ws",
      dir: "packageB",
      path: pathJoin("ws/packageB")
    });
    expect(ms).toEqual(["modC"]);
  });
});

describe("findAllDependencies", () => {
  const fad = knit.findAllDependencies;

  it("returns list of dependencies used by modules", async () => {
    const ms = await fad([
      {
        workspace: "ws",
        dir: pathJoin("@scope/package"),
        path: pathJoin("ws/@scope/package")
      },
      {
        workspace: "ws",
        dir: "packageB",
        path: pathJoin("ws/packageB")
      }
    ]);
    expect(ms).toEqual(["modA", "modB", "modC"]);
  });
});

describe("findMissingDependencies", () => {
  const md = knit.findMissingDependencies;

  it("returns list of missing modules", () => {
    const ms = md(["modA"], {}, { dependencies: {} });
    expect(ms).toEqual(["modA"]);
  });
  it("returns empty list when nothing missing", () => {
    const ms = md(["modA"], {}, { dependencies: { modA: "1" } });
    expect(ms).toEqual([]);
  });
  it("does not consider internal modules as missing", () => {
    const ms = md(
      ["modA", "modB"],
      { modB: {} },
      { dependencies: { modA: "1" } }
    );
    expect(ms).toEqual([]);
  });

  it("does consider internal modules as missing when in a yarn workspace", () => {
    const ms = md(
      ["modA", "@yarn/workspaces"],
      {
        "@yarn/workspaces": {
          workspace: "ws",
          dir: pathJoin("@yarn/workspaces"),
          path: pathJoin("ws/@yarn/workspaces")
        }
      },
      { dependencies: { modA: "1" }, workspaces: {} }
    );
    expect(ms).toEqual(["@yarn/workspaces"]);
  });

  it("looks for dependencies on the package when in a yarn workspace", () => {
    const ms = md(
      ["extDep"],
      {
        "@yarn/workspaces": {
          workspace: "ws",
          dir: pathJoin("@yarn/workspaces"),
          path: pathJoin("ws/@yarn/workspaces")
        }
      },
      { dependencies: {}, workspaces: {} }
    );
    expect(ms).toEqual([]);
  });
});

describe("findAllMissingDependencies", () => {
  const famd = knit.findAllMissingDependencies;

  it("returns list of dependencies used by modules", async () => {
    const ms = await famd(
      [
        {
          workspace: "ws",
          dir: pathJoin("@scope/package"),
          path: pathJoin("ws/@scope/package")
        },
        {
          workspace: "ws",
          dir: "packageB",
          path: pathJoin("ws/packageB")
        }
      ],
      {
        dependencies: { modA: "1", modC: "1" }
      }
    );
    expect(ms).toEqual(["modB"]);
  });
});

describe("findUnusedDependencies", () => {
  const ud = knit.findUnusedDependencies;

  it("returns list of unused modules", () => {
    const ms = ud([], {}, { dependencies: { modA: 1 } });
    expect(ms).toEqual(["modA"]);
  });
  it("returns empty list when nothing unused", () => {
    const ms = ud(["modA"], {}, { dependencies: { modA: "1" } });
    expect(ms).toEqual([]);
  });
  it("does not consider internal modules as unused", () => {
    const ms = ud(["modA"], ["modB"], { dependencies: { modA: "1" } });
    expect(ms).toEqual([]);
  });
});

describe("findAllUnusedDependencies", () => {
  const faud = knit.findAllUnusedDependencies;

  it("returns list of unused dependencies", async () => {
    const ms = await faud(
      [
        {
          workspace: "ws",
          dir: pathJoin("@scope/package"),
          path: pathJoin("ws/@scope/package")
        },
        {
          workspace: "ws",
          dir: "packageB",
          path: pathJoin("ws/packageB")
        }
      ],
      {
        dependencies: { modA: "1", modC: "1", modE: "1" }
      }
    );
    expect(ms).toEqual(["modE"]);
  });
});

describe("findInternalDependencies", () => {
  const id = knit.findInternalDependencies;

  it("returns list of used internal modules", () => {
    const ms = id(["modA", "modB"], ["modA"]);
    expect(ms).toEqual(["modA"]);
  });
});

describe("makeDependencyMap", () => {
  const mdm = knit.makeDependencyMap;

  it("returns a map of modules and their dependencies", async () => {
    const m = await mdm({
      "@scope/package": {
        workspace: "ws",
        dir: pathJoin("@scope/package"),
        path: pathJoin("ws/@scope/package")
      },
      packageB: {
        workspace: "ws",
        dir: "packageB",
        path: pathJoin("ws/packageB")
      }
    });
    expect(m).toEqual({
      "@scope/package": ["modA", "modB"],
      packageB: ["modC"]
    });
  });
});
