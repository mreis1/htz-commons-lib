import { isObject, tryJSONParse } from '../utils';

export interface EnsureValidNumberOptions {
  /**
   * When true, if value is a decimal, it'll be converted into a integer.
   * When false, if value is a decimal defaultValue will be returned.
   *
   * @default false
   */
  convertDecimal?: boolean;
  /**
   * Either we should consider negative values or not during parsing
   * @default false
   */
  allowNegative?: boolean;
  /**
   * When true, if input value has null type, then null is returned.
   * @default false
   */
  allowNull?: boolean;
}
export interface EnsureValidNumberOptionsWithDefault
  extends EnsureValidNumberOptions {
  defaultValue?: any;
}
/**
 * Attempts to parse a numeric string
 *
 * Few notes:
 *
 * Parsing numbers:
 *  https://stackoverflow.com/a/46621393/1084568
 *    Migrating to JSON might be
 *
 */
export function ensureValidNumber(
  value: any,
  options?: EnsureValidNumberOptionsWithDefault
);
export function ensureValidNumber(
  value: any,
  defaultValue?: any,
  options?: EnsureValidNumberOptions
);
export function ensureValidNumber(value: any, ...args) {
  let defaultValue: any, options: EnsureValidNumberOptionsWithDefault;
  if (args.length === 1 && isObject(args[0])) {
    options = args[0] ?? {};
    defaultValue = options.defaultValue;
  } else {
    defaultValue = args[0];
    options = args[1] ?? {};
  }
  options = options || ({} as any);
  if (value !== void 0 && value != null) {
    let t = typeof value;
    if (t === 'string') {
      value = value.trim();
      value = value.replace(',', '.'); // for backward compatibility - replace , with .
      // Get rid of left hand zeros.
      // because JSON parser will throw on those cases.
      if (value[0] === '0') {
        let parts = value.split('');
        let maxPartsIdx = parts.length - 1;
        let finalStr = '';
        parts.forEach((item, idx) => {
          if (idx === maxPartsIdx || (idx < maxPartsIdx && item !== '0')) {
            finalStr += item;
          }
        });
        value = finalStr;
      }
      value = tryJSONParse(value);
      if (value === void 0) {
        return defaultValue;
      }
    }
    if (isNaN(value)) {
      return defaultValue;
    }
    if (!options.allowNegative && value < 0) {
      return defaultValue;
    }
    if (!options?.convertDecimal && value?.toString().indexOf('.') >= 0) {
      return defaultValue;
    }

    const parsed = parseInt(value, 0);
    if (isNaN(parsed)) {
      return defaultValue;
    } else {
      return parsed;
    }
  } else {
    if (options.allowNull && value === null) {
      return value;
    }
    return defaultValue;
  }
}
