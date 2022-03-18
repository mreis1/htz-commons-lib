/**
 * Combines decimal or array of decimals or array of hex values into a buffer
 * @param args
 */
export function combineHex(...args) {
  const arr = [];
  args.forEach((value) => {
    if (value !== void 0 && value != null) {
      const isBuffer = Buffer.isBuffer(value);
      const value2 = isBuffer || Array.isArray(value) ? value : [value];
      if (!isBuffer) {
        // When a buffer is not provided, only numbers are accepted.
        for (const v of value2) {
          if (typeof v !== 'number') {
            throw new Error('Invalid input value');
          }
        }
      }
      arr.push.apply(arr, value2);
    } else {
      throw new Error('Invalid input value');
    }
  });
  return Buffer.from(arr);
}
