import { ensureValidArray } from './ensure-valid-array';

export type ValidatorFn = (value) => boolean;
/**
 * Ensures that an array is returned containing the elements based on your filter condition.
 * @param value
 * @param validator
 */
export function ensureArrayOf(value, validator: ValidatorFn) {
  value = ensureValidArray(value, []);
  if (value) {
    value = value.filter((v) => validator(v));
  }
  return value;
}
