import { Moment } from "moment";
import { isNullOrUndefinedOrEmptyStr } from "../utils/is-null-or-undefined-or-empty-str";
import moment = require("moment");

export function ensureValidDate(
  date: any,
  defaultValue = void 0,
  inputFormat = "YYYY-MM-DD"
): Moment {
  const nullOrUndefinedOrEmpty = isNullOrUndefinedOrEmptyStr(date);
  if (nullOrUndefinedOrEmpty) {
    return defaultValue;
  } else if (date) {
    let m: Moment;
    if (moment.isMoment(date)) { // Check if is moment object.
      m = date;
    } else if (moment.isDate(date)) {
      m = moment(date);
    } else {
      m = moment(date, inputFormat, null);
    }
    if (m.isValid()) {
      return m;
    } else {
      return defaultValue;
    }
  }
}
