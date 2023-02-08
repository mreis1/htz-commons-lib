import { tryJSONParse } from '../utils/try-json-parse';
import { isObject } from '../utils';

export interface EnsureBooleanOpts {
  /**
   * (default = false) When true, null value is preserved.
   */
  allowNull?: boolean;
  /**
   * When true, boolean values.
   * (default = false)
   */
  strictType?: boolean;
}

export interface EnsureBooleanOptsWithDefault extends EnsureBooleanOpts {
  /**
   * (default = void 0)
   */
  defaultValue?: any;
}

/**
 * Accepts:
 *  true:  -> 1, "1", "true", true
 *  false: -> 0, "0", "false", false
 *
 * Anything else should return defaultValue
 */
export function ensureBoolean(data, options?: EnsureBooleanOptsWithDefault);
export function ensureBoolean(data, defaultValue?, options?: EnsureBooleanOpts);
export function ensureBoolean(data, ...args) {
  let defaultValue: any, options: EnsureBooleanOptsWithDefault;
  if (args.length === 1 && isObject(args[0])) {
    options = args[0] ?? {};
    defaultValue = options.defaultValue;
  } else {
    defaultValue = args[0];
    options = args[1] ?? {};
  }
  if (options.allowNull && data === null) {
    return null;
  }
  if (typeof data === 'boolean') {
    return data;
  } else {
    if (!options.strictType) {
      let v = tryJSONParse(data, defaultValue);
      if (v === true || v === 1) {
        return true;
      } else if (v === false || v === 0) {
        return false;
      } else {
        return defaultValue;
      }
    } else {
      if (typeof data === 'boolean') {
        return data;
      } else {
        return defaultValue;
      }
    }
  }
}
