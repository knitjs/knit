const is = require("..");

describe("isScoped", () => {
  it("knows if package is scoped", () => {
    expect(is("@scope/package")).toBe(true);
  });
  it("knows if package is unscoped", () => {
    expect(is("package")).toBe(false);
  });
});
