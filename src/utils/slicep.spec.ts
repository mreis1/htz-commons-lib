import { sliceP } from './slicep';

describe('SliceP', function () {
  test('#Array', () => {
    const v = sliceP([1, 2, 3, 4], 2, 2);
    expect(JSON.stringify(v)).toBe(JSON.stringify([3, 4]));
    expect(v instanceof Array).toBeTruthy();
  });

  test('#Buffer', () => {
    let o;
    try {
      o = sliceP(Buffer.from([1, 2, 3, 4]), 1, 2);
    } catch (err) {
      // ...
    }
    expect(o instanceof Buffer).toBeTruthy();
    expect(o.toString('hex')).toBe('0203');
  });

  test('#String', () => {
    let o;
    try {
      o = sliceP('abc', 1, 2);
    } catch (err) {
      // ...
    }
    expect(o).toBe('bc');
  });
});
