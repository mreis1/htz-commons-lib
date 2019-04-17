// * @property {number} [dataBits=8] Must be one of these: 8, 7, 6, or 5.
const accepted = [8, 7, 6, 5];
export function ensureValidDataBits(value: number, defaultValue?) {
  if (accepted.indexOf(value) >= 0) {
    return value;
  } else {
    return defaultValue;
  }
}
