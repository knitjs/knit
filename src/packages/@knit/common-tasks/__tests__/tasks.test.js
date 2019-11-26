/* @flow */

jest.unmock("fs-extra");
jest.unmock("read-pkg");

const SilentRenderer = require("listr-silent-renderer");
const Listr = require("listr");

const pathJoin = require("@knit/path-join");

const publicPackages = require("../tasks/public");
const modified = require("../tasks/modified");
const filterPackages = require("../tasks/filter");
const readPackages = require("../tasks/read_packages");

jest.mock("@knit/needle", () => {
  const path = require("path");

  return {
    paths: {
      workspace: path.join("__fixtures__", "modules"),
      outputDir: ""
    }
  };
});

jest.mock("@knit/find-modified-packages", () => ({
  findModifiedSince: () => [],
  findModifiedPackages: () =>
    new Promise(resolve => resolve(["@scope/module-b"]))
}));

const PUBLIC = ["@scope/module-a", "@scope/module-b", "module-a", "module-c"];
const MODULES = {
  "@scope/module-a": {
    path: pathJoin("__fixtures__", "modules", "@scope/module-a"),
    dir: pathJoin("@scope/module-a"),
    workspace: pathJoin("__fixtures__", "modules"),
    private: false
  },
  "@scope/module-b": {
    path: pathJoin("__fixtures__", "modules", "@scope/module-b"),
    dir: pathJoin("@scope/module-b"),
    workspace: pathJoin("__fixtures__", "modules"),
    private: false
  },
  "module-a": {
    path: pathJoin("__fixtures__", "modules", "module-a"),
    dir: pathJoin("module-a"),
    workspace: pathJoin("__fixtures__", "modules"),
    private: false
  },
  "module-c": {
    path: pathJoin("__fixtures__", "modules", "module-c"),
    dir: pathJoin("module-c"),
    workspace: pathJoin("__fixtures__", "modules"),
    private: false
  }
};

describe("public", () => {
  it("find all public packages and set them to ctx.public and ctx.modules", async () => {
    const ctx = await new Listr(publicPackages, {
      renderer: SilentRenderer
    }).run();
    expect(ctx.public).toEqual(PUBLIC);
    expect(ctx.modules).toEqual(PUBLIC);
    expect(ctx.modulesMap).toEqual(MODULES);
  });
});

describe("filter", () => {
  it("only show included packages", async () => {
    const ctx = await new Listr(filterPackages, {
      renderer: SilentRenderer
    }).run({
      public: PUBLIC,
      modules: PUBLIC,
      modulesMap: MODULES,
      include: ["module-a"]
    });
    expect(ctx.public).toEqual(PUBLIC);
    expect(ctx.modules).toEqual(["@scope/module-a", "module-a"]);
  });
  it("remove excluded packages", async () => {
    const ctx = await new Listr(filterPackages, {
      renderer: SilentRenderer
    }).run({
      public: PUBLIC,
      modules: PUBLIC,
      modulesMap: MODULES,
      exclude: ["@scope"]
    });
    expect(ctx.public).toEqual(PUBLIC);
    expect(ctx.modules).toEqual(["module-a", "module-c"]);
  });
  it("works with include and exclude together", async () => {
    const ctx = await new Listr(filterPackages, {
      renderer: SilentRenderer
    }).run({
      public: PUBLIC,
      modules: PUBLIC,
      modulesMap: MODULES,
      include: ["module-a"],
      exclude: ["@scope"]
    });
    expect(ctx.public).toEqual(PUBLIC);
    expect(ctx.modules).toEqual(["module-a"]);
  });
});

describe("modified", () => {
  it("find modified packages and set them to ctx.modified and ctx.modules", async () => {
    const ctx = await new Listr(modified, { renderer: SilentRenderer }).run({
      tag: "beep",
      public: PUBLIC,
      modules: PUBLIC,
      modulesMap: MODULES
    });
    expect(ctx.public).toEqual(PUBLIC);
    expect(ctx.modified).toEqual(["@scope/module-b"]);
    expect(ctx.modules).toEqual(["@scope/module-b"]);
  });
});

describe("read_packages", () => {
  it("add a mapping of modules => package.json contents to ctx.pkgs", async () => {
    const ctx = await new Listr([...publicPackages, ...readPackages], {
      renderer: SilentRenderer
    }).run();
    expect(ctx.pkgs).toEqual({
      "@scope/module-a": { name: "@scope/module-a" },
      "@scope/module-b": { name: "@scope/module-b" },
      "module-a": { name: "module-a" },
      "module-c": { name: "module-c" }
    });
  });
});
