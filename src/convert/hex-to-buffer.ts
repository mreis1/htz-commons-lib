/**
 * Converts a hex string to buffer
 *
 * @param value
 */
export function hexToBuffer(value) {
  const type = typeof value;
  if (type === 'string') {
    value = value.replace(/[^a-zA-Z0-9]+/g, '');
    return Buffer.from(value, 'hex');
  } else if (type === 'object') {
    if (Buffer.isBuffer(value)) {
      return value;
    }
  }
}
