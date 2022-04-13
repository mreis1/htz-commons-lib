import { ensureValidDecimal } from './ensure-valid-decimal';

describe('ensure-valid-decimal.spec.ts', function () {
  test('Integer should be accepted', function () {
    var result = ensureValidDecimal(12);
    expect(result).toBe(12);
  });
  test('Handles comma decimals by default', function () {
    var result = ensureValidDecimal('123,23');
    expect(result).toBe(123.23);
  });
  test('Handles negative numbers', function () {
    var result = ensureValidDecimal('-123,23');
    expect(result).toBe(-123.23);
  });
});
