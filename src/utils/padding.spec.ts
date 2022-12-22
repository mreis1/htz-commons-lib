import { paddingLeft, paddingRight } from './padding';

describe('Padding', function () {
  it('paddingLeft', () => {
    expect(paddingLeft('', 1)).toBe('0');
    expect(paddingLeft('0', 1)).toBe('0');
    expect(paddingLeft('A', 1)).toBe('A');

    expect(paddingLeft('', 2)).toBe('00');
    expect(paddingLeft('0', 2)).toBe('00');
    expect(paddingLeft('A', 2)).toBe('0A');

    expect(paddingLeft('X', 2)).toBe('0X');
    expect(paddingLeft('X', 2)).toBe('0X');
    expect(paddingLeft('X', 4)).toBe('000X');
  });

  /**
   * To simplify tests in padding right are a copy of tests above.
   * Just flipped the expected result
   */
  it('paddingRight', () => {
    expect(paddingRight('', 1)).toBe('0'.split('').reverse().join(''));
    expect(paddingRight('0', 1)).toBe('0'.split('').reverse().join(''));
    expect(paddingRight('A', 1)).toBe('A'.split('').reverse().join(''));

    expect(paddingRight('', 2)).toBe('00'.split('').reverse().join(''));
    expect(paddingRight('0', 2)).toBe('00'.split('').reverse().join(''));
    expect(paddingRight('A', 2)).toBe('0A'.split('').reverse().join(''));

    expect(paddingRight('X', 2)).toBe('0X'.split('').reverse().join(''));
    expect(paddingRight('X', 2)).toBe('0X'.split('').reverse().join(''));
    expect(paddingRight('X', 4)).toBe('000X'.split('').reverse().join(''));
  });
});
