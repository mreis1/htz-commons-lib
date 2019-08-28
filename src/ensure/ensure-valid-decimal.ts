/**
 * Ensures that we are dealing with a valid number
 * @param value
 * @param defaultValue
 * @param options
 */
export function ensureValidDecimal(value: any, defaultValue?, options?: { replaceComma?: boolean }) {
  const t = typeof value;
  options = options || { replaceComma: true };
  if (typeof options.replaceComma !== "boolean") {
    options.replaceComma = true;
  }
  if (t === "string") {
    try {
      value = value.replace(/,/g, ".");
      /**
       * I use JSON parse instead of parse float because
       *
       * parseFloat("123123.123a")
       * => 123123.123
       *
       * while JSON.parse("123123.123a")
       * Uncaught SyntaxError: Unexpected token a in JSON at position 10
       */
      value = JSON.parse(value);
      return value;
    } catch (err) {
      return defaultValue;
    }
  } else if (t === "number" && !isNaN(value)) {
    return value;
  } else {
    return defaultValue;
  }
}
