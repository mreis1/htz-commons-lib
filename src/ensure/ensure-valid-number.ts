import { tryJSONParse } from '../utils';

export interface EnsureValidNumberOptions {
  /**
   * When true, if value is a decimal, it'll be converted into a integer.
   * When false, if value is a decimal defaultValue will be returned.
   *
   * @default false
   */
  convertDecimal?: boolean;
  allowNegative?: boolean;
  allowNull?: boolean;
}
/**
 * Attempts to parse a numeric string
 *
 * Few notes:
 *
 *
 * Parsing numbers:
 *  https://stackoverflow.com/a/46621393/1084568
 *    Migrating to JSON might be
 *
 * @param value
 * @param fallback
 * @param options
 * @param options.convertDecimal  {boolean} (false)   Either a decimal string should be converted to integer (Example: '11.11' => 11)
 * @param options.allowNegative   {boolean} (false)   Either we should consider negative values or not during parsing
 * @param options.allowNull       {boolean} (false)   When true, if input value has null type, then null is returned.
 * @returns {any}
 */
export function ensureValidNumber(
  value: any,
  fallback?,
  options?: EnsureValidNumberOptions
) {
  options = options || ({} as any);
  if (value !== void 0 && value != null) {
    let t = typeof value;
    if (t === 'string') {
      value = value.trim();
      value = value.replace(',','.') // for backward compatibility - replace , with .
      value = tryJSONParse(value);
      if (value === void 0) {
        return fallback;
      }
    }
    if (isNaN(value)) {
      return fallback;
    }
    if (!options.allowNegative && value < 0) {
      return fallback;
    }
    if (!options?.convertDecimal && value.toString().indexOf('.') >= 0) {
      return fallback;
    }

    const parsed = parseInt(value, 0);
    if (isNaN(parsed)) {
      return fallback;
    } else {
      return parsed;
    }
  } else {
    if (options.allowNull && value === null) {
      return value;
    }
    return fallback;
  }
}
