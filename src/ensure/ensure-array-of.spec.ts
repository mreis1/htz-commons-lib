import { ensureArrayOf } from './ensure-array-of';

describe('ensureArrayOf', function() {
  it('should validate', function() {
    expect(ensureArrayOf(void 0, v => false)).toHaveLength(0);
    let r1 = ensureArrayOf(['String Value', 1], v => {
      return typeof v === 'number';
    });
    expect(r1[0]).toBe(1);
    expect(r1).toHaveLength(1);
  });
});
