/* @flow */

import { findPackages, findPublicPackages } from '..';


describe('findPackages', () => {
  it('returns list of modules from directories', () => {
    require('fs-extra').__setMockFiles({
      '': ['moduleA', 'moduleB'],
    });
    expect(findPackages('')).toEqual(['moduleA', 'moduleB']);
  });
  it('steps into @scoped directories', () => {
    require('fs-extra').__setMockFiles({
      '': ['moduleA', '@moduleB'],
      '@moduleB': ['moduleC'],
    });
    expect(findPackages('')).toEqual(['moduleA', '@moduleB/moduleC']);
  });
});

describe('findPublicPackages', () => {
  it('returns list of modules that have a package.json and have not set `private: true`', () => {
    require('fs-extra').__setMockFiles({
      '': ['moduleA', 'moduleB'],
    });
    require('read-pkg').__setMockPackages({
      moduleA: { name: 'moduleA' },
      moduleB: { name: 'moduleB', private: true },
    });
    expect(findPublicPackages('')).toEqual(['moduleA']);
  });
});
