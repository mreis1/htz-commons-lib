import { ensureValidDate, EnsureValidDateOpts } from './ensure-valid-date';

/**
 * Ensures that input format respects a timestamp format.  
 * An alias for:
 *  ensureValidDate(value, {inputFormat: 'YYYY-MM-DD HH:mm:ss'})
 *
 * @param value
 * @param options
 */
export function ensureValidDateTime(value, options?: EnsureValidDateOpts) {
  options = options || {} as any;
  options.inputFormat = 'YYYY-MM-DD HH:mm:ss';
  return ensureValidDate(value, options);
}
