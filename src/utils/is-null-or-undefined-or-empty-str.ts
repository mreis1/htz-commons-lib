import { isNullOrUndefined } from "./is-null-or-undefined";

export function isNullOrUndefinedOrEmptyStr(
  str: string,
  options: { trim: boolean } = { trim: true }
) {
  if (isNullOrUndefined(str)) {
    return true;
  } else if (typeof str === "string") {
    return str.trim() === "";
  } else {
    return true;
  }
}
