import { ensureValidNumber } from './ensure-valid-number';
import { ensureValidDecimal } from './ensure-valid-decimal';

/**
 * Takes an array and returns all numeric representations
 * @param data
 * @param defaultValue
 * @param options
 * @param options.decimals  (default: false)
 */
export function ensureArrayOfNumbers(data: any[], defaultValue?, options?: { decimals: boolean }) {
  options = options || { decimals: false };
  if (Array.isArray(data)) {
    return data
      .map(i => {
        if (options.decimals) {
          return ensureValidDecimal(i);
        } else {
          return ensureValidNumber(i);
        }
      })
      .filter(i => i !== void 0);
  } else {
    return defaultValue;
  }
}
