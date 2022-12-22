import { ensureValidNumber } from './ensure-valid-number';
import { paddingLeft } from '../utils/padding';

export interface IValidTimeResult {
  str: string; // A time string with the output in the following format HH:mm:ss
  h: number;
  m: number;
  s: number;
  sTime: number; // The total time in seconds
}

/**
 * @param srcStr
 * @param options
 * @returns void if value is not valid
 */
export function ensureValidTime(
  srcStr,
  options?: { defaults: { m: number; s: number } }
): IValidTimeResult {
  let DEFAULT_VALUE = 0;
  options = options || ({} as any);
  if ('defaults' in options) {
    if (!('m' in options.defaults)) {
      options.defaults.m = DEFAULT_VALUE;
    }
    if (!('s' in options.defaults)) {
      options.defaults.s = DEFAULT_VALUE;
    }
  } else {
    options = {
      defaults: {
        m: DEFAULT_VALUE,
        s: DEFAULT_VALUE,
      },
    };
  }
  if (typeof srcStr === 'string') {
    let parts = srcStr.split(':');
    let h,
      m,
      s,
      len = parts.length;
    m = options.defaults.m;
    s = options.defaults.s;


    if (len >= 1) {
      h = ensureValidNumber(parts[0]);
      // Not between 0 and 23
      if (!(h >= 0 && h <= 23)) {
        return void 0;
      }
    }
    if (len >= 2) {
      m = ensureValidNumber(parts[1]);
      // Not between 0 and 59
      if (!(m >= 0 && m <= 59)) {
        return void 0;
      }
    }
    if (len >= 3) {
      s = ensureValidNumber(parts[2]);
      if (!(s >= 0 && s <= 59)) {
        return void 0;
      }
    }

    return {
      str:
        paddingLeft(h.toString(), 2, '0') +
        ':' +
        paddingLeft(m.toString(), 2, '0') +
        ':' +
        paddingLeft(s.toString(), 2, '0'),
      h,
      m,
      s,
      sTime: h * 60 * 60 + m * 60 + s,
    };
  }
}
