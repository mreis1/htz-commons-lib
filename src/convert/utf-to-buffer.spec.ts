import { utfToBuffer } from './utf-to-buffer';

describe('utfToBuffer', () => {
  test('if it converts a valid hex', () =>
    expect(utfToBuffer('hello').join('')).toBe(
      Buffer.from('hello', 'utf8').join('')
    ));
});
