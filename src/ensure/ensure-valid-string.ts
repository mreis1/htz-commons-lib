import { isObject } from '../utils';
import { ensureValidNumber } from './ensure-valid-number';

interface IEnsureValidStringOpts {
  /**
   * Will run character replacement before checking min-length
   */
  replace?: Array<{ exp: RegExp | string; value: string }>;
  defaultValue?: any;
  minLength?: number;
  accepts?: string[];
  rejects?: string[];
  // Either we should or not transform the string before comparing it with the accepted values
  transform?: 'none' | 'upperCase' | 'lowerCase';
}

export function ensureValidString(
  str: string,
  defaultValueOrOptions?: IEnsureValidStringOpts | string
) {
  let defaultValue;
  let minLength;
  let options: IEnsureValidStringOpts;
  options = isObject(defaultValueOrOptions)
    ? (defaultValueOrOptions as IEnsureValidStringOpts)
    : null;
  if (options) {
    if (Array.isArray(options.replace) && options.replace.length) {
      options.replace.forEach(item => {
        let b = str;
        str = str.replace(item.exp, item.value);
        console.log('---------------------------------');
        console.log({
          b,
          str,
          item
        });
        console.log('---------------------------------');
      });
    }
    minLength = ensureValidNumber(options.minLength, 1);
    defaultValue = options.defaultValue;
  } else {
    minLength = 1;
    defaultValue = defaultValueOrOptions;
  }
  if (typeof str === 'string' && str.length >= minLength) {
    if (options) {
      if (options.transform) {
        if (options.transform === 'lowerCase') {
          str = str.toLowerCase();
        } else if (options.transform === 'upperCase') {
          str = str.toUpperCase();
        } else {
          str = str.toLowerCase();
        }
      }
      if (options.accepts) {
        if (options.accepts.indexOf(str) >= 0) {
          return str;
        } else {
          return defaultValue;
        }
      }
    }
    return str;
  } else {
    return defaultValue;
  }
}
