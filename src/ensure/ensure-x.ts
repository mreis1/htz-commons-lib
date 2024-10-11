import {
  ensureArrayOf,
  ValidatorFn as ArrayOfValidatorFn,
} from './ensure-array-of';
import { ensureBoolean, EnsureBooleanOptsWithDefault } from './ensure-boolean';
import {
  EnsureDecimalOptions,
  ensureValidDecimal,
} from './ensure-valid-decimal';
import {
  EnsureValidDateOpts,
  ensureValidDateStrict,
  ensureValidEmail,
  ensureValidNumber,
  EnsureValidNumberOptions,
  ensureValidString,
  ensureValidTimestampStrict,
} from '../ensure';
import { EnsureValidStringOpts } from './ensure-valid-string';
import { ensureValidTime, EnsureValidTimeOptions } from './ensure-valid-time';
import { ensureValidDateTimeStrict } from './ensure-valid-date-time';
import {
  ArrayOfNumberOptionsWithDefaults,
  ensureArrayOfNumbers,
} from './ensure-array-of-numbers';

export enum ENSURE_MODE {
  /**
   * Assumed the field is required and expects a valid value to be provided
   */
  strict = 1,
  /**
   * Assumed field is not essential,
   * if an invalid value is provided it will silently default to the
   * defaultValue
   */
  soft = 2,
  /**
   * Assumes value is not required but if it was provided,
   * then a valid value is necessary otherwise and exception will be produced.
   */
  strict_if_provided = 3,
}
export type Mode = keyof typeof ENSURE_MODE;
export enum METHOD {
  arrayOf,
  arrayOfNumbers,
  bool,
  number,
  decimal,
  string,
  time,
  date,
  dateTime,
  dateOrTimestamp,
  dateTimeOrTimestamp,
  timestamp,
  // string variants
  'string+upper+trim',
  'string+lower+trim',
  'string+lower',
  'string+upper',
  'string+trim',
  'email', // Automatically trims and lowercase the string and verifies if it matches an email regexp
  'keep'
}
export type Method = keyof typeof METHOD;

type ArrayOfOptions = { validatorFn: ArrayOfValidatorFn };

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// prettier-ignore
export type Options<T extends Method> =
    // Primitive types
    T extends 'bool' ? EnsureBooleanOptsWithDefault :
      T extends 'number' ? EnsureValidNumberOptions :
        T extends 'decimal' ? EnsureDecimalOptions :
          T extends 'string' ? EnsureValidStringOpts :
            // String variants
            T extends 'string+lower' ? Omit<EnsureValidStringOpts,'transform'> :
              T extends 'string+lower+trim' ? Omit<EnsureValidStringOpts,'transform'|'trim'>:
                T extends 'string+upper' ? Omit<EnsureValidStringOpts,'transform'>:
                  T extends 'string+upper+trim' ? Omit<EnsureValidStringOpts,'transform'|'trim'>:
                    T extends 'string+trim' ? Omit<EnsureValidStringOpts,'trim'>:
                      T extends 'email' ? EnsureValidStringOpts:
            // Date & Time functions
            T extends 'date' ? EnsureValidDateOpts :
              T extends 'dateOrTimestamp' ? EnsureValidDateOpts :
                T extends 'dateTime' ? EnsureValidDateOpts :
                  T extends 'dateTimeOrTimestamp' ? EnsureValidDateOpts :
                    T extends 'timestamp' ?  EnsureValidDateOpts :
                      T extends 'time' ? EnsureValidTimeOptions :
            // Arrays
              T extends 'arrayOf' ? { validatorFn: ArrayOfValidatorFn } :
                T extends 'arrayOfNumbers' ? ArrayOfNumberOptionsWithDefaults :
            // Utilities
                T extends 'keep' ? {} :
                  never;

// prettier-ignore
export type OperationOutput<T extends Method> =
    // Primitive types
    T extends 'bool' ? ReturnType<typeof ensureBoolean> :
      T extends 'number' ? ReturnType<typeof ensureValidNumber> :
        T extends 'decimal' ? ReturnType<typeof ensureValidDecimal> :
          T extends 'string' ? ReturnType<typeof ensureValidString>:
            // String variants
            T extends 'string+lower' ? ReturnType<typeof ensureValidString>:
              T extends 'string+lower+trim' ? ReturnType<typeof ensureValidString>:
                T extends 'string+upper' ? ReturnType<typeof ensureValidString>:
                  T extends 'string+upper+trim' ? ReturnType<typeof ensureValidString>:
                    T extends 'string+trim' ? ReturnType<typeof ensureValidString>:
                      T extends 'email' ? ReturnType<typeof ensureValidString>:
            // Date & Time functions
            T extends 'date' ? ReturnType<typeof ensureValidDateStrict>:
              T extends 'dateOrTimestamp' ? ReturnType<typeof ensureValidDateStrict>:
                T extends 'dateTime' ? ReturnType<typeof ensureValidDateTimeStrict>:
                  T extends 'dateTimeOrTimestamp' ? ReturnType<typeof ensureValidDateTimeStrict>:
                    T extends 'timestamp' ?  ReturnType<typeof ensureValidTimestampStrict> :
                      T extends 'timestamp' ?  ReturnType<typeof ensureValidTimestampStrict> :
                        T extends 'time' ? ReturnType<typeof ensureValidTime> :
            // Arrays
            T extends 'arrayOf' ? ReturnType<typeof ensureArrayOfNumbers> :
              T extends 'arrayOfNumbers' ? ReturnType<typeof ensureArrayOfNumbers> :
                T extends 'keep' ?  any:
                never;

// export interface EnsureResultBase<T extends Method> {
//   // initialValue
//   iValue: any;
//   // currentValue
//   cValue: OperationOutput<T>;
// }

// prettier-ignore
export type EnsureResult<T extends Method> = {
    // initialValue
    iValue: any;
    // currentValue
    cValue: OperationOutput<T>;
    errorMsg?: any;
    errorCode?: ERROR_CODE;
  }

// prettier-ignore
export type EnsureOutput<T extends Method, Y extends boolean = true> =
  Y extends true ? EnsureResult<T> : 
    Y extends false ? OperationOutput<T> : 
      never;

export interface ErrorBuilderOptions {
  method: Method;
  errorMsg: string;
  errorCode: ERROR_CODE;
  options: EnsureOptions<any>;
}

// prettier-ignore
export interface EnsureInstanceOptions {
  errorBuilder?: (opts: ErrorBuilderOptions) => any;
  // The ensure mode
  eMode?: Mode;
  /**
   * When true, your instance will automatically consider allowNull to be true
   */
  allowNull?: boolean;
}

export type EnsureOptions<
  T extends Method,
  Y extends boolean = true
> = Options<T> &
  EnsureInstanceOptions & {
    // The field name to be returned in error message
    eField?: string;
    eReturnObject?: Y;
    defaultValue?: any;
    allowNull?: boolean;
    nullTo?: any;
  };

export function createInstance(opts: EnsureInstanceOptions) {
  const _opts = opts;
  return function <T extends Method, Y extends boolean>(
    method: T,
    value: any,
    options?: Omit<EnsureOptions<T>, 'eMode' | 'errorBuilder' | 'allowNull'>
  ): EnsureOutput<T, Y> {
    return ensureX(method, value, {
      ...options,
      eMode: _opts.eMode,
      allowNull: _opts.allowNull,
      errorBuilder: _opts.errorBuilder,
    } as EnsureOptions<T>);
  };
}

export enum ERROR_CODE {
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_VALUE = 'INVALID_VALUE',
}
const stringMethods: Method[] = [
  'string',
  'string+lower',
  'string+lower+trim',
  'string+upper',
  'string+upper+trim',
  'string+trim',
  'email',
];

function isDateTime(str: string) {
  const isoDateTimeRegex = /^(\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?::\d{2})?)$/;
  return isoDateTimeRegex.test(str);
}
function isDate(str: string) {
  const isoDateTimeRegex = /^(\d{4}-\d{2}-\d{2})$/;
  return isoDateTimeRegex.test(str);
}

// mode: E, private method: Operation, value: string, options: any
export function ensureX<T extends Method, Y extends boolean>(
  method: T,
  value: any,
  options?: EnsureOptions<T>
): EnsureOutput<T, Y> {
  options = options || ({} as any);
  if (method === 'keep') return value;
  let mode = options.eMode ?? 'SOFT';
  let defaultValue = options.defaultValue; // default = void 0
  /**
   * Code Trick:
   * To ensure that all methods return the same defaultValue,
   * I set it on purpose to void 0 but I store a reference to the
   * desired value.
   *
   * So if the return type is the defaultValue, that's because
   */
  options.defaultValue = void 0;
  options.eMode = void 0; // unset mode to prevent side effects in child method options
  let iValue = value;
  let valueIsSet = value !== void 0;
  let valueIsNull = value === null;
  let output: any;
  let verifyOutput = true;
  if (valueIsNull && 'nullTo' in options) {
    output = options.nullTo; // any value provided (undefined, null, 0, will be accepted)
    verifyOutput = false;
  } else if (options.allowNull && valueIsNull) {
    output = null;
    verifyOutput = false;
  } else {
    if (method === 'bool') {
      output = ensureBoolean(value, options);
    } else if (method === 'number') {
      output = ensureValidNumber(value, options);
    } else if (method === 'decimal') {
      output = ensureValidDecimal(value, options);
    } else if (stringMethods.includes(method)) {
      const parts = method.split('+');
      const opts = options as Options<'string'>;
      if (method === 'email') {
        // sanitize
        opts.trim = true;
        opts.transform = 'lowerCase';
      } else {
        if (parts.length > 1) {
          if (parts.includes('trim')) {
            opts.trim = true;
          }
          if (parts.includes('lower')) {
            opts.transform = 'lowerCase';
          } else if (parts.includes('upper')) {
            opts.transform = 'upperCase';
          }
        }
      }
      if (opts.allowNull && value === '') {
        /*Automatically cast empty string to null when null is accepted @todo: Add option to disable this behaviour*/
        output = null;
      } else {
        output = ensureValidString(value, opts);
      }
      if (method === 'email') {
        if (output !== void 0) {
          output = ensureValidEmail(output, {
            allowNull: opts.allowNull,
          });
        }
      }
    } else if (method === 'time') {
      output = ensureValidTime(value, options);
    } else if (method === 'date') {
      output = ensureValidDateStrict(value, options);
    } else if (method === 'dateTime') {
      output = ensureValidDateTimeStrict(value, options);
    } else if (method === 'timestamp') {
      output = ensureValidTimestampStrict(value, options);
    } else if (
      method === 'dateOrTimestamp' ||
      method === 'dateTimeOrTimestamp'
    ) {
      if (typeof value === 'string') {
        if (isDateTime(value)) {
          output = ensureValidDateTimeStrict(value, options);
        } else if (isDate(value)) {
          output = ensureValidDateStrict(value, options);
        } else {
          output = ensureValidTimestampStrict(value, options);
        }
      } else {
        output = ensureValidTimestampStrict(value, options);
      }
    } else if (method === 'arrayOf') {
      output = ensureArrayOf(
        value,
        (options as any as ArrayOfOptions)?.validatorFn
      );
    } else if (method === 'arrayOfNumbers') {
      output = ensureArrayOfNumbers(
        value,
        options as any as ArrayOfNumberOptionsWithDefaults
      );
    }
  }
  const getError = (_valueIsSet: boolean) => {
    let msg: string, code: ERROR_CODE, error: any;
    msg = _valueIsSet
      ? 'Provided value ' +
        (options.eField ?? '-') +
        ' is not a valid "' +
        method +
        '".'
      : 'Required field "' + (options.eField ?? '-') + '" was not provided.';
    code = _valueIsSet
      ? ERROR_CODE.INVALID_VALUE
      : ERROR_CODE.MISSING_REQUIRED_FIELD;
    error = new Error(msg);
    error.code = code;
    return {
      msg,
      code,
      error,
    };
  };
  if (verifyOutput) {
    const errRes = getError(valueIsSet);
    if (
      (mode === 'strict' && output === void 0) ||
      (mode === 'strict_if_provided' && valueIsSet && output === void 0)
    ) {
      if (typeof options.errorBuilder === 'function') {
        throw options.errorBuilder({
          method,
          errorMsg: errRes.msg,
          errorCode: errRes.code,
          options,
        });
      } else {
        throw errRes.error;
      }
    } else if (
      (mode === 'strict' || (mode === 'strict_if_provided' && valueIsSet)) &&
      (method === 'arrayOf' || method === 'arrayOfNumbers') &&
      output?.length !== value?.length
    ) {
      if (typeof options.errorBuilder === 'function') {
        throw options.errorBuilder({
          method,
          errorMsg: errRes.msg,
          errorCode: errRes.code,
          options,
        });
      } else {
        throw errRes.error;
      }
    } else {
      let finalOutputValue = output === void 0 ? defaultValue : output;
      if (options.eReturnObject === true) {
        return <EnsureOutput<T, Y>>{
          cValue: finalOutputValue,
          iValue,
          errorMsg: errRes.msg,
          errorCode: errRes.code,
        };
      } else {
        return finalOutputValue;
      }
    }
  } else {
    return output;
  }
}
