/* flow */

const path = require("path");

const mockPath = path;
const knit = require("..");

const PATHS = {
  modules: "",
  modulesStub: "",
  distStub: "dist",
  libStub: "lib",
  jsnextStub: "jsnext",
  umdStub: "umd",
  lib: "/Users/lib",
  jsnext: "/Users/jsnext",
  umd: "/Users/umd"
};

const MODULES = {
  moduleA: "moduleA",
  moduleB: "moduleB",
  moduleC: "moduleC"
};

jest.mock("@knit/depcheck", () =>
  jest.fn(
    module =>
      new Promise(resolve =>
        resolve({
          using: {
            [mockPath.join("@scope", "package")]: { modA: [], modB: [] },
            packageB: { modC: [], modD: [] },
            modD: {}
          }[module]
        })
      )
  )
);

describe("getDependencyVersion", () => {
  const gdv = knit.getDependencyVersion;

  const modulesBreakdown = {
    updated: ["moduleB"],
    internal: ["moduleC"]
  };
  const params = {
    packagesDir: "",
    version: "2.2.2",
    rootPkg: { dependencies: { moduleA: "1.1.1" } }
  };
  it("returns version found in root package.json", () => {
    expect(gdv(MODULES, modulesBreakdown, params, "moduleA")).toBe("1.1.1");
  });
  it("returns nextVersion if dependency is updated internal module", () => {
    expect(gdv(MODULES, modulesBreakdown, params, "moduleB")).toBe("2.2.2");
  });
  it("returns current module version if not updated", () => {
    require("read-pkg").__setMockPackages({
      moduleC: { name: "moduleC", version: "0.1.0" }
    });
    expect(gdv(MODULES, modulesBreakdown, params, "moduleC")).toBe("0.1.0");
  });
  it("otherwise throws an error ", () => {
    expect(() => gdv(MODULES, modulesBreakdown, params, "moduleD")).toThrow();
  });
});

describe("getPeerDependencyVersion", () => {
  const gpv = knit.getPeerDependencyVersion;
  const modulesBreakdown = {};

  it("returns version found in module package.json peerDependencies", () => {
    const params = {
      paths: PATHS,
      pkg: { peerDependencies: { moduleA: ">=3" } },
      rootPkg: { dependencies: { moduleA: "4" } }
    };
    expect(gpv(MODULES, modulesBreakdown, params, "moduleA")).toBe(">=3");
  });
  it("returns devDependencies version truncates to major version if peer version is *", () => {
    const params = {
      paths: PATHS,
      pkg: {
        peerDependencies: { moduleA: "*" }
      },
      rootPkg: {
        dependencies: { moduleA: "2.2.2" },
        devDependencies: { moduleA: "1.1.1" }
      }
    };
    expect(gpv(MODULES, modulesBreakdown, params, "moduleA")).toBe("1");
  });
  it("returns dependencies version truncates to major version if peer version is *", () => {
    const params = {
      paths: PATHS,
      pkg: {
        peerDependencies: { moduleA: "*" }
      },
      rootPkg: {
        devDependencies: {},
        dependencies: { moduleA: "1.1.1" }
      }
    };
    expect(gpv(MODULES, modulesBreakdown, params, "moduleA")).toBe("1");
  });
});

describe("getOptionalDependencyVersion", () => {
  const gov = knit.getOptionalDependencyVersion;
  const modulesBreakdown = {};

  it("returns version found in module package.json optionalDependencies", () => {
    const params = {
      paths: PATHS,
      pkg: { optionalDependencies: { moduleA: ">=3" } },
      rootPkg: { optionalDependencies: { moduleA: "*" } }
    };
    expect(gov(MODULES, modulesBreakdown, params, "moduleA")).toBe(">=3");
  });
  it("returns version found in root package.json optionalDependencies", () => {
    const params = {
      paths: PATHS,
      pkg: {},
      rootPkg: { optionalDependencies: { moduleA: "^1" } }
    };
    expect(gov(MODULES, modulesBreakdown, params, "moduleA")).toBe("^1");
  });
  it("returns dependencies version if optional version is *", () => {
    const params = {
      paths: PATHS,
      pkg: {},
      rootPkg: {
        dependencies: { moduleA: "1.1.1" },
        optionalDependencies: { moduleA: "*" }
      }
    };
    expect(gov(MODULES, modulesBreakdown, params, "moduleA")).toBe("1.1.1");
  });
});

describe("updateModulePkg", () => {
  const ump = knit.updateModulePkg;
  const PKG = { name: "foo" };
  const ROOT_PGK = {
    homepage: "bar",
    license: "bar",
    bugs: "bar",
    tags: "bar",
    keywords: "bar",
    files: "bar",
    repository: "bar",
    engines: "bar",
    author: "bar",
    version: 1
  };

  it("combines root package.json metadata with module package.json", () => {
    expect(
      ump(
        {},
        { internal: [], used: [], updated: [] },
        { paths: PATHS, pkg: PKG, rootPkg: ROOT_PGK }
      )
    ).toEqual({
      ...PKG,
      ...ROOT_PGK,
      dependencies: {},
      optionalDependencies: {},
      peerDependencies: {},
      private: false,
      version: 1
    });
  });
  it("lets module package.json overide metadata from root package.json", () => {
    expect(
      ump(
        {},
        { internal: [], used: [], updated: [] },
        { paths: PATHS, pkg: { ...PKG, homepage: "foo" }, rootPkg: ROOT_PGK }
      )
    ).toEqual({
      ...PKG,
      ...ROOT_PGK,
      homepage: "foo",
      dependencies: {},
      optionalDependencies: {},
      peerDependencies: {},
      private: false,
      version: 1
    });
  });
  it("uses version if passed", () => {
    expect(
      ump(
        {},
        { internal: [], used: [], updated: [] },
        { paths: PATHS, pkg: PKG, rootPkg: ROOT_PGK, version: 2 }
      ).version
    ).toBe(2);
  });
  it("defaults to rootPkg version if no version passed", () => {
    expect(
      ump(
        {},
        { internal: [], used: [], updated: [] },
        { paths: PATHS, pkg: PKG, rootPkg: ROOT_PGK }
      ).version
    ).toBe(1);
  });
  it("adds needed dependencies to module package.json", () => {
    expect(
      ump(
        {},
        { internal: [], used: ["moduleA"], updated: [] },
        {
          paths: PATHS,
          pkg: PKG,
          rootPkg: {
            ...ROOT_PGK,
            dependencies: { moduleA: "1" }
          }
        }
      ).dependencies
    ).toEqual({ moduleA: "1" });
  });
  it("includes dependencies set in module package.json", () => {
    expect(
      ump(
        {},
        { internal: [], used: ["foo"], updated: [] },
        {
          paths: PATHS,
          pkg: { ...PKG, dependencies: { foo: "*" } },
          rootPkg: { ...ROOT_PGK, dependencies: { foo: "1.1.1" } }
        }
      )
    ).toEqual({
      ...PKG,
      ...ROOT_PGK,
      dependencies: { foo: "1.1.1" },
      optionalDependencies: {},
      peerDependencies: {},
      private: false,
      version: 1
    });
  });
  it("works with version ranges", () => {
    const pkg = ump(
      {},
      { internal: [], used: [], updated: [] },
      {
        paths: PATHS,
        pkg: {
          ...PKG,
          peerDependencies: { moduleA: "*", moduleB: "*", moduleC: "*" }
        },
        rootPkg: {
          ...ROOT_PGK,
          devDependencies: {},
          dependencies: {
            moduleA: "^1.1.1",
            moduleB: "~1.1.1",
            moduleC: ">1.1.1"
          }
        }
      }
    );
    expect(pkg.peerDependencies).toEqual({
      moduleA: ">=1.1.1 <2.0.0",
      moduleB: ">=1.1.1 <1.2.0",
      moduleC: ">1.1.1"
    });
    expect(pkg.dependencies).toEqual({});
  });
  it("adds peerDependencies truncated to major version (found in dependencies)", () => {
    const pkg = ump(
      {},
      { internal: [], used: [], updated: [] },
      {
        paths: PATHS,
        pkg: { ...PKG, peerDependencies: { moduleA: "*" } },
        rootPkg: {
          ...ROOT_PGK,
          devDependencies: {},
          dependencies: { moduleA: "1.1.1" }
        }
      }
    );
    expect(pkg.peerDependencies).toEqual({ moduleA: "1" });
    expect(pkg.dependencies).toEqual({});
  });
  it("adds peerDependencies truncated to major version (found in devDependencies)", () => {
    const pkg = ump(
      {},
      { internal: [], used: [], updated: [] },
      {
        paths: PATHS,
        pkg: { ...PKG, peerDependencies: { moduleA: "*" } },
        rootPkg: {
          ...ROOT_PGK,
          devDependencies: { moduleA: "1.1.1" }
        }
      }
    );
    expect(pkg.peerDependencies).toEqual({ moduleA: "1" });
    expect(pkg.dependencies).toEqual({});
  });
  it("uses peerDependencies version from module if set", () => {
    const pkg = ump(
      {},
      { internal: [], used: ["moduleA"], updated: [] },
      {
        paths: PATHS,
        pkg: {
          ...PKG,
          peerDependencies: { moduleA: ">=1" }
        },
        rootPkg: {
          ...ROOT_PGK,
          dependencies: { moduleA: "2" }
        }
      }
    );
    expect(pkg.peerDependencies).toEqual({ moduleA: ">=1" });
  });
  it("adds needed optionalDependencies to module package.json", () => {
    const pkg = ump(
      {},
      { internal: [], used: ["moduleA"], updated: [] },
      {
        paths: PATHS,
        pkg: { ...PKG, optionalDependencies: { moduleA: "*" } },
        rootPkg: {
          ...ROOT_PGK,
          dependencies: { moduleA: "1" }
        }
      }
    );
    expect(pkg.optionalDependencies).toEqual({ moduleA: "1" });
    expect(pkg.dependencies).toEqual({});
  });
  it("uses optionalDependencies version from module if set", () => {
    const pkg = ump(
      {},
      { internal: [], used: ["moduleA"], updated: [] },
      {
        paths: PATHS,
        pkg: {
          ...PKG,
          optionalDependencies: { moduleA: ">=1" }
        },
        rootPkg: {
          ...ROOT_PGK,
          dependencies: { moduleA: "2" }
        }
      }
    );
    expect(pkg.optionalDependencies).toEqual({ moduleA: ">=1" });
  });
});
