import { ensureBoolean } from './ensure-boolean';

test('ensureBoolean', () => {
  expect(ensureBoolean(false)).toBe(false);
  expect(ensureBoolean('some_invalid_value')).toBeUndefined();
  expect(ensureBoolean('true', false)).toBe(true); // Here he will convert with JSON.parse()
  expect(ensureBoolean('some_invalid_value', false)).toBe(false); // Here the default value must be used
  expect(ensureBoolean(false, true)).toBe(false); // Here the valid value is used.
  expect(ensureBoolean(8)).toBe(undefined); // Here the valid value is used.
  expect(ensureBoolean('8')).toBe(undefined); // Here the valid value is used.
  expect(ensureBoolean(null)).toBe(undefined); // Here the valid value is used.
  expect(
    ensureBoolean(null, void 0, {
      allowNull: true,
    })
  ).toBe(null); // Here the valid value is used.
});
