/* flow */

const pathJoin = require("@knit/path-join");

const rp = require("..");

describe("readPkg", () => {
  it("returns json if package exists", () => {
    require("read-pkg").__setMockPackages({
      [pathJoin("ws", "@scope", "package")]: { name: "@scope/package" }
    });
    expect(
      rp({
        path: pathJoin("ws/@scope/package"),
        workspace: "ws",
        dir: "@scope/package"
      })
    ).toEqual({ name: "@scope/package" });
  });
  it("throws if package is missing", () => {
    expect(() => rp({ path: "DNE" })).toThrowErrorMatchingSnapshot();
  });
});
