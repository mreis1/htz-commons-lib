/**
 * Converts decimal to HEX.
 * Can handle delphi conversion.
 *
 * <b>About delphi conversion:</b>
 * Delphi stores values as BGR instead of RGB
 *
 * For that reason
 *
 * b = 0
 * g = 5
 * r = 255
 * to be 1535 (in decimal)
 *
 * @param color
 * @param bgrMode  (Value are stored as BGR instead of RGB)
 */
export function colorDecimalToHex(color: number, bgrMode?: boolean) {
  let hex = color.toString(16);
  while (hex.length < 6) {
    hex = '0' + hex;
  }
  if (bgrMode) {
    let hexChar = hex.split('');
    let hexParts = [];
    let c = [];
    while (hexChar.length) {
      const v = hexChar.shift();
      if (c.length <= 1) {
        c.push(v);
      }
      if (c.length === 2) {
        const block = c.join('');
        hexParts.push(block);
        c = [];
      }
    }
    hex = hexParts.reverse().join('');
  }
  return hex;
}
