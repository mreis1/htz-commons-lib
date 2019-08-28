import { stringifyError } from "./stringify-error";

let err = new Error('XXX');
let errStr = stringifyError(err);
console.log(errStr)
test('stringifyError', () => {
  expect(errStr.indexOf(`"message":"XXX"`))
    .not.toBe(-1);
  expect(errStr.indexOf(`"stack":"Error:`))
    .not.toBe(-1);
});

