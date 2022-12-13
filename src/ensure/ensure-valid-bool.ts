/**
 * Verifies that input has a type "boolean".
 * Differs from ensureBoolean() because this won't try to parse strings values
 * such as "true" | "false".
 *
 * @param input
 * @param defaultValue  (default = void 0)
 */
export function ensureValidBool(input, defaultValue?) {
  return typeof input === 'boolean' ? input : defaultValue;
}
