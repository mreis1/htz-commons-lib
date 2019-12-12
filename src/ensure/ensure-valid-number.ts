/**
 * Takes a string value or a number and matches it against a regex.
 * It converts the value to a integer.
 * If conversion succeeds, it will return a integer.
 * Otherwise returns the fallback that by default is `void 0`
 * @param value
 * @param fallback
 * @param options
 * @param options.convertDecimal  {boolean} (false)   Either a decimal string should be converted to integer (Example: '11.11' => 11)
 * @returns {any}
 */
export function ensureValidNumber(
  value: any,
  fallback?,
  options?: { convertDecimal: boolean }
) {
  if (value !== void 0 && value != null) {
    let t = typeof value;
    if (t === 'string') {
      value = value.trim();
      let isValidString = false;
      if (options?.convertDecimal) {
        /**
         * 11 = true
         * 11.11 = true
         * 11.11a = false
         * 11.11.11 = false
         * a11.11.11 = false
         */
        isValidString = /^\d+([,|.]?\d+)$/g.test(value);
      } else {
        /**
         * 11 = true
         * 11.11 = false
         * 11.11a = false
         * 11.11.11 = false
         * a11.11.11 = false
         */
        isValidString = /^\d+$/g.test(value);
      }
      if (!isValidString) {
        return fallback;
      }
    } else if (t === 'number') {
      if (isNaN(value)) {
        return fallback;
      }
      if (!options?.convertDecimal && value.toString().indexOf('.') >= 0) {
        return fallback;
      }
    }

    const parsed = parseInt(value, 0);
    if (isNaN(parsed)) {
      return fallback;
    } else {
      return parsed;
    }
  } else {
    return fallback;
  }
}
