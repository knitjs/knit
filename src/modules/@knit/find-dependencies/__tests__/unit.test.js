/* flow */

import path from 'path';

import * as knit from '..';

const mockPath = path;

require('read-pkg').__setMockPackages({
  '@scope/package': {},
  packageB: {},
});

jest.mock('@knit/depcheck', () => (
  jest.fn((module) => (
    new Promise(resolve => resolve({
      using: {
        [mockPath.join('@scope', 'package')]: { modA: [], modB: [] },
        packageB: { modC: [], modD: [] },
        modD: {},
      }[module],
    }))
  ))
));

describe('findDependencies', () => {
  const fd = knit.findDependencies;

  it('returns list of modules', async () => {
    const ms = await fd('', '@scope/package');
    expect(ms).toEqual(['modA', 'modB']);
  });
});

describe('findAllDependencies', () => {
  const fad = knit.findAllDependencies;

  it('returns list of dependencies used by modules', async () => {
    const ms = await fad('', ['@scope/package', 'packageB']);
    expect(ms).toEqual(['modA', 'modB', 'modC', 'modD']);
  });
});

describe('findMissingDependencies', () => {
  const md = knit.findMissingDependencies;

  it('returns list of missing modules', () => {
    const ms = md(['modA'], [], {});
    expect(ms).toEqual(['modA']);
  });
  it('returns empty list when nothing missing', () => {
    const ms = md(['modA'], [], { modA: '1' });
    expect(ms).toEqual([]);
  });
  it('does not consider internal modules as missing', () => {
    const ms = md(['modA', 'modB'], ['modB'], { modA: '1' });
    expect(ms).toEqual([]);
  });
});

describe('findAllMissingDependencies', () => {
  const famd = knit.findAllMissingDependencies;

  it('returns list of dependencies used by modules', async () => {
    const ms = await famd(
      '',
      ['@scope/package', 'packageB'],
      { dependencies: { modA: '1', modC: '1' } }
      );
    expect(ms).toEqual(['modB', 'modD']);
  });
});

describe('findUnusedDependencies', () => {
  const ud = knit.findUnusedDependencies;

  it('returns list of unused modules', () => {
    const ms = ud([], [], { modA: 1 });
    expect(ms).toEqual(['modA']);
  });
  it('returns empty list when nothing unused', () => {
    const ms = ud(['modA'], [], { modA: '1' });
    expect(ms).toEqual([]);
  });
  it('does not consider internal modules as unused', () => {
    const ms = ud(['modA'], ['modB'], { modA: '1' });
    expect(ms).toEqual([]);
  });
});

describe('findAllUnusedDependencies', () => {
  const faud = knit.findAllUnusedDependencies;

  it('returns list of unused dependencies', async () => {
    const ms = await faud(
      '',
      ['@scope/package', 'packageB'],
      { dependencies: { modA: '1', modC: '1', modE: '1' } }
      );
    expect(ms).toEqual(['modE']);
  });
});

describe('findInternalDependencies', () => {
  const id = knit.findInternalDependencies;

  it('returns list of used internal modules', () => {
    const ms = id(['modA', 'modB'], ['modA']);
    expect(ms).toEqual(['modA']);
  });
});

describe('makeDependencyMap', () => {
  const mdm = knit.makeDependencyMap;

  it('returns a map of modules and their dependencies', async () => {
    const m = await mdm('', ['@scope/package', 'packageB']);
    expect(m).toEqual({
      '@scope/package': ['modA', 'modB'],
      packageB: ['modC', 'modD'],
    });
  });
});

