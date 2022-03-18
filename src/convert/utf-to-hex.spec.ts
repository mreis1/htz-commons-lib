import { utfToHex } from './utf-to-hex';

describe('utfToHex', () => {
  test('# Sample test', () => expect(utfToHex('AA')).toBe('4141'));
  test('# null or undefined should return empty string', () =>
    expect(utfToHex('AA')).toBe('4141'));
});
