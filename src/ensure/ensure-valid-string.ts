import { isObject } from '../utils';

export interface EnsureValidStringOpts {
  /**
   * Will run character replacement before checking min-length
   */
  replace?: { exp: RegExp | string; value: string }[];
  /**
   * @default void 0
   */
  defaultValue?: any;
  /**
   * @default 1
   */
  minLength?: number;
  /**
   * When defined, the srcValue must exist in "accepts" array
   *
   * Ex:
   *    ensureValidString("c", { ..., "accepts": ["a","b"] }) => void 0
   *    ensureValidString("b", { ..., "accepts": ["a","b"] }) => "b"
   */
  accepts?: string[];
  rejects?: string[];
  /**
   * Trims the srcValue
   * @default false
   */
  trim?: boolean;
  /**
   * @default none
   */
  maxLength?: number;
  /**
   * The expected action if maxLength is not respected
   * - Throw        Throws MAX_LENGTH_KO
   * - UseDefault   Uses the defaultValue which is void 0 by default
   * - Slices
   *
   * @default 'useDefault'
   */
  onMaxLengthKo?: 'throw' | 'useDefault' | 'slice';
  /**
   * Will return the value
   *
   * @default false
   */
  allowNull?: boolean;

  // Either we should or not transform the string before comparing it with the accepted values
  transform?: 'none' | 'upperCase' | 'lowerCase';
}

export function ensureValidString(str: string, options: EnsureValidStringOpts)
export function ensureValidString(str: string, defaultValue, options: Omit<EnsureValidStringOpts, 'defaultValue'>)
export function ensureValidString(
  str: string,
  ...args
) {
  /*
  const t = typeof defaultValueOrOptions;
  const tIsObj = isObject(defaultValueOrOptions);
  let options: EnsureValidStringOpts;
  **/
  let options: EnsureValidStringOpts;
  let defaultValue: any;
  if (args.length === 1 && isObject(args[0])) {
    options = args[0];
    defaultValue = options.defaultValue;
  } else {
    options = args[1] ?? {};
    defaultValue = args[0];
  }
  let {
    minLength,
    maxLength,
    onMaxLengthKo,
    trim,
    allowNull,
    replace,
    transform,
    rejects,
    accepts,
  } = options;

  allowNull = typeof allowNull === 'boolean' ? allowNull : false;
  if (allowNull && str === null) {
    return str;
  }

  trim = typeof trim === 'boolean' ? trim : false;
  minLength =
    typeof minLength === 'number' && !isNaN(minLength) && minLength >= 0
      ? minLength
      : 1;
  maxLength =
    typeof maxLength === 'number' && !isNaN(maxLength) ? maxLength : Infinity;
  onMaxLengthKo =
    typeof onMaxLengthKo === 'string' ? onMaxLengthKo : 'useDefault';
  const strType = typeof str;

  if (strType === 'string' && Array.isArray(replace) && replace.length) {
    replace.forEach((item) => {
      str = str.replace(item.exp, item.value);
    });
  }

  if (strType === 'string' && trim === true) {
    str = str.trim();
  }

  if (strType === 'string' && str.length >= minLength) {
    if (transform) {
      if (transform === 'lowerCase') {
        str = str.toLowerCase();
      } else if (transform === 'upperCase') {
        str = str.toUpperCase();
      } else {
        str = str.toLowerCase();
      }
    }

    if (Array.isArray(accepts) && accepts.length) {
      if (accepts.indexOf(str) >= 0) {
        return str;
      } else {
        return defaultValue;
      }
    }

    if (Array.isArray(rejects) && rejects.length) {
      if (rejects.indexOf(str) >= 0) {
        return defaultValue;
      } else {
        return str;
      }
    }

    if (maxLength > 0) {
      if (str.length > maxLength) {
        if (onMaxLengthKo === 'throw') {
          throw new Error('MAX_LENGTH_KO');
        } else if (onMaxLengthKo === 'slice') {
          str = str.slice(0, maxLength);
        } else {
          // 'useDefault'
          str = defaultValue; // Warning <-- Value might be undefined after this statement.
        }
      }
    }

    return str;
  } else {
    return defaultValue;
  }
}
