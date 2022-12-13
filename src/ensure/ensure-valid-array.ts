/**
 * Checks if `value` is an array
 * @param value         The value to be verified
 * @param defaultValue  (default = void 0)
 */
export function ensureValidArray(value: any, defaultValue?: any) {
  if (Array.isArray(value)) {
    return value;
  } else {
    return defaultValue;
  }
}
