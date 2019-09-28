const rp = jest.genMockFromModule("read-pkg");

let mockPackages = Object.create(null);

const __setMockPackages = newMockPackages => {
  mockPackages = Object.keys(newMockPackages).reduce(
    (acc, p) => ({
      ...acc,
      [p]: newMockPackages[p]
    }),
    {}
  );
}

const sync = ({ cwd }) => mockPackages[cwd];

rp.__setMockPackages = __setMockPackages;
rp.sync = sync;

module.exports = rp;
