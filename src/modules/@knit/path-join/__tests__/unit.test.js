/* flow */

const path = require("path");

import { pathJoin as pj } from "../lib/js/main";

describe("pathJoin", () => {
  it("create path when passed scoped module", () => {
    expect(pj("foo", "@scope/package")).toBe(
      path.join("foo", "@scope", "package")
    );
  });
  it("keep abs path", () => {
    expect(pj("/foo", "package")).toBe(path.join("/foo", "package"));
  });
});
