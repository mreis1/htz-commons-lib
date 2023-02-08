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

export enum EnsureMode {
  /**
   * Assumed the field is required and expects a valid value to be provided
   */
  STRICT = 1,
  /**
   * Assumed field is not essential,
   * if an invalid value is provided it will silently default to the
   * defaultValue
   */
  SOFT = 2,
  /**
   * Assumes value is not required but if it was provided,
   * then a valid value is necessary otherwise and exception will be produced.
   */
  STRICT_IF_PROVIDED = 3,
}
export type Mode = keyof typeof EnsureMode;
export enum Operations {
  arrayOf,
  arrayOfNumbers,
  bool,
  number,
  decimal,
  string,
  time,
  date,
  dateTime,
  timestamp,
}
export type Operation = keyof typeof Operations;

type ArrayOfOptions = { validatorFn: ArrayOfValidatorFn };

type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;

// prettier-ignore
export type Options<T extends Operation> =
    // Primitive types
    T extends 'bool' ? EnsureBooleanOptsWithDefault :
      T extends 'number' ? EnsureValidNumberOptions :
        T extends 'decimal' ? EnsureDecimalOptions :
          T extends 'string' ? EnsureValidStringOpts :
            // Date & Time functions
            T extends 'date' ? EnsureValidDateOpts :
              T extends 'dateTime' ? EnsureValidDateOpts :
                T extends 'timestamp' ?  EnsureValidDateOpts :
                  T extends 'time' ? EnsureValidTimeOptions :
                    // Arrays
                      T extends 'arrayOf' ? { validatorFn: ArrayOfValidatorFn } :
                        T extends 'arrayOfNumbers' ? ArrayOfNumberOptionsWithDefaults :
                          never;

// prettier-ignore
export type OperationOutput<T extends Operation> =
    // Primitive types
    T extends 'bool' ? ReturnType<typeof ensureBoolean> :
      T extends 'number' ? ReturnType<typeof ensureValidNumber> :
        T extends 'decimal' ? ReturnType<typeof ensureValidDecimal> :
          T extends 'string' ? ReturnType<typeof ensureValidString>:
            // Date & Time functions
            T extends 'date' ? ReturnType<typeof ensureValidDateStrict>:
              T extends 'dateTime' ? ReturnType<typeof ensureValidDateTimeStrict>:
                T extends 'timestamp' ?  ReturnType<typeof ensureValidTimestampStrict> :
                  T extends 'time' ? ReturnType<typeof ensureValidTime> :
                    // Arrays
                    T extends 'arrayOf' ? ReturnType<typeof ensureArrayOfNumbers> :
                      T extends 'arrayOfNumbers' ? ReturnType<typeof ensureArrayOfNumbers> :
                        never;

export interface EnsureResultBase<T extends Operation> {
  // initialValue
  iValue: any;
  // currentValue
  cValue: OperationOutput<T>;
}

// prettier-ignore
export type EnsureResult<T extends Operation> = {
    // initialValue
    iValue: any;
    // currentValue
    cValue: OperationOutput<T>;
    errorMsg?: any;
    errorCode?: ERROR_CODE;
  }

// prettier-ignore
export type EnsureOutput<T extends Operation, Y extends boolean = true> = 
  Y extends true ? EnsureResult<T> : 
    Y extends false ? OperationOutput<T> : 
      never;

export interface ErrorBuilderOptions {
  method: Operation;
  errorMsg: string;
  errorCode: ERROR_CODE;
  options: EnsureOptions<any>;
}

// prettier-ignore
export interface EnsureInstanceOptions {
  errorBuilder?: (opts: ErrorBuilderOptions) => any;
  // The ensure mode
  eMode?: Mode;
}

export type EnsureOptions<
  T extends Operation,
  Y extends boolean = true
> = Options<T> &
  EnsureInstanceOptions & {
    // The field name to be returned in error message
    eField?: string;
    eReturnObject?: Y;
    defaultValue?: any;
    allowNull?: boolean;
  };

export function createInstance(opts: EnsureInstanceOptions) {
  const _opts = opts;
  return function <T extends Operation, Y extends boolean>(
    method: T,
    value: any,
    options?: Omit<EnsureOptions<T>, 'eMode' | 'errorBuilder'>
  ): EnsureOutput<T, Y> {
    return ensure(method, value, {
      ...options,
      eMode: _opts.eMode,
      errorBuilder: _opts.errorBuilder,
    } as EnsureOptions<T>);
  };
}

export enum ERROR_CODE {
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  INVALID_VALUE = 'INVALID_VALUE',
}

// mode: E, private method: Operation, value: string, options: any
export function ensure<T extends Operation, Y extends boolean>(
  method: T,
  value: any,
  options?: EnsureOptions<T>
): EnsureOutput<T, Y> {
  options = options || ({} as any);
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
  if (options.allowNull && valueIsNull) {
    console.log('options.allowNull && valueIsNull');
    output = null;
  } else {
    if (method === 'bool') {
      output = ensureBoolean(value, options);
    } else if (method === 'number') {
      output = ensureValidNumber(value, options);
    } else if (method === 'decimal') {
      output = ensureValidDecimal(value, options);
    } else if (method === 'string') {
      output = ensureValidString(value, options as EnsureValidStringOpts);
    } else if (method === 'time') {
      output = ensureValidTime(value, options);
    } else if (method === 'date') {
      output = ensureValidDateStrict(value, options);
    } else if (method === 'dateTime') {
      output = ensureValidDateTimeStrict(value, options);
    } else if (method === 'timestamp') {
      output = ensureValidTimestampStrict(value, options);
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
      ? 'Provided value is not a valid "' + method + '".'
      : 'Required field not provided.';
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
  const errRes = getError(valueIsSet);
  if (
    (mode === 'STRICT' && output === void 0) ||
    (mode === 'STRICT_IF_PROVIDED' && valueIsSet && output === void 0)
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
}