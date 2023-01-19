import { Moment } from 'moment';
import { isNullOrUndefinedOrEmptyStr } from '../utils';
import moment from 'moment';

export enum DateFormatRegMapBaseOpts {
  'YYYY-MM-DD',
  'YYYY-MM-DD HH:mm:ss',
  /**
   * ISOString:
   * An example can be obtained through:
   * new Date().toISOString() method returns a string in simplified extended ISO format (ISO_8601),
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
   */
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

interface IDefaultOptions {
  allowNull: boolean;
  /**
   *
   * - Ignore (use case to consider):
   *    You pass a string to server, since we are in ignore mode,
   *    string will be passed to moment directly and we relly on it's parsing capabilities.
   *
   *    ```
   *      moment('2022-12-13T09:00:28.371Z', 'YYYY-MM-DD').isValid()
   *    => true
   *   ```
   * - defaultValue:
   *    String will be matches against a regexp and if value is incorrect it will return the default value
   *
   * @default DEFAULTS.onInvalidStringFormat<'ignore'>
   */
  onInvalidStringFormat: OnInvalidStringFormat;
  inputFormat: KnownDateFormats | (string & {});
}

/**
 * See info in EnsureValidDateOpts.onInvalidStringFormat
 */
export type OnInvalidStringFormat = 'ignore' | 'defaultValue' | 'throw';

export interface EnsureValidDateOpts extends Partial<IDefaultOptions> {
  defaultValue?: any;
  /**
   * When true, if input data is null null will be preserved
   * @default: false
   */
  allowNull?: boolean;
}

export type EnsureValidDateOptsSimple = Omit<
  EnsureValidDateOpts,
  'defaultValue' | 'inputFormat'
>;

const DEFAULTS = {
  allowNull: false,
  onInvalidStringFormat: <OnInvalidStringFormat>'ignore',
  inputFormat: <KnownDateFormats>'YYYY-MM-DD',
};

/**
 * Ensures that input is a valid date.
 * If a string a is provided we'll use inputFormat to parse the date.
 * Make sure to provide the appropriate format.
 */
function _ensureValidDate(date: any, options?: EnsureValidDateOpts): Moment {
  const nullOrUndefinedOrEmpty = isNullOrUndefinedOrEmptyStr(date);
  const defaultValue: any = options.defaultValue;
  const isMoment = moment.isMoment(date);
  const isDate = !isMoment && moment.isDate(date);
  // ----
  let inputFormat = options.inputFormat;
  let onInvalidStringFormat: OnInvalidStringFormat =
    options.onInvalidStringFormat;
  let allowNull: boolean = options.allowNull;

  if (nullOrUndefinedOrEmpty) {
    if (allowNull && date === null) {
      return null;
    }
    return defaultValue;
  } else if (date) {
    let m: Moment;
    if (isMoment) {
      if (!date.isValid) {
        return defaultValue;
      }
      // Check if is moment object.
      m = date;
    } else if (isDate) {
      m = moment(date);
    } else if (typeof date === 'string') {
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
        if (inputFormat === 'ISOString') {
          m = moment(date, moment.ISO_8601);
        } else {
          m = moment(date, inputFormat);
        }
      } else {
        // Notice, if onInvalidStringFormat = 'ignore'
        // we leave moment decide how to parse the date
        m = moment(date);
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

export type EnsureValidDateSignature1 = (
  data: any,
  options?: EnsureValidDateOpts
) => Moment;
export type EnsureValidDateSignature2 = (
  data: any,
  defaultValue?: string | Date | moment.Moment | any,
  inputFormat? /*= 'YYYY-MM-DD'*/,
  simpleOpts?: EnsureValidDateOptsSimple
) => Moment;
export type EnsureValidDateSignature = EnsureValidDateSignature1 &
  EnsureValidDateSignature2;

/**
 * @param generalDefaults
 * @param customDefaults
 */
export function _defaultsSet(
  generalDefaults: IDefaultOptions,
  customDefaults: IDefaultOptions
): IDefaultOptions {
  const defaults = { ...generalDefaults }; // Initialize with DEFAULTS
  // Then patch with createInstance defaults
  Object.keys(customDefaults).forEach((key) => {
    const k = <keyof IDefaultOptions>key;
    if (k === 'inputFormat') {
      if (typeof customDefaults[key] === 'string') {
        defaults[k] = customDefaults[key];
      }
    } else if (k === 'onInvalidStringFormat') {
      const o: OnInvalidStringFormat[] = ['defaultValue', 'ignore', 'throw'];
      if (o.includes(customDefaults[k])) {
        defaults[k] = customDefaults[key];
      }
    } else if (k === 'allowNull') {
      if (typeof customDefaults[key] === 'boolean') {
        defaults[k] = customDefaults[key];
      }
    }
  });
  return defaults;
}

export function createInstance(
  defaultOptions: IDefaultOptions
): EnsureValidDateSignature {
  const defaults = _defaultsSet(DEFAULTS, defaultOptions);
  return <any>((data: any, ...args: any[]): Moment => {
    const callDefaults = { ...defaults };
    const isMomentDefaultValue = moment.isMoment(args[0]);
    const isDateDefaultValue = !isMomentDefaultValue && moment.isDate(args[0]);
    const isModernCall =
      args.length === 1 &&
      typeof args[0] === 'object' &&
      !isMomentDefaultValue &&
      !isDateDefaultValue; // Note this line of statement
    if (!isModernCall) {
      // Transform a simpleCall into a modern call
      const callOptions = args[2] ? args[2] : {};
      callOptions.inputFormat = args[1];
      callOptions.defaultValue = args[0];
      const p = _defaultsSet(callDefaults, callOptions);
      const options = {
        ...callDefaults,
        ...callOptions,
        ...p,
      };
      return _ensureValidDate(data, options);
    } else {
      const p = _defaultsSet(callDefaults, args[0]);
      const options = {
        ...callDefaults,
        ...args[0],
        ...p,
      };
      return _ensureValidDate(data, options);
    }
  });
}

/**
 * @deprecated Use ensureValidDateStrict() instead
 */
export const ensureValidDate = createInstance({
  onInvalidStringFormat: 'ignore',
  inputFormat: 'YYYY-MM-DD',
  allowNull: false,
});

/**
 * The new way to evaluate dates.
 *
 * Same as ensureValidDate with slightly differences:
 * - Different defaults
 * - Received input must match a particular string format (regex) which means
 *    passing timestamps will obviously endup returning the defaultValue
 *
 *
 *    Deprecation warning: value provided is not in a recognized RFC2822 or ISO format.
 *    moment construction falls back to js Date(), which is not reliable across all browsers and versions.
 *    Non RFC2822/ISO date formats are discouraged. Please refer to http://momentjs.com/guides/#/warnings/js-date/ for more info.
 */
export const ensureValidDateStrict = createInstance({
  onInvalidStringFormat: 'defaultValue',
  inputFormat: 'YYYY-MM-DD',
  allowNull: false,
});

export const ensureValidTimestampStrict = createInstance({
  onInvalidStringFormat: 'defaultValue',
  inputFormat: 'ISOString',
  allowNull: false,
});
