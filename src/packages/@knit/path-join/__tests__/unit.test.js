/* flow */

const path = require("path");

const pj = require("..");

describe("pathJoin", () => {
  it("still works like path.join", () => {
    expect(pj("foo", "bar", "module")).toBe(path.join("foo", "bar", "module"));
  });
  it("create path when passed scoped module", () => {
    expect(pj("foo", "bar", "@scope/package")).toBe(
      path.join("foo", "bar", "@scope", "package")
    );
  });
  it("keep abs path", () => {
    expect(pj("/foo", "bar", "package")).toBe(
      path.join("/foo", "bar", "package")
    );
  });
});
