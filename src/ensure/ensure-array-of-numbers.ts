import {
  EnsureValidNumberOptions,
  ensureValidNumber,
} from './ensure-valid-number';
import {
  EnsureDecimalOptions,
  ensureValidDecimal,
} from './ensure-valid-decimal';
import { isObject } from '../utils';

/**
 * Same interface of `EnsureDecimalOptions` but with different defaults.
 */
export interface EnsureDecimalOptions2 extends EnsureDecimalOptions {
  /**
   * When true, converts strings of numeric values where the decimal is represented with a comma (ex: "1,1" -> 1.11)
   * @default: true
   */
  replaceComma?: boolean;
  /**
   * Allows negative value
   * @default: false
   */
  allowNegative?: boolean;
  /**
   * Allows null value
   * @default false
   */
  allowNull?: boolean;
}
export interface EnsureArrayOfNumberCommonOpts {
  /**
   * @default false
   */
  allowNull?: boolean;
  /**
   * @default: false
   */
  unique?: boolean;
}
export type ArrayOfNumberOptions =
  | ({
      /**
       * (default: false)
       * When true, values returned take in consideration the options defined by decimalOpts.
       */
      decimals?: true;
      decimalOpts?: EnsureDecimalOptions2;
    } & EnsureArrayOfNumberCommonOpts)
  | ({
      /**
       * (default: false)
       * When true, values returned take in consideration the options defined by decimalOpts.
       */
      decimals?: false;
      intOptions?: EnsureValidNumberOptions;
    } & EnsureArrayOfNumberCommonOpts);
export type ArrayOfNumberOptionsWithDefaults = ArrayOfNumberOptions & {
  defaultValue?: any;
};
/**
 * Takes an array and returns numeric entries.
 * For optionals
 */
export function ensureArrayOfNumbers(
  data: any[],
  options?: ArrayOfNumberOptionsWithDefaults
);
export function ensureArrayOfNumbers(
  data: any[],
  defaultValue?: any,
  options?: ArrayOfNumberOptions
);
export function ensureArrayOfNumbers(data: any[], ...args) {
  let options: ArrayOfNumberOptionsWithDefaults;
  let defaultValue: any;
  if (args.length === 1 && isObject(args[0])) {
    options = args[0] ?? {};
  } else {
    defaultValue = args[0];
    options = args[1] ?? {};
  }
  options.decimals =
    typeof options.decimals === 'boolean' ? options.decimals : false;
  const decimalOptions =
    (options.decimals === true && options.decimalOpts) || {};
  if (typeof decimalOptions.allowNegative !== 'boolean') {
    decimalOptions.allowNegative = false;
  }
  const allowNull = options?.allowNull === true;
  const unique = options?.unique === true;
  let output = [];
  if (Array.isArray(data)) {
    data.forEach((i) => {
      let res;
      if (allowNull && i === null) {
        if (!unique || (unique && output.indexOf(i) === -1)) {
          output.push(i);
        }
      } else {
        if (options.decimals === true) {
          res = ensureValidDecimal(i, void 0, decimalOptions);
        } else {
          res = ensureValidNumber(i, void 0, options.intOptions);
        }
        if (res !== void 0) {
          if (!unique || (unique && output.indexOf(res) === -1)) {
            output.push(res);
          }
        }
      }
    });
    return output;
  } else {
    return defaultValue;
  }
}
