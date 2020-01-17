import { ensureValidArray } from './ensure-valid-array';

describe('ensureArray', function() {
  it('should validate', function() {
    expect(ensureValidArray(void 0)).toBe(void 0);
    expect(ensureValidArray(void 0, [])).toHaveLength(0);
    const a = [1,'a'];
    expect(ensureValidArray(a, [])).toBe(a);
  });
});
