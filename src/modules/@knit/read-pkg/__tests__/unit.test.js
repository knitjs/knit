/* flow */

const path = require('path');

const rp = require('..');

describe('readPkg', () => {
  it('returns json if package exists', () => {
    require('read-pkg').__setMockPackages({
      [path.join('@scope', 'package')]: { name: '@scope/package' },
    });
    expect(rp('', '@scope/package')).toEqual({ name: '@scope/package' });
  });
  it('throws if package is missing', () => {
    expect(rp('', 'DNE')).toThrow();
  });
});
