/**
 * Combines decimal or array of decimals or buffer into a buffer
 * Strings are not accepted - if you provide a string you will
 * @Usage
 *    combineHex([100,20,30], Buffer.from('SOME_UTF8_VALUE'), )
 *
 * @param args
 */
export function combineHex(...args) {
  const arr = [];
  args.forEach((value) => {
    if (value !== void 0 && value != null) {
      const isBuffer = Buffer.isBuffer(value) || value instanceof Buffer;
      const isArray = Array.isArray(value);
      const tOfValue = typeof value;
      if (!isBuffer && !isArray) {
        if (tOfValue !== 'number') {
          throw new TypeError(
            `Invalid input value. Expected number, array or buffer but got ${typeof value}`
          );
        }
      }
      const value2 = [];
      if (isBuffer) {
        value2.push(...value);
      } else if (isArray) {
        /*Array validation */ const data = [];
        value.forEach((item) => {
          if (Array.isArray(item)) {
            if (item.filter((v) => typeof v !== 'number').length) {
              throw new TypeError('Invalid array');
            } else {
              data.push(...item);
            }
          } else if (Buffer.isBuffer(item)) {
            data.push(...item);
          } else {
            data.push(item);
          }
        });
        value2.push(...data);
      } else {
        value2.push(value);
      }

      arr.push.apply(arr, value2);
    } else {
      throw new Error('Invalid input value');
    }
  });
  return Buffer.from(arr);
}
