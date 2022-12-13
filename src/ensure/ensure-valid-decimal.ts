export interface EnsureDecimalOptions {
  /**
   * When true, converts strings of numeric values where the decimal is represented with a comma (ex: "1,1" -> 1.11)
   * @default: true
   */
  replaceComma?: boolean;
  /**
   * Allows negative value
   * @default: true
   */
  allowNegative?: boolean;
  /**
   * Allows null value
   * @default false
   */
  allowNull?: boolean;
}
/**
 * Ensures that we are dealing with a valid number decimal or integer.
 * @param value
 * @param defaultValue    (default = void 0)
 * @param options
 */
export function ensureValidDecimal(
  value: any,
  defaultValue?,
  options?: EnsureDecimalOptions
) {
  const t = typeof value;
  options = options || { replaceComma: true };
  if (typeof options.replaceComma !== 'boolean') {
    options.replaceComma = true;
  }
  if (typeof options.allowNegative !== 'boolean') {
    options.allowNegative = true;
  }
  let output: number;
  if (t === 'string') {
    try {
      value = value.replace(/,/g, '.');
      /**
       * I use JSON parse instead of parse float because
       *
       * parseFloat("123123.123a")
       * => 123123.123
       *
       * while JSON.parse("123123.123a")
       * Uncaught SyntaxError: Unexpected token a in JSON at position 10
       */
      output = JSON.parse(value);
    } catch (err) {
      return defaultValue; // return defaultValue immediately
    }
  } else if (t === 'number' && !isNaN(value)) {
    output = value;
  } else {
    return defaultValue; // return defaultValue immediately
  }
  if (!options.allowNegative && output < 0) {
    return defaultValue;
  }
  return output;
}
