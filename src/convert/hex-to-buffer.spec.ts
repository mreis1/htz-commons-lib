import { hexToBuffer } from './hex-to-buffer';

describe('hexToBuffer', () => {
  test('if it converts a valid hex', () =>
    expect(hexToBuffer('ff')[0]).toBe(255));
  test('it should return a empty buffer is invalid string', () =>
    expect(() => hexToBuffer('TEST_INVALID_STRING')).toHaveLength(0));
  test('it should return undefined if invalid string', () =>
    expect(hexToBuffer({ some: 'object' })).toBeUndefined());

  test('should sanitize hex string before converting into buffer', () => {
    let d = hexToBuffer('02:20-10 30');
    expect(d[0]).toBe(0x02)
    expect(d[1]).toBe(0x20);
    expect(d[2]).toBe(0x10);
    expect(d[3]).toBe(0x30);
  });
})
