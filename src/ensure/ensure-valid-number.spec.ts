import { ensureValidNumber } from './ensure-valid-number';

describe('#ensureValidNumber', function () {
  it('Should return void 0', function () {
    expect(ensureValidNumber('1.1a')).toBe(void 0);
    expect(ensureValidNumber('1.11')).toBe(void 0); // Without convertDecimal
    expect(ensureValidNumber('1.11.11')).toBe(void 0);
    expect(ensureValidNumber({})).toBe(void 0);
  });

  it('Should return default value', function () {
    expect(ensureValidNumber('1.1a', 1)).toBe(1);
    expect(ensureValidNumber('1.11', 1)).toBe(1); // Without convertDecimal
    expect(ensureValidNumber('1.11.11', 1)).toBe(1);
    expect(ensureValidNumber({}, 1)).toBe(1);
  });

  it('Should parse string of decimals', function () {
    expect(ensureValidNumber('2.1a', void 0, { convertDecimal: true })).toBe(
      void 0
    );
    expect(ensureValidNumber('2.11', void 0, { convertDecimal: true })).toBe(2);
    expect(ensureValidNumber('2,11', void 0, { convertDecimal: true })).toBe(2);
  });

  it('Should parse numbers', function () {
    expect(ensureValidNumber(2.22, void 0, { convertDecimal: true })).toBe(2);
    expect(ensureValidNumber(2.22, void 0, { convertDecimal: false })).toBe(
      void 0
    );
    expect(ensureValidNumber(2, void 0, { convertDecimal: true })).toBe(2);
  });

  it('Should parse negative numbers', function () {
    expect(
      ensureValidNumber(-2.22, void 0, {
        convertDecimal: true,
        allowNegative: true,
      })
    ).toBe(-2);
    expect(
      ensureValidNumber(-2, void 0, {
        convertDecimal: true,
        allowNegative: true,
      })
    ).toBe(-2);
    expect(
      ensureValidNumber('-2', void 0, {
        convertDecimal: false,
        allowNegative: true,
      })
    ).toBe(-2);
    expect(
      ensureValidNumber(-2, void 0, {
        convertDecimal: false,
        allowNegative: true,
      })
    ).toBe(-2);
    expect(
      ensureValidNumber('-2.22', void 0, {
        convertDecimal: false,
        allowNegative: true,
      })
    ).toBe(void 0); // It's a decimal with decimal flag off
    expect(
      ensureValidNumber('-2.22', void 0, {
        convertDecimal: true,
        allowNegative: true,
      })
    ).toBe(-2);

    expect(
      ensureValidNumber('-2', void 0, {
        convertDecimal: true,
        allowNegative: false,
      })
    ).toBe(void 0); // Negative not allowed
  });
});
