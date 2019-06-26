import { ensureValidDate } from "./ensure-valid-date";
import moment = require("moment");

describe("ensure-valid-date.spec.ts", function() {
  test("A Date object should be reused if provided", function() {
    let d = new Date();
    expect(ensureValidDate(d)).toBeDefined();
  });
  test("A Moment object should be reused if provided", function() {
    let d = moment();
    let r = ensureValidDate(d);
    let formatStr = "YYYY-MM-DD";
    expect(r).toBeDefined();
    expect(r.format(formatStr)).toEqual(d.format(formatStr));
  });
  test("A string should be reused if provided", function() {
    let d = new Date();
    let input = "2019-06-20";
    let r = ensureValidDate(input);
    let formatStr = "YYYY-MM-DD";
    expect(r && r.format(formatStr)).toEqual(input);
  });
});
