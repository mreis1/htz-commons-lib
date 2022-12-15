/**
 *
 * Tries to parse a string that we expect to be a JSON.
 * If the data is valid, it creates the JavaScript objects/primitives that are represented by the data, and returns them.
 *
 * @param data
 * @param defaultValue
 */
export function tryJSONParse(data, defaultValue?) {
  try {
    // These are common cases where the parser will throw an error.
    // For that reason we're anticipating and returning the default value
    if (data === void 0 || data === '') {
      return defaultValue;
    }
    return JSON.parse(data);
  } catch (err) {
    return defaultValue;
  }
}
