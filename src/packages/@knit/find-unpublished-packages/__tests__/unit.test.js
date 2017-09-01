/* flow */

import findUnpublishedPackages from "..";

jest.mock("execa", () => ({
  stdout: jest.fn(
    module =>
      new Promise(resolve => {
        if (module === "moduleC") {
          throw new Error(404);
        }
        return resolve(["1.0.0", "1.2.0", "3.0.0"]);
      })
  )
}));

jest.mock("@knit/read-pkg", () =>
  jest.fn((dir, module) => {
    const mods = {
      moduleA: {
        version: "1.0.0"
      },
      moduleB: {
        version: "1.5.1"
      },
      moduleC: {
        version: "0.0.0"
      }
    };

    return mods[module];
  })
);

describe("findUnpublishedPackages", () => {
  it("finds modules with unpublished versions", async () => {
    const re = await findUnpublishedPackages("", {
      moduleA: "moduleA",
      moduleB: "moduleB"
    });
    expect(re).toEqual(["moduleB"]);
  });
  it("considers never published packages as unpublished", async () => {
    const re = await findUnpublishedPackages("", {
      moduleA: "moduleA",
      moduleB: "moduleB",
      moduleC: "moduleC"
    });
    expect(re).toEqual(["moduleB", "moduleC"]);
  });
});
