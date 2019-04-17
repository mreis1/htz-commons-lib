/**
 * Converts a hex string to buffer
 *
 * @param value
 */
export function hexToBuffer(value) {
  const type = typeof value;
  if (type === 'string') {
    return Buffer.from(value, 'hex');
  } else if (type === 'object') {
    if (Buffer.isBuffer(value)) {
      return value;
    }
  }
}
