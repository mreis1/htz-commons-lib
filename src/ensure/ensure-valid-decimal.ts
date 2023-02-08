import { isObject } from '../utils';

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
export interface EnsureDecimalOptionsWithDefault extends EnsureDecimalOptions {
  defaultValue?: any;
}
/**
 * Ensures that we are dealing with a valid number decimal or integer.
 */
export function ensureValidDecimal(
  value: any,
  options?: EnsureDecimalOptionsWithDefault
);
export function ensureValidDecimal(
  value: any,
  defaultValue?,
  options?: EnsureDecimalOptions
);
export function ensureValidDecimal(value: any, ...args) {
  const t = typeof value;
  let defaultValue, options;
  if (args.length === 1 && isObject(args[0])) {
    options = args[0] ?? {};
    defaultValue = options.defaultValue;
  } else {
    defaultValue = args[0];
    options = args[1] ?? {};
  }

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
