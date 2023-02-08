import {
  createInstance,
  ensureValidDate,
  EnsureValidDateOpts,
} from './ensure-valid-date';

/**
 *
 * Ensures that input format respects a timestamp format.
 * An alias for:
 *  ensureValidDate(value, {inputFormat: 'YYYY-MM-DD HH:mm:ss'})
 *
 * @deprecated Use ensureValidDateTimeStrict instead
 */
export function ensureValidDateTime(value, options?: EnsureValidDateOpts) {
  options = options || ({} as any);
  options.inputFormat = 'YYYY-MM-DD HH:mm:ss';
  return ensureValidDate(value, options);
}
export const ensureValidDateTimeStrict = createInstance({
  onInvalidStringFormat: 'defaultValue',
  inputFormat: 'YYYY-MM-DD HH:mm:ss',
  allowNull: false,
});
