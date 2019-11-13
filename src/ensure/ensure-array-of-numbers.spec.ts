import { ensureArrayOfNumbers } from './ensure-array-of-numbers';

test('ensureArrayOfNumbers', () => {
  expect(ensureArrayOfNumbers(['1', 2, 3, 'a'])).toHaveLength(3);
  expect(ensureArrayOfNumbers(['1', 2, 3, 'a'])[0]).toBe(1);
  expect(
    ensureArrayOfNumbers(['1.2', '2,3', 3, 'a'], void 0, { decimals: true })[0]
  ).toBe(1.2);
  expect(
    ensureArrayOfNumbers(['1.2', '2,3', 3, 'a'], void 0, { decimals: true })[1]
  ).toBe(2.3);
  expect(ensureArrayOfNumbers(null)).toBe(void 0);
  expect(ensureArrayOfNumbers(null, [])).toHaveLength(0);
});
