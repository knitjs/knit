import path from 'path';
import get from '..';

describe('getModuleFromDir', () => {
  it('finds module name from dir', () => {
    expect(get('package')).toBe('package');
  });
  it('finds module name from scoped dir', () => {
    expect(get(path.join('@scope', 'package'))).toBe('@scope/package');
  });
});
