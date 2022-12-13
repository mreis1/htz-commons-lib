import { ensureValidArray } from './ensure-valid-array';

/**
 * Ensures that an array is returned containing the elements based on your filter condition.
 * @param value
 * @param validator
 */
export function ensureArrayOf(value, validator: (value) => boolean) {
  value = ensureValidArray(value, []);
  if (value) {
    value = value.filter((v) => validator(v));
  }
  return value;
}
