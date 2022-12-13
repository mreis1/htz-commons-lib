import { tryJSONParse } from '../utils/try-json-parse';

export interface Options {
  allowNull?: boolean;
}
/**
 * Accepts:
 *  true:  -> 1, "1", "true", true
 *  false: -> 0, "0", "false", false
 *
 * Anything else should return defaultValue
 *
 * @param data
 * @param defaultValue (default = void 0)
 * @param opts
 * @param opts.allowNull    (default = false) When true, null value is preserved.
 */
export function ensureBoolean(data, defaultValue?, opts?: Options) {
  if (opts?.allowNull && data === null) {
    return null;
  }
  if (typeof data === 'boolean') {
    return data;
  } else {
    let v = tryJSONParse(data, defaultValue);
    if (v === true || v === 1) {
      return true;
    } else if (v === false || v === 0) {
      return false;
    } else {
      return defaultValue;
    }
  }
}
