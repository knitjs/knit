const rp = jest.genMockFromModule('read-pkg');

let mockPackages = Object.create(null);
function __setMockPackages(newMockPackages) {
  mockPackages = Object.keys(newMockPackages).reduce((acc, p) => ({
    ...acc,
    [p]: newMockPackages[p],
  }), {});
}

function sync(directoryPath) {
  return mockPackages[directoryPath];
}

rp.__setMockPackages = __setMockPackages;
rp.sync = sync;

module.exports = rp;
