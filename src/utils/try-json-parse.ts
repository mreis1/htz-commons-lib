/**
 * Tries to parse a string that we expect to be a JSON.
 * Any other input type will result in defaultValue being returned.
 * This function doesn't throw.
 *
 * @param data
 * @param defaultValue
 */
export function tryJSONParse(data, defaultValue?) {
  try {
    if (typeof data !== 'string') {
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (err) {
    return defaultValue;
  }
}
