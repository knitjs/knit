import get from "..";

describe("getModuleName", () => {
  it("finds module name", () => {
    expect(get("package")).toBe("package");
  });
  it("finds module name of scoped module", () => {
    expect(get("@scope/package")).toBe("package");
  });
});
