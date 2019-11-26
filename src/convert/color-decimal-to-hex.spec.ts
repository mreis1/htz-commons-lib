import { colorDecimalToHex } from './color-decimal-to-hex';

test('colorDecimalToHex', () => {
  expect(colorDecimalToHex(16777215)).toBe('ffffff');
  expect(colorDecimalToHex(0)).toBe('000000');
  expect(colorDecimalToHex(255)).toBe('0000ff');
  expect(colorDecimalToHex(255, true)).toBe('ff0000');
});
