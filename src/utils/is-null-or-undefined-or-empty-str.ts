export function isNullOrUndefinedOrEmptyStr(
  str: string,
  options: { trim: boolean } = { trim: true }
) {
  if (typeof str === 'string') {
    return str.trim() === '';
  } else {
    if (str === null || str === void 0) {
      return true;
    }
  }
}
