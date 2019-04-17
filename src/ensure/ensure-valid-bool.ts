export function ensureValidBool(bool, defaultValue?) {
  return typeof bool === 'boolean' ? bool : defaultValue;
}
