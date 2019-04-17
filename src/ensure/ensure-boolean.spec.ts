import { ensureBoolean } from "./ensure-boolean";

test("ensureBoolean", () => {
  expect(ensureBoolean(false)).toBe(false);
  expect(ensureBoolean("some_invalid_value")).toBeUndefined();
  expect(ensureBoolean("true", false)).toBe(true); // Here he will convert with JSON.parse()
  expect(ensureBoolean("some_invalid_value", false)).toBe(false); // Here the default value must be used
  expect(ensureBoolean(false, true)).toBe(false); // Here the valid value is used.
});
