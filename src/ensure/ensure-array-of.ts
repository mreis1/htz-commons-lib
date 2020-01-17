import { ensureValidArray } from './ensure-valid-array';

/**
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
