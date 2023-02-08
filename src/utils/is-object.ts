/**
 * Checks if value is an object {}
 * Meaning - it's not null, not an array and typeof returns object
 * @param val
 */
export function isObject(val) {
  return val !== null && typeof val === 'object' && !Array.isArray(val);
}
