/**
 * Takes any value and matches it agains a regex.
 * If is a number it returns it
 * If is a numeric string it returns it's numeric version
 * Otherwise returns the fallback that by default is void 0
 *
 * @param value
 * @param fallback
 * @returns {any}
 */
export function ensureValidNumber(value: any, fallback?) {
  if (value !== void 0 && value != null) {
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
