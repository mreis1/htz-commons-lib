import { ensureValidDecimal } from './ensure-valid-decimal';

describe('ensure-valid-decimal.spec.ts', function() {
  test('Handles comma decimals by default', function() {
    var result = ensureValidDecimal('123,23');
    expect(result).toBe(123.23);
  });
});
