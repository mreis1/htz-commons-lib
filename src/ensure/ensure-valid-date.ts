import { Moment } from 'moment';
import { isNullOrUndefinedOrEmptyStr } from '../utils';
import moment from 'moment';

export enum DateFormatRegMapBaseOpts {
  'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm:ss',
  'ISOString',
}
export type KnownDateFormats = keyof typeof DateFormatRegMapBaseOpts;
/**
 * § RegExpEntry
 * ['^[\\d]{4,4}-[\\d]{2,2}-[\\d]{2,2}$', 'g']
 * ['^[\\d]{4,4}-[\\d]{2,2}-[\\d]{2,2}$']
 */
export type RegExpEntry = [string] | [string, string];
export type RegExpMapKey = Record<KnownDateFormats, RegExpEntry> & {
  [key: string]: any;
};

/**
 * Use this if you want to extend
 */
const DATE_FORMAT_REGEXP_MAP: RegExpMapKey = {
  'YYYY-MM-DD': ['^[\\d]{4,4}-[\\d]{2,2}-[\\d]{2,2}$'],
  Date: ['^[\\d]{4,4}-[\\d]{2,2}-[\\d]{2,2}$'], // Same as YYYY-MM-DD
  'YYYY-MM-DD HH:mm:ss': [
    '^[\\d]{4,4}-[\\d]{2,2}-[\\d]{2,2} [\\d]{2,2}:[\\d]{2,2}:[\\d]{2,2}$',
  ],
  DateTime: [
    '^[\\d]{4,4}-[\\d]{2,2}-[\\d]{2,2} [\\d]{2,2}:[\\d]{2,2}:[\\d]{2,2}$',
  ], // Same as YYYY-MM-DD HH:mm:ss
  ISOString: [
    '^[\\d]{4,4}-[\\d]{2,2}-[\\d]{2,2}T[\\d]{2,2}:[\\d]{2,2}:[\\d]{2,2}.[\\d]{3,3}Z$',
  ], // Aka Timestamp string
};

/**
 * Use this to extend DATE_FORMAT_REGEXP_MAP
 * @param f
 * @param regExpEntry
 */
export function registerRegExp(f: string, regExpEntry: RegExpEntry) {
  DATE_FORMAT_REGEXP_MAP[f] = regExpEntry;
}

export function unregisterRegExp(f: string) {
  if (DATE_FORMAT_REGEXP_MAP[f] !== void 0) {
    DATE_FORMAT_REGEXP_MAP[f] = void 0;
  }
}
export type OnInvalidStringFormat = 'ignore' | 'defaultValue' | 'throw';
export interface Options {
  /**
   *
   * - ignore:
   *    Even if you pass a string that doesn't match the expected format this will work
   *    ```
   *      moment('2022-12-13T09:00:28.371Z', 'YYYY-MM-DD').isValid()
   *    => true
   *   ```
   * - defaultValue:
   *    String will be matches agains a regexp and if value is incorrect it will
   *
   * @default 'defaultValue'
   */
  onInvalidStringFormat?: OnInvalidStringFormat;
  /**
   * @default 'YYYY-MM-DD'
   */
  inputFormat?: string;
  defaultValue?: string;
  /**
   * When true, if input data is null null will be preserved
   * @default: false
   */
  allowNull?: boolean;
}
export type OptionsSimple = Omit<Options, 'defaultValue' | 'inputFormat'>;

const DEFAULTS = {
  allowNull: false,
  onInvalidStringFormat: <OnInvalidStringFormat>'ignore',
  inputFormat: <KnownDateFormats>'YYYY-MM-DD',
};
/**
 * Ensures that input is a valid date.
 * If a string a is provided we'll use inputFormat to parse the date.
 * Make sure to provide the appropriate format.
 *
 */
export function ensureValidDate(data: any, options?: Options);
export function ensureValidDate(
  data: any,
  defaultValue?,
  inputFormat? /*= 'YYYY-MM-DD'*/,
  simpleOpts?: OptionsSimple
);
export function ensureValidDate(date: any, ...args): Moment {
  const nullOrUndefinedOrEmpty = isNullOrUndefinedOrEmptyStr(date);
  let defaultValue: any;
  const isMoment = moment.isMoment(date);
  const isDate = !isMoment && moment.isDate(date);
  const isMomentDefaultValue = moment.isDate(args[0]);
  const isDateDefaultValue = !isMomentDefaultValue && moment.isDate(args[0]);

  // ----
  let inputFormat: string;
  let simpleOpts: OptionsSimple =
    args[2] && typeof args[2] === 'object' ? args[2] : void 0;
  let onInvalidStringFormat: OnInvalidStringFormat;
  let allowNull: boolean;

  inputFormat = typeof args[1] === 'string' ? args[1] : 'YYYY-MM-DD';

  if (simpleOpts) {
    onInvalidStringFormat = simpleOpts.onInvalidStringFormat;
    allowNull = simpleOpts.allowNull;
  }
  // Check if we are dealing with a options object as first argument
  // Which means we would be dealing with a method signature as follow: `ensureValidDate(data: any, options: Options)`
  else if (
    args[0] !== null &&
    args[0] !== void 0 &&
    typeof args[0] === 'object' &&
    !isMomentDefaultValue &&
    !isDateDefaultValue &&
    args.length === 1
  ) {
    let options = args[0] as Options;
    onInvalidStringFormat = options.onInvalidStringFormat;
    allowNull =
      typeof options.allowNull === 'boolean'
        ? options.allowNull
        : DEFAULTS.allowNull;
    inputFormat = options.inputFormat;
  } else {
    defaultValue = args[0]; // Probably undefined on basic calls
  }

  if (nullOrUndefinedOrEmpty) {
    if (allowNull && date === null) {
      return null;
    }
    return defaultValue;
  } else if (date) {
    let m: Moment;
    if (isMoment) {
      // Check if is moment object.
      m = date;
    } else if (isDate) {
      m = moment(date);
    } else if (typeof date === 'string') {
      inputFormat = inputFormat ?? DEFAULTS.inputFormat;
      if (
        onInvalidStringFormat === 'throw' ||
        onInvalidStringFormat === 'defaultValue'
      ) {
        const regExpStr = DATE_FORMAT_REGEXP_MAP[inputFormat];
        if (regExpStr === void 0) {
          throw new Error(
            'No RegExp available for format(' + inputFormat + ')'
          );
        }
        const exp = new RegExp(regExpStr); // Verify that strings matches
        if (!exp.test(date)) {
          if (onInvalidStringFormat === 'throw') {
            throw new Error('Input value has incorrect format');
          } else {
            return defaultValue;
          }
        }
        m = moment(date, inputFormat, null);
      } else {
        m = moment(date, inputFormat, null);
      }
    } else {
      return defaultValue;
    }
    if (m.isValid()) {
      return m;
    } else {
      return defaultValue;
    }
  }
}
